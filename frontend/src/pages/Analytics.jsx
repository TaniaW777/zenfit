import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workoutsAPI, nutritionAPI, goalsAPI } from '../services/api';
import {
    LineChart, Line, BarChart, Bar, _PieChart, _Pie, _Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function Analytics() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('7'); // days
    const [insights, setInsights] = useState([]);
    const [_goals, setGoals] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [workoutsData, mealsData, goalsData, insightsData] = await Promise.all([
                    workoutsAPI.getAll(),
                    nutritionAPI.getAll(),
                    goalsAPI.get(),
                    goalsAPI.getInsights()
                ]);
                setWorkouts(workoutsData.workouts);
                setMeals(mealsData.meals);
                setGoals(goalsData.goal);
                setInsights(insightsData.insights || []);
            } catch (_err) {
                console.error('Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [timeRange]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Process workout data for charts
    const getWorkoutVolumeData = () => {
        const days = parseInt(timeRange);
        const today = new Date();
        const dateMap = new Map();

        // Initialize dates
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dateMap.set(dateStr, { date: dateStr, workouts: 0, duration: 0 });
        }

        // Fill with actual data
        workouts.forEach(workout => {
            const dateStr = new Date(workout.date).toISOString().split('T')[0];
            if (dateMap.has(dateStr)) {
                const data = dateMap.get(dateStr);
                data.workouts += 1;
                data.duration += workout.duration || 0;
            }
        });

        return Array.from(dateMap.values()).map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            workouts: item.workouts,
            duration: item.duration
        }));
    };

    // Process nutrition data for charts
    const getNutritionData = () => {
        const days = parseInt(timeRange);
        const today = new Date();
        const dateMap = new Map();

        // Initialize dates
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dateMap.set(dateStr, { date: dateStr, calories: 0, protein: 0, carbs: 0, fats: 0 });
        }

        // Fill with actual data
        meals.forEach(meal => {
            const dateStr = new Date(meal.date).toISOString().split('T')[0];
            if (dateMap.has(dateStr)) {
                const data = dateMap.get(dateStr);
                data.calories += meal.totals?.calories || 0;
                data.protein += meal.totals?.protein || 0;
                data.carbs += meal.totals?.carbs || 0;
                data.fats += meal.totals?.fats || 0;
            }
        });

        return Array.from(dateMap.values()).map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            calories: Math.round(item.calories),
            protein: Math.round(item.protein),
            carbs: Math.round(item.carbs),
            fats: Math.round(item.fats)
        }));
    };

    // Calculate stats
    const getStats = () => {
        const totalWorkouts = workouts.length;
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

        const totalCalories = meals.reduce((sum, m) => sum + (m.totals?.calories || 0), 0);
        const avgCalories = meals.length > 0 ? Math.round(totalCalories / meals.length) : 0;

        return {
            totalWorkouts,
            totalDuration,
            avgDuration,
            totalMeals: meals.length,
            totalCalories: Math.round(totalCalories),
            avgCalories
        };
    };

    const stats = getStats();
    const workoutVolumeData = getWorkoutVolumeData();
    const nutritionData = getNutritionData();

    const COLORS = {
        teal: '#14B8A6',
        blue: '#3B82F6',
        orange: '#F97316',
        yellow: '#EAB308',
        green: '#22C55E',
        indigo: '#6366F1'
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                    <p className="text-gray-600 mt-4">Loading analytics...</p>
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

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
                        <p className="text-gray-600 mt-1">Track your progress over time</p>
                    </div>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="14">Last 14 days</option>
                        <option value="30">Last 30 days</option>
                    </select>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-teal-100">
                        <p className="text-sm text-gray-600 mb-1">Total Workouts</p>
                        <p className="text-3xl font-bold text-teal-600">{stats.totalWorkouts}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
                        <p className="text-sm text-gray-600 mb-1">Avg Duration</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.avgDuration} min</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100">
                        <p className="text-sm text-gray-600 mb-1">Total Meals</p>
                        <p className="text-3xl font-bold text-orange-600">{stats.totalMeals}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">
                        <p className="text-sm text-gray-600 mb-1">Avg Calories</p>
                        <p className="text-3xl font-bold text-green-600">{stats.avgCalories}</p>
                    </div>
                </div>
                {/* Insights Section */}
                {insights.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Insights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {insights.map((insight, index) => (
                                <div
                                    key={index}
                                    className={`rounded-lg shadow-md p-4 border ${insight.type === 'success'
                                        ? 'bg-green-50 border-green-200'
                                        : insight.type === 'warning'
                                            ? 'bg-yellow-50 border-yellow-200'
                                            : 'bg-blue-50 border-blue-200'
                                        }`}
                                >
                                    <p className="text-gray-800 font-medium">{insight.message}</p>
                                    {insight.progress !== undefined && (
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${insight.type === 'success'
                                                        ? 'bg-green-600'
                                                        : insight.type === 'warning'
                                                            ? 'bg-yellow-600'
                                                            : 'bg-blue-600'
                                                        }`}
                                                    style={{ width: `${insight.progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{Math.round(insight.progress)}% complete</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Workout Volume */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-teal-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Workout Frequency</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={workoutVolumeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="workouts" fill={COLORS.teal} name="Workouts" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Workout Duration */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-blue-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Workout Duration (min)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={workoutVolumeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="duration" stroke={COLORS.blue} strokeWidth={2} name="Minutes" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Calories */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-orange-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Calories</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={nutritionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="calories" stroke={COLORS.orange} strokeWidth={2} name="Calories" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Macros */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Macronutrients Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={nutritionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="protein" stroke={COLORS.blue} strokeWidth={2} name="Protein (g)" />
                                <Line type="monotone" dataKey="carbs" stroke={COLORS.yellow} strokeWidth={2} name="Carbs (g)" />
                                <Line type="monotone" dataKey="fats" stroke={COLORS.green} strokeWidth={2} name="Fats (g)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;