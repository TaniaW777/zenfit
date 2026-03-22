import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { goalsAPI } from '../services/api';

function Goals() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [_goals, setGoals] = useState(null);
  const [formData, setFormData] = useState({
    weekly_workouts_target: '',
    weekly_duration_target: '',
    daily_calories_target: '',
    daily_protein_target: '',
    daily_carbs_target: '',
    daily_fats_target: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await goalsAPI.get();
      if (data.goal) {
        setGoals(data.goal);
        setFormData({
          weekly_workouts_target: data.goal.weekly_workouts_target || '',
          weekly_duration_target: data.goal.weekly_duration_target || '',
          daily_calories_target: data.goal.daily_calories_target || '',
          daily_protein_target: data.goal.daily_protein_target || '',
          daily_carbs_target: data.goal.daily_carbs_target || '',
          daily_fats_target: data.goal.daily_fats_target || '',
        });
      }
    } catch (_err) {
      console.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const goalData = {
        weekly_workouts_target: formData.weekly_workouts_target ? parseInt(formData.weekly_workouts_target) : null,
        weekly_duration_target: formData.weekly_duration_target ? parseInt(formData.weekly_duration_target) : null,
        daily_calories_target: formData.daily_calories_target ? parseInt(formData.daily_calories_target) : null,
        daily_protein_target: formData.daily_protein_target ? parseFloat(formData.daily_protein_target) : null,
        daily_carbs_target: formData.daily_carbs_target ? parseFloat(formData.daily_carbs_target) : null,
        daily_fats_target: formData.daily_fats_target ? parseFloat(formData.daily_fats_target) : null,
      };

      await goalsAPI.createOrUpdate(goalData);
      setMessage('Goals saved successfully! 🎉');
      await fetchGoals();
    } catch (_err) {
      setMessage('Failed to save goals');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="text-gray-600 mt-4">Loading goals...</p>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Goals</h2>
          <p className="text-gray-600 mt-1">Set your fitness and nutrition targets</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fitness Goals */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-teal-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">💪</span>
              Fitness Goals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workouts per Week
                </label>
                <input
                  type="number"
                  name="weekly_workouts_target"
                  value={formData.weekly_workouts_target}
                  onChange={handleChange}
                  placeholder="e.g., 4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Minutes per Week
                </label>
                <input
                  type="number"
                  name="weekly_duration_target"
                  value={formData.weekly_duration_target}
                  onChange={handleChange}
                  placeholder="e.g., 180"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Nutrition Goals */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🥗</span>
              Nutrition Goals (Daily)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  name="daily_calories_target"
                  value={formData.daily_calories_target}
                  onChange={handleChange}
                  placeholder="e.g., 2000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="daily_protein_target"
                  value={formData.daily_protein_target}
                  onChange={handleChange}
                  placeholder="e.g., 150"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="daily_carbs_target"
                  value={formData.daily_carbs_target}
                  onChange={handleChange}
                  placeholder="e.g., 200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fats (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="daily_fats_target"
                  value={formData.daily_fats_target}
                  onChange={handleChange}
                  placeholder="e.g., 65"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:bg-teal-300"
            >
              {saving ? 'Saving...' : 'Save Goals'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Goals;