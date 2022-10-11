import { Navigate } from 'react-router-dom';
import { useContext } from 'react';

import { TodoContext } from '../store/TodoContextProvider';

export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(TodoContext);
  if (!user.uid) {
    // user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
