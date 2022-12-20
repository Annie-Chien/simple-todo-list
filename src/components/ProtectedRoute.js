import { useContext } from 'react';
//React Router
import { Navigate } from 'react-router-dom';
import LoadingPage from '../pages/LoadingPage';
//Context
import { AuthContext } from '../store/AuthContextProvider';

//===================================================//

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user.uid) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
