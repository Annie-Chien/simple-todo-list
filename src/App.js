import { Routes, Route } from 'react-router-dom';
import TodoContextProvider from './store/TodoContextProvider';
import LoginPage from './pages/LoginPage';
import TodoAppPage from './pages/TodoAppPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
function App() {
  return (
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
  );
}

export default App;
