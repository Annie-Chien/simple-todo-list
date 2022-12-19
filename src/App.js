//React Router
import { Routes, Route } from 'react-router-dom';
//Context
import TodoContextProvider from './store/TodoContextProvider';
//Components
import LoginPage from './pages/LoginPage';
import TodoAppPage from './pages/TodoAppPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import AuthContextProvider from './store/AuthContextProvider';

//===================================================//
function App() {
  return (
    <AuthContextProvider>
      <TodoContextProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodoAppPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </TodoContextProvider>
    </AuthContextProvider>
  );
}

export default App;
