import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutsAPI } from '../services/api';

function WorkoutDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWorkout();
    }, [id]);

    const fetchWorkout = async () => {
        try {
            setLoading(true);
            const data = await workoutsAPI.getOne(id);
            setWorkout(data.workout);
        } catch (err) {
            setError('Failed to load workout');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                await workoutsAPI.delete(id);
                navigate('/workouts');
            } catch (err) {
                alert('Failed to delete workout');
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="text-gray-600 mt-4">Loading workout...</p>
                </div>
            </div>
        );
    }

    if (error || !workout) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Workout not found'}</p>
                    <button
                        onClick={() => navigate('/workouts')}
                        className="text-teal-600 hover:text-teal-700"
                    >
                        ← Back to Workouts
                    </button>
                </div>
            </div>
        );
    }

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
                    <button
                        onClick={() => navigate('/workouts')}
                        className="text-gray-600 hover:text-teal-600 transition"
                    >
                        ← Back to Workouts
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-teal-100">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">{workout.title}</h2>
                            <p className="text-gray-600">{formatDate(workout.date)}</p>
                        </div>
                        {workout.duration && (
                            <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-lg font-semibold">
                                {workout.duration} min
                            </span>
                        )}
                    </div>

                    {/* Notes */}
                    {workout.notes && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Notes:</h3>
                            <p className="text-gray-700 italic">"{workout.notes}"</p>
                        </div>
                    )}

                    {/* Exercises */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Exercises ({workout.exercises?.length || 0})
                        </h3>

                        {workout.exercises && workout.exercises.length > 0 ? (
                            <div className="space-y-4">
                                {workout.exercises.map((exercise, index) => (
                                    <div key={exercise.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="text-lg font-semibold text-gray-800">
                                                {index + 1}. {exercise.name}
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                                            {exercise.sets && (
                                                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                                                    <p className="text-xs text-gray-600 mb-1">Sets</p>
                                                    <p className="text-lg font-bold text-teal-600">{exercise.sets}</p>
                                                </div>
                                            )}
                                            {exercise.reps && (
                                                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                                                    <p className="text-xs text-gray-600 mb-1">Reps</p>
                                                    <p className="text-lg font-bold text-teal-600">{exercise.reps}</p>
                                                </div>
                                            )}
                                            {exercise.weight && (
                                                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                                                    <p className="text-xs text-gray-600 mb-1">Weight</p>
                                                    <p className="text-lg font-bold text-teal-600">{exercise.weight} kg</p>
                                                </div>
                                            )}
                                            {exercise.duration && (
                                                <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                                                    <p className="text-xs text-gray-600 mb-1">Duration</p>
                                                    <p className="text-lg font-bold text-teal-600">{Math.floor(exercise.duration / 60)} min</p>
                                                </div>
                                            )}
                                        </div>

                                        {exercise.notes && (
                                            <p className="text-sm text-gray-600 mt-3 italic">Note: {exercise.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No exercises recorded</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => navigate('/workouts')}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                            Back to List
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                        >
                            Delete Workout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkoutDetails;