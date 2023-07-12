import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/App');
    }
  }, [navigate]);

  return null;
};

export default SessionCheck;
