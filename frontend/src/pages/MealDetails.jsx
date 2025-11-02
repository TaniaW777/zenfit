import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { nutritionAPI } from '../services/api';

function MealDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMeal();
    }, [id]);

    const fetchMeal = async () => {
        try {
            setLoading(true);
            const data = await nutritionAPI.getOne(id);
            setMeal(data.meal);
        } catch (err) {
            setError('Failed to load meal');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
            try {
                await nutritionAPI.delete(id);
                navigate('/nutrition');
            } catch (err) {
                alert('Failed to delete meal');
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

    const formatMealType = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const getMealIcon = (type) => {
        const icons = {
            breakfast: '🍳',
            lunch: '🍽️',
            dinner: '🍲',
            snack: '🍎'
        };
        return icons[type] || '🍴';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="text-gray-600 mt-4">Loading meal...</p>
                </div>
            </div>
        );
    }

    if (error || !meal) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Meal not found'}</p>
                    <button
                        onClick={() => navigate('/nutrition')}
                        className="text-teal-600 hover:text-teal-700"
                    >
                        ← Back to Nutrition
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
                        onClick={() => navigate('/nutrition')}
                        className="text-gray-600 hover:text-teal-600 transition"
                    >
                        ← Back to Nutrition
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border border-teal-100">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                        <span className="text-5xl">{getMealIcon(meal.meal_type)}</span>
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-800 mb-1">{formatMealType(meal.meal_type)}</h2>
                            <p className="text-gray-600">{formatDate(meal.date)}</p>
                        </div>
                    </div>

                    {/* Totals Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center border border-orange-200">
                            <p className="text-sm text-gray-600 mb-1">Calories</p>
                            <p className="text-2xl font-bold text-orange-600">{meal.totals.calories}</p>
                            <p className="text-xs text-gray-500">kcal</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center border border-blue-200">
                            <p className="text-sm text-gray-600 mb-1">Protein</p>
                            <p className="text-2xl font-bold text-blue-600">{meal.totals.protein}</p>
                            <p className="text-xs text-gray-500">g</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center border border-yellow-200">
                            <p className="text-sm text-gray-600 mb-1">Carbs</p>
                            <p className="text-2xl font-bold text-yellow-600">{meal.totals.carbs}</p>
                            <p className="text-xs text-gray-500">g</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center border border-green-200">
                            <p className="text-sm text-gray-600 mb-1">Fats</p>
                            <p className="text-2xl font-bold text-green-600">{meal.totals.fats}</p>
                            <p className="text-xs text-gray-500">g</p>
                        </div>
                    </div>

                    {/* Notes */}
                    {meal.notes && (
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Notes:</h3>
                            <p className="text-gray-700 italic">"{meal.notes}"</p>
                        </div>
                    )}

                    {/* Foods */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Foods ({meal.foods?.length || 0})
                        </h3>

                        {meal.foods && meal.foods.length > 0 ? (
                            <div className="space-y-4">
                                {meal.foods.map((food, index) => (
                                    <div key={food.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">
                                                    {index + 1}. {food.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {food.quantity} {food.unit}
                                                </p>
                                            </div>
                                            {food.calories && (
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-orange-600">{food.calories}</p>
                                                    <p className="text-xs text-gray-500">kcal</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 text-center text-sm">
                                            {food.protein && (
                                                <div className="bg-white rounded p-2 border border-gray-200">
                                                    <p className="text-xs text-gray-600">Protein</p>
                                                    <p className="font-bold text-blue-600">{food.protein}g</p>
                                                </div>
                                            )}
                                            {food.carbs && (
                                                <div className="bg-white rounded p-2 border border-gray-200">
                                                    <p className="text-xs text-gray-600">Carbs</p>
                                                    <p className="font-bold text-yellow-600">{food.carbs}g</p>
                                                </div>
                                            )}
                                            {food.fats && (
                                                <div className="bg-white rounded p-2 border border-gray-200">
                                                    <p className="text-xs text-gray-600">Fats</p>
                                                    <p className="font-bold text-green-600">{food.fats}g</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No foods recorded</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => navigate('/nutrition')}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                        >
                            Back to List
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                        >
                            Delete Meal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MealDetails;