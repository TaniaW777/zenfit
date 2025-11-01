import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutsList from './pages/WorkoutsList';
import AddWorkout from './pages/AddWorkout';
import WorkoutDetails from './pages/WorkoutDetails';

// Composant pour protéger les routes
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <WorkoutsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts/add"
            element={
              <ProtectedRoute>
                <AddWorkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts/:id"
            element={
              <ProtectedRoute>
                <WorkoutDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;