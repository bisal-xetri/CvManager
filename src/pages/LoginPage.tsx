import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store';
import LoginForm from '@/components/auth/LoginForm';
import { Logo } from '@/components/ui/logo';

export default function LoginPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo className="h-12 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to CV Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your recruitment process effectively
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <LoginForm />
        </div>
      </div>
      
      <footer className="py-4 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500">
            &copy; 2025 CV Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}