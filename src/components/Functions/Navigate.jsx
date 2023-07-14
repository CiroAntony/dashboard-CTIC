import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PreventNav = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }

    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
      window.history.go(1);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return null;
};

export default PreventNav;


