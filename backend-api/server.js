const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || 'FiAn"[JhepAVt&92',
  database: process.env.DB_NAME || "chakula_share_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
pool
  .getConnection()
  .then((connection) => {
    console.log("✓ MySQL Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("✗ MySQL Database connection failed:", err.message);
  });

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "f3a8c9d1b7e64f2aa98b5c14d7e2fbb01f937c2de8a046a7c1dfb082de6724a1"
    );

    const [users] = await pool.execute(
      "SELECT id, name, email, role, organization FROM users WHERE id = ?",
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.get("/api/v1/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
    data: {
      environment: process.env.NODE_ENV || "development",
      port: PORT,
    },
  });
});

// Auth Routes
// Signup endpoint
app.post("/api/auth/signup", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, email, password, role, organization } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, email, password, and role",
      });
    }

    // Validate role
    const validRoles = ["Restaurant", "Farmer", "Beneficiary", "Waste Partner"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be one of: " + validRoles.join(", "),
      });
    }

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, password, role, organization, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [name, email, hashedPassword, role, organization || null]
    );

    const userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Get the created user
    const [users] = await connection.execute(
      "SELECT id, name, email, role, organization, created_at FROM users WHERE id = ?",
      [userId]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: users[0],
    });
  } catch (error) {
    console.error("Signup error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    connection.release();
  }
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const [users] = await pool.execute(
      "SELECT id, name, email, password, role, organization FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check role if provided
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Invalid role for this user",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from response
    delete user.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
    });
  }
});

// Get current user endpoint (protected route)
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await pool.end();
  process.exit(0);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("Auth endpoints available:");
  console.log("  POST /api/auth/signup");
  console.log("  POST /api/auth/login");
  console.log("  GET  /api/auth/me (protected)");
});
