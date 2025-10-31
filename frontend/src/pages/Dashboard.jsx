import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-indigo-50">
            <nav className="bg-white shadow-md border-b border-teal-100">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
                        Zenfit
                    </h1>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-sm sm:text-base text-gray-700">
                            Hello, {user?.first_name || 'User'}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border border-teal-100">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Dashboard</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">Welcome to your Zenfit workspace!</p>

                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-3 sm:p-4">
                        <h3 className="font-semibold text-teal-800 mb-2 text-sm sm:text-base">Account Information</h3>
                        <p className="text-sm sm:text-base text-gray-700"><strong>Email:</strong> {user?.email}</p>
                        <p className="text-sm sm:text-base text-gray-700"><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center border border-teal-100 hover:shadow-lg transition">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">💪</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Workouts</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-teal-600">0</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Coming soon!</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center border border-emerald-100 hover:shadow-lg transition">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">🥗</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Nutrition</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-emerald-600">0</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Coming soon!</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center border border-indigo-100 hover:shadow-lg transition sm:col-span-2 lg:col-span-1">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">📈</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Progress</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-indigo-600">0%</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Coming soon!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;