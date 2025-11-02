import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { nutritionAPI } from '../services/api';

function MealsList() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [meals, setMeals] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [mealsData, summaryData] = await Promise.all([
                nutritionAPI.getAll(selectedDate),
                nutritionAPI.getDailySummary(selectedDate)
            ]);
            setMeals(mealsData.meals);
            setSummary(summaryData.summary);
        } catch (err) {
            setError('Failed to load meals');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this meal?')) {
            try {
                await nutritionAPI.delete(id);
                setMeals(meals.filter(m => m.id !== id));
                // Refresh summary
                const summaryData = await nutritionAPI.getDailySummary(selectedDate);
                setSummary(summaryData.summary);
            } catch (err) {
                alert('Failed to delete meal');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
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

    const formatMealType = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
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
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">My Nutrition</h2>
                        <p className="text-gray-600 mt-1">Track your daily intake</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                            onClick={() => navigate('/nutrition/add')}
                            className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition shadow-md whitespace-nowrap"
                        >
                            + Add Meal
                        </button>
                    </div>
                </div>

                {/* Daily Summary */}
                {summary && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-teal-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Daily Summary</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg text-center border border-orange-200">
                                <p className="text-sm text-gray-600 mb-1">Calories</p>
                                <p className="text-2xl font-bold text-orange-600">{summary.calories}</p>
                                <p className="text-xs text-gray-500">kcal</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center border border-blue-200">
                                <p className="text-sm text-gray-600 mb-1">Protein</p>
                                <p className="text-2xl font-bold text-blue-600">{summary.protein}</p>
                                <p className="text-xs text-gray-500">g</p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center border border-yellow-200">
                                <p className="text-sm text-gray-600 mb-1">Carbs</p>
                                <p className="text-2xl font-bold text-yellow-600">{summary.carbs}</p>
                                <p className="text-xs text-gray-500">g</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center border border-green-200">
                                <p className="text-sm text-gray-600 mb-1">Fats</p>
                                <p className="text-2xl font-bold text-green-600">{summary.fats}</p>
                                <p className="text-xs text-gray-500">g</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Meals List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                        <p className="text-gray-600 mt-4">Loading meals...</p>
                    </div>
                ) : meals.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center border border-teal-100">
                        <span className="text-6xl mb-4 block">🍽️</span>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No meals yet</h3>
                        <p className="text-gray-600 mb-6">Start tracking your nutrition today!</p>
                        <button
                            onClick={() => navigate('/nutrition/add')}
                            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
                        >
                            Add Your First Meal
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {meals.map((meal) => (
                            <div
                                key={meal.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-teal-100 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{getMealIcon(meal.meal_type)}</span>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{formatMealType(meal.meal_type)}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(meal.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-orange-600">{meal.totals.calories}</p>
                                            <p className="text-xs text-gray-500">kcal</p>
                                        </div>
                                    </div>

                                    {meal.foods && meal.foods.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                                {meal.foods.length} item{meal.foods.length > 1 ? 's' : ''}:
                                            </p>
                                            <div className="space-y-1">
                                                {meal.foods.slice(0, 3).map((food, idx) => (
                                                    <p key={idx} className="text-sm text-gray-600">
                                                        • {food.name} ({food.quantity} {food.unit})
                                                    </p>
                                                ))}
                                                {meal.foods.length > 3 && (
                                                    <p className="text-sm text-gray-500 italic">
                                                        +{meal.foods.length - 3} more...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                                        <div>
                                            <p className="text-gray-600">Protein</p>
                                            <p className="font-bold text-blue-600">{meal.totals.protein}g</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Carbs</p>
                                            <p className="font-bold text-yellow-600">{meal.totals.carbs}g</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Fats</p>
                                            <p className="font-bold text-green-600">{meal.totals.fats}g</p>
                                        </div>
                                    </div>

                                    {meal.notes && (
                                        <p className="text-sm text-gray-600 mb-4 italic line-clamp-2">
                                            "{meal.notes}"
                                        </p>
                                    )}

                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => navigate(`/nutrition/${meal.id}`)}
                                            className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition text-sm font-semibold"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleDelete(meal.id)}
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

export default MealsList;