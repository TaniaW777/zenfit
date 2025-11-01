import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutsAPI } from '../services/api';

function AddWorkout() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        notes: '',
        duration: '',
    });
    const [exercises, setExercises] = useState([
        { name: '', sets: '', reps: '', weight: '' }
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const addExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
    };

    const removeExercise = (index) => {
        if (exercises.length > 1) {
            setExercises(exercises.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const workoutData = {
                ...formData,
                duration: formData.duration ? parseInt(formData.duration) : null,
                exercises: exercises
                    .filter(ex => ex.name.trim())
                    .map(ex => ({
                        name: ex.name,
                        sets: ex.sets ? parseInt(ex.sets) : null,
                        reps: ex.reps ? parseInt(ex.reps) : null,
                        weight: ex.weight ? parseFloat(ex.weight) : null,
                    })),
            };

            await workoutsAPI.create(workoutData);
            navigate('/workouts');
        } catch (err) {
            setError(err.response?.data?.error || 'Error creating workout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50">
            <nav className="bg-white shadow-md border-b border-teal-100">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                        Zenfit
                    </h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-600 hover:text-teal-600 transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-teal-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Workout</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Workout Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Workout Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Upper Body Strength"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="45"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="How did you feel? Any observations?"
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Exercises */}
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Exercises</h3>
                                <button
                                    type="button"
                                    onClick={addExercise}
                                    className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-lg hover:bg-teal-200 transition"
                                >
                                    + Add Exercise
                                </button>
                            </div>

                            <div className="space-y-4">
                                {exercises.map((exercise, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-sm font-medium text-gray-600">Exercise {index + 1}</span>
                                            {exercises.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeExercise(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Exercise name *"
                                                value={exercise.name}
                                                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                                                required
                                            />
                                            <input
                                                type="number"
                                                placeholder="Sets"
                                                value={exercise.sets}
                                                onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Reps"
                                                value={exercise.reps}
                                                onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                                            />
                                            <input
                                                type="number"
                                                step="0.5"
                                                placeholder="Weight (kg)"
                                                value={exercise.weight}
                                                onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/workouts')}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-teal-300"
                            >
                                {loading ? 'Creating...' : 'Create Workout'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddWorkout;