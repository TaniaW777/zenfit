import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workoutsAPI } from '../services/api';

function WorkoutsList() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            const data = await workoutsAPI.getAll();
            setWorkouts(data.workouts);
        } catch (err) {
            setError('Failed to load workouts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                await workoutsAPI.delete(id);
                setWorkouts(workouts.filter(w => w.id !== id));
            } catch (err) {
                alert('Failed to delete workout');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50">
            <nav className="bg-white shadow-md border-b border-teal-100">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1
                        onClick={() => navigate('/dashboard')}
                        className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer"
                    >
                        Zenfit
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 text-sm">Hello, {user?.first_name}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">My Workouts</h2>
                        <p className="text-gray-600 mt-1">Track your fitness journey</p>
                    </div>
                    <button
                        onClick={() => navigate('/workouts/add')}
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition shadow-md"
                    >
                        + Add Workout
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                        <p className="text-gray-600 mt-4">Loading workouts...</p>
                    </div>
                ) : workouts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center border border-teal-100">
                        <span className="text-6xl mb-4 block">💪</span>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No workouts yet</h3>
                        <p className="text-gray-600 mb-6">Start tracking your fitness journey today!</p>
                        <button
                            onClick={() => navigate('/workouts/add')}
                            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                        >
                            Create Your First Workout
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workouts.map((workout) => (
                            <div
                                key={workout.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-teal-100 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">{workout.title}</h3>
                                            <p className="text-sm text-gray-500">{formatDate(workout.date)}</p>
                                        </div>
                                        {workout.duration && (
                                            <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                {workout.duration} min
                                            </span>
                                        )}
                                    </div>

                                    {workout.exercises && workout.exercises.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                                {workout.exercises.length} exercise{workout.exercises.length > 1 ? 's' : ''}
                                            </p>
                                            <div className="space-y-1">
                                                {workout.exercises.slice(0, 3).map((ex, idx) => (
                                                    <p key={idx} className="text-sm text-gray-700">
                                                        • {ex.name}
                                                        {ex.sets && ex.reps && ` (${ex.sets}x${ex.reps})`}
                                                    </p>
                                                ))}
                                                {workout.exercises.length > 3 && (
                                                    <p className="text-sm text-gray-500 italic">
                                                        +{workout.exercises.length - 3} more...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {workout.notes && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 italic">
                                            "{workout.notes}"
                                        </p>
                                    )}

                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => navigate(`/workouts/${workout.id}`)}
                                            className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition text-sm font-semibold"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleDelete(workout.id)}
                                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkoutsList;