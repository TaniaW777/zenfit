import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nutritionAPI } from '../services/api';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

function AddMeal() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        meal_type: 'breakfast',
        notes: '',
    });
    const [foods, setFoods] = useState([
        { name: '', quantity: '', unit: 'g', calories: '', protein: '', carbs: '', fats: '' }
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFoodChange = (index, field, value) => {
        const newFoods = [...foods];
        newFoods[index][field] = value;
        setFoods(newFoods);
    };

    const addFood = () => {
        setFoods([...foods, { name: '', quantity: '', unit: 'g', calories: '', protein: '', carbs: '', fats: '' }]);
    };

    const removeFood = (index) => {
        if (foods.length > 1) {
            setFoods(foods.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const mealData = {
                ...formData,
                foods: foods
                    .filter(food => food.name.trim())
                    .map(food => ({
                        name: food.name,
                        quantity: food.quantity ? parseFloat(food.quantity) : null,
                        unit: food.unit,
                        calories: food.calories ? parseFloat(food.calories) : null,
                        protein: food.protein ? parseFloat(food.protein) : null,
                        carbs: food.carbs ? parseFloat(food.carbs) : null,
                        fats: food.fats ? parseFloat(food.fats) : null,
                    })),
            };

            await nutritionAPI.create(mealData);
            navigate('/nutrition');
        } catch (err) {
            setError(err.response?.data?.error || 'Error creating meal');
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Meal</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Meal Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meal Type *
                                </label>
                                <select
                                    name="meal_type"
                                    value={formData.meal_type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent capitalize"
                                    required
                                >
                                    {MEAL_TYPES.map(type => (
                                        <option key={type} value={type} className="capitalize">
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Any notes about this meal?"
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Foods */}
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Foods</h3>
                                <button
                                    type="button"
                                    onClick={addFood}
                                    className="text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-lg hover:bg-teal-200 transition"
                                >
                                    + Add Food
                                </button>
                            </div>

                            <div className="space-y-4">
                                {foods.map((food, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-sm font-medium text-gray-600">Food {index + 1}</span>
                                            {foods.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFood(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Food name *"
                                                value={food.name}
                                                onChange={(e) => handleFoodChange(index, 'name', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                                                required
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Quantity"
                                                    value={food.quantity}
                                                    onChange={(e) => handleFoodChange(index, 'quantity', e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                                                />
                                                <select
                                                    value={food.unit}
                                                    onChange={(e) => handleFoodChange(index, 'unit', e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                                                >
                                                    <option value="g">g</option>
                                                    <option value="ml">ml</option>
                                                    <option value="cup">cup</option>
                                                    <option value="piece">piece</option>
                                                    <option value="tbsp">tbsp</option>
                                                    <option value="tsp">tsp</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                                            <p className="text-xs font-semibold text-gray-600 mb-2">Nutritional Info</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Calories"
                                                    value={food.calories}
                                                    onChange={(e) => handleFoodChange(index, 'calories', e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Protein (g)"
                                                    value={food.protein}
                                                    onChange={(e) => handleFoodChange(index, 'protein', e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Carbs (g)"
                                                    value={food.carbs}
                                                    onChange={(e) => handleFoodChange(index, 'carbs', e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Fats (g)"
                                                    value={food.fats}
                                                    onChange={(e) => handleFoodChange(index, 'fats', e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/nutrition')}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-teal-300"
                            >
                                {loading ? 'Creating...' : 'Create Meal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddMeal;