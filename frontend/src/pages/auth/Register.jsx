import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, UserPlus, Users, Briefcase, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER',
        mobile: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire('Error', 'Passwords do not match', 'error');
            return;
        }

        setIsLoading(true);

        setIsLoading(true);

        // Prepare JSON payload
        const requestBody = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.role,
            organizationName: formData.organizationName,
            contactNumber: formData.contactNumber
        };

        // NOTE: Profile image upload is removed from initial registration
        // to comply with JSON-only requirement. User can upload later.

        try {
            // Pass FormData to register
            await register(requestBody);

            Swal.fire({
                title: 'Registration Successful!',
                text: 'Please login to continue.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Registration Failed',
                text: err.response?.data?.message || 'Something went wrong. Please try again.',
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 relative overflow-hidden py-10">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl p-4 relative z-10"
            >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30"
                        >
                            <UserPlus className="text-white w-8 h-8" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400 text-sm">Join us to discover and manage amazing events</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRoleSelect('USER')}
                                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center transition-all ${formData.role === 'USER' ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                            >
                                <Users size={32} className={`mb-2 ${formData.role === 'USER' ? 'text-blue-400' : 'text-gray-400'}`} />
                                <span className={`font-semibold ${formData.role === 'USER' ? 'text-white' : 'text-gray-400'}`}>Attendee</span>
                                <span className="text-xs text-gray-500 mt-1 text-center">Join & Book Events</span>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRoleSelect('ORGANIZER')}
                                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center transition-all ${formData.role === 'ORGANIZER' ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                            >
                                <Briefcase size={32} className={`mb-2 ${formData.role === 'ORGANIZER' ? 'text-purple-400' : 'text-gray-400'}`} />
                                <span className={`font-semibold ${formData.role === 'ORGANIZER' ? 'text-white' : 'text-gray-400'}`}>Organizer</span>
                                <span className="text-xs text-gray-500 mt-1 text-center">Create & Manage Events</span>
                            </motion.div>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            <motion.div variants={itemVariants} className="space-y-1">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder-gray-500"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-1">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder-gray-500"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {formData.role === 'ORGANIZER' && (
                                <>
                                    <motion.div variants={itemVariants} className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Organization Name</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                name="organizationName"
                                                value={formData.organizationName || ''}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900/50 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none placeholder-gray-500"
                                                placeholder="Event Masters Inc."
                                                required
                                            />
                                        </div>
                                    </motion.div>

                                    <motion.div variants={itemVariants} className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Contact Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-3 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                name="contactNumber"
                                                value={formData.contactNumber || ''}
                                                onChange={handleChange}
                                                className="w-full bg-slate-900/50 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none placeholder-gray-500"
                                                placeholder="+1 234 567 890"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                </>
                            )}


                            <motion.div variants={itemVariants} className="space-y-1">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 text-white pl-10 pr-12 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder-gray-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-1">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <CheckCircle className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900/50 text-white pl-10 pr-12 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none placeholder-gray-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Profile Image Upload */}
                        <motion.div variants={itemVariants} className="space-y-1">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">Profile Image</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    type="file"
                                    name="profileImage"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
                                    className="w-full bg-slate-900/50 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Creating Account...' : 'Get Started'}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
