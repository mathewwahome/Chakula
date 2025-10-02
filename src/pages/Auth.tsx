import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
const Auth: React.FC = () => {
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="bg-neutral-light min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <AuthForm />
          {redirectPath && <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                You'll be redirected to your desired page after logging in.
              </p>
            </div>}
        </div>
      </div>
    </div>;
};
export default Auth;