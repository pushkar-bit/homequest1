import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShaderAnimation from '../components/ShaderAnimation';

export default function SuccessAnimation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('Welcome!');

  useEffect(() => {
    
    const role = location.state?.role || 'user';
    const userName = location.state?.userName || '';

    
    if (role === 'admin') {
      setMessage(`Welcome Admin${userName ? ', ' + userName : ''}!`);
    } else if (role === 'agent') {
      setMessage(`Welcome Agent${userName ? ', ' + userName : ''}!`);
    } else {
      setMessage(`Welcome${userName ? ', ' + userName : ''}!`);
    }

    
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ShaderAnimation />
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <h1 className="text-7xl font-bold text-white text-center tracking-tight animate-pulse">
          {message}
        </h1>
      </div>
    </div>
  );
}
