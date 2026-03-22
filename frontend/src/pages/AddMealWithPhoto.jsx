import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nutritionAPI } from '../services/api';
import { 
  Camera, 
  Image as ImageIcon, 
  ArrowLeft, 
  Sparkles, 
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lightbulb,
  _Sunrise,
  _Sun,
  _Moon,
  _Apple
} from 'lucide-react';

export default function AddMealWithPhoto() {
  const navigate = useNavigate();
  
  // State
  const [mealType, setMealType] = useState('lunch');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Handle image selection (camera or file upload)
  const handleImageCapture = (event) => {
    const file = event.target.files[0];
    if (!file) {return;}

    setImageFile(file);
    setResults(null);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Analyze the food image with AI
  const analyzeFood = async () => {
    if (!imageFile) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await nutritionAPI.analyzeFood(formData);
      setResults(response);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.error || 'Failed to analyze image. Make sure Ollama is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Save the meal to database
  const saveMeal = async () => {
    if (!results || !results.foods || results.foods.length === 0) {
      setError('No food data to save');
      return;
    }

    try {
      const mealData = {
        meal_type: mealType,
        foods: results.foods.map(food => ({
          name: food.name,
          quantity: parseFloat(food.portion.match(/\d+(\.\d+)?/)?.[0] || 0),
          unit: food.portion.includes('g') ? 'g' : food.portion.includes('cup') ? 'cup' : 'serving',
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fats: food.fats
        }))
      };

      await nutritionAPI.create(mealData);
      navigate('/nutrition');
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save meal');
    }
  };

  // Reset and take new photo
  const retakePhoto = () => {
    setImageFile(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
  };

  // Calculate total calories from results
  const getTotalCalories = () => {
    if (!results || !results.foods) {return 0;}
    return results.foods.reduce((sum, food) => sum + (food.calories || 0), 0);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/nutrition')}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Nutrition
        </button>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Camera size={32} />
          Add Meal with Photo
        </h1>
        <p className="text-gray-600 mt-2">Take a photo and let AI identify the food!</p>
      </div>

      {/* Meal Type Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meal Type
        </label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      {/* Image Upload/Camera */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Food Photo
        </label>

        {!imagePreview ? (
          <div className="space-y-3">
            {/* Camera Button (Mobile) */}
            <label className="block">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="hidden"
              />
              <div className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 text-center font-medium flex items-center justify-center gap-2">
                <Camera size={20} />
                Take Photo
              </div>
            </label>

            {/* File Upload (Desktop) */}
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageCapture}
                className="hidden"
              />
              <div className="w-full px-6 py-4 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 text-center font-medium border-2 border-dashed border-gray-300 flex items-center justify-center gap-2">
                <ImageIcon size={20} />
                Choose from Gallery
              </div>
            </label>
          </div>
        ) : (
          <div>
            {/* Image Preview */}
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Food preview"
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Analyze Button */}
            {!results && (
              <button
                onClick={analyzeFood}
                disabled={analyzing}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing... (3-5 seconds)
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analyze Food
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Results */}
      {results && results.foods && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-600" />
            Recognized Foods
          </h2>

          {/* Food Items */}
          <div className="space-y-3 mb-4">
            {results.foods.map((food, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{food.name}</h3>
                    <p className="text-sm text-gray-600">Portion: {food.portion}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    food.confidence === 'high' ? 'bg-green-100 text-green-800' :
                    food.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {food.confidence} confidence
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Cal:</span>
                    <span className="ml-1 font-medium">{food.calories}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">P:</span>
                    <span className="ml-1 font-medium">{food.protein}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">C:</span>
                    <span className="ml-1 font-medium">{food.carbs}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">F:</span>
                    <span className="ml-1 font-medium">{food.fats}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Calories</p>
              <p className="text-3xl font-bold text-blue-600">{getTotalCalories()}</p>
            </div>
          </div>

          {/* AI Notes */}
          {results.notes && (
            <div className="text-sm text-gray-600 italic mb-4 flex items-start gap-2">
              <Lightbulb size={16} className="mt-0.5 flex-shrink-0" />
              {results.notes}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={retakePhoto}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium flex items-center justify-center gap-2"
            >
              <XCircle size={20} />
              Retake Photo
            </button>
            <button
              onClick={saveMeal}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Save Meal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}