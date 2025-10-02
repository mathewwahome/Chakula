import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
type AuthMode = 'login' | 'signup';
type UserRole = 'Restaurant' | 'Farmer' | 'Beneficiary' | 'Waste Partner';
const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [organization, setOrganization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    login,
    signup
  } = useAuth();
  const {
    showToast
  } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (mode === 'signup' && !role) {
      showToast('Please select a role', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      let success = false;
      if (mode === 'login') {
        success = await login(email, password, role as UserRole);
      } else {
        success = await signup(name, email, password, role as UserRole, organization);
      }
      if (success) {
        showToast(`${mode === 'login' ? 'Login' : 'Sign up'} successful!`, 'success');
        navigate(redirectPath);
      } else {
        showToast(`${mode === 'login' ? 'Login' : 'Sign up'} failed. Please try again.`, 'error');
      }
    } catch (error) {
      showToast(`An error occurred. Please try again.`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-neutral-dark mb-6">
        {mode === 'login' ? 'Login to your account' : 'Create an account'}
      </h2>
      <form onSubmit={handleSubmit}>
        {mode === 'signup' && <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
              Full Name
            </label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>
        {mode === 'signup' && <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['Restaurant', 'Farmer', 'Beneficiary', 'Waste Partner'] as UserRole[]).map(r => <label key={r} className="flex items-center p-3 border rounded-lg cursor-pointer">
                    <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="mr-2" />
                    <span>{r}</span>
                  </label>)}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="organization">
                Organization Name
              </label>
              <input id="organization" type="text" value={organization} onChange={e => setOrganization(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </>}
        <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-medium transition" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <div className="text-center mt-6">
        <p className="text-gray-600">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button type="button" onClick={toggleMode} className="ml-1 text-primary hover:underline focus:outline-none">
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>;
};
export default AuthForm;