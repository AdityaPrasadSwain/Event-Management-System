import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const getDashboardPath = () => {
        if (!user) return '/login';
        if (user.role === 'ADMIN') return '/admin/dashboard';
        if (user.role === 'ORGANIZER' || user.role === 'EVENT_ORGANIZER') return '/organizer/dashboard';
        return '/user/dashboard';
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Smart Event Management System
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="hover:text-blue-400 px-3 py-2 rounded-md font-medium">Home</Link>
                            <Link to="/events" className="hover:text-blue-400 px-3 py-2 rounded-md font-medium">Events</Link>

                            {user ? (
                                <>
                                    <Link to={getDashboardPath()} className="hover:text-blue-400 px-3 py-2 rounded-md font-medium">Dashboard</Link>
                                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="hover:text-blue-400 px-3 py-2 rounded-md font-medium">Login</Link>
                                    <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-b border-slate-800">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium">Home</Link>
                        <Link to="/events" className="block hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium">Events</Link>
                        {user ? (
                            <>
                                <Link to={getDashboardPath()} className="block hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
                                <button onClick={handleLogout} className="block w-full text-left bg-red-600 px-3 py-2 rounded-md text-base font-medium">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium">Login</Link>
                                <Link to="/register" className="block bg-blue-600 px-3 py-2 rounded-md text-base font-medium">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
