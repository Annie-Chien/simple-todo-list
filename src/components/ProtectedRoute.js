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
    console.log(isLoading);
    return <LoadingPage />;
  }

  if (user && user.uid) {
    console.log(user);
    return children;
  }

  console.log(isLoading, user);
  return <Navigate to="/" />;
};

export default ProtectedRoute;
