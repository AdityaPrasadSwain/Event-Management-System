import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { Calendar, MapPin, DollarSign, Image as ImageIcon, AlignLeft, Clock, Users, X, Check, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import ImageUpload from '../../components/common/ImageUpload';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const [isLoading, setIsLoading] = useState(false);
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        pricePerPerson: '',
        capacity: '',
        categoryId: '',
        minimumAdvancePercent: '',
        bannerUrl: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        if (user && user.role === 'ORGANIZER' && user.organizerStatus !== 'APPROVED') {
            Swal.fire({
                icon: 'warning',
                title: 'Account Under Review',
                text: 'Your organizer account is still pending approval. You cannot create events yet.',
                confirmButtonText: 'Go to Dashboard',
                allowOutsideClick: false
            }).then(() => {
                navigate('/organizer/dashboard');
            });
        }
    }, [user, navigate]);

    const categories = [
        { id: 1, name: 'Music' },
        { id: 2, name: 'Technology' },
        { id: 3, name: 'Business' },
        { id: 4, name: 'Sports' },
        { id: 5, name: 'Art' },
        { id: 6, name: 'Education' }
    ];

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user && user.role === 'ORGANIZER' && user.organizerStatus !== 'APPROVED') {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: 'Your account is not approved yet.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                ...eventData,
                categoryId: parseInt(eventData.categoryId, 10),
                pricePerPerson: parseFloat(eventData.pricePerPerson),
                capacity: parseInt(eventData.capacity, 10),
                minimumAdvancePercent: eventData.minimumAdvancePercent ? parseFloat(eventData.minimumAdvancePercent) : 100.0
            };
            const response = await api.post('/events', payload);
            const newEvent = response.data;

            // Upload images if any
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                selectedFiles.forEach(file => {
                    formData.append('files', file);
                });
                await api.post(`/organizer/events/${newEvent.id}/images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'Event Created!',
                text: 'Your event has been successfully published.',
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#fff' : '#1e293b',
                confirmButtonColor: '#3b82f6'
            });
            navigate('/organizer/dashboard');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to create event. Please try again.',
                background: isDark ? '#1e293b' : '#fff',
                color: isDark ? '#fff' : '#1e293b'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formSection = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    if (!user) return null; // Or generic loading

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'} p-8 relative overflow-hidden transition-colors duration-300`}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-0 w-full h-full ${isDark ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_50%)]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.05),transparent_50%)]'}`}></div>
                <div className={`absolute top-[-10%] right-[-10%] w-96 h-96 ${isDark ? 'bg-purple-600/20' : 'bg-purple-400/10'} rounded-full mix-blend-multiply filter blur-[128px] animate-blob`}></div>
                <div className={`absolute bottom-[-10%] left-[-10%] w-96 h-96 ${isDark ? 'bg-blue-600/20' : 'bg-blue-400/10'} rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000`}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto relative z-10"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Create New Event</h1>
                        <p className={isDark ? 'text-gray-400' : 'text-slate-600'}>Fill in the details to publish your event</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/organizer/dashboard')}
                        className={`p-2 ${isDark ? 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white' : 'bg-white text-slate-500 hover:bg-gray-100 hover:text-slate-700'} rounded-full shadow-sm transition-colors`}
                    >
                        <X size={24} />
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div
                                variants={formSection}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.1 }}
                                className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm'} backdrop-blur-xl border rounded-2xl p-6 shadow-xl`}
                            >
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4 flex items-center`}>
                                    <AlignLeft className="text-blue-400 mr-2" size={20} />
                                    Event Details
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>Event Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={eventData.title}
                                            onChange={handleChange}
                                            className={`w-full ${isDark ? 'bg-slate-900/50 text-white border-slate-600 focus:border-blue-500' : 'bg-gray-50 text-slate-900 border-gray-200 focus:border-blue-400 focus:bg-white'} px-4 py-3 rounded-xl border focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-500`}
                                            placeholder="e.g., Tech Conference 2024"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>Description</label>
                                        <textarea
                                            name="description"
                                            value={eventData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            className={`w-full ${isDark ? 'bg-slate-900/50 text-white border-slate-600 focus:border-blue-500' : 'bg-gray-50 text-slate-900 border-gray-200 focus:border-blue-400 focus:bg-white'} px-4 py-3 rounded-xl border focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-gray-500 resize-none`}
                                            placeholder="Tell people what your event is about..."
                                            required
                                        ></textarea>
                                    </div>

                                    <ImageUpload
                                        title="Event Sample Photos"
                                        multiple
                                        onUpload={(files) => setSelectedFiles(files)}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                variants={formSection}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.2 }}
                                className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm'} backdrop-blur-xl border rounded-2xl p-6 shadow-xl`}
                            >
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4 flex items-center`}>
                                    <Clock className="text-purple-400 mr-2" size={20} />
                                    Date & Time
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>Start Date & Time</label>
                                        <div className="relative">
                                            <Calendar className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} size={18} />
                                            <input
                                                type="datetime-local"
                                                name="startDateTime"
                                                value={eventData.startDateTime}
                                                onChange={handleChange}
                                                className={`w-full ${isDark ? 'bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 [color-scheme:dark]' : 'bg-gray-50 text-slate-900 border-gray-200 focus:border-blue-400 focus:bg-white [color-scheme:light]'} pl-10 pr-4 py-3 rounded-xl border outline-none transition-all`}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>End Date & Time</label>
                                        <div className="relative">
                                            <Calendar className={`absolute left-3 top-3 ${isDark ? 'text-gray-400' : 'text-slate-400'}`} size={18} />
                                            <input
                                                type="datetime-local"
                                                name="endDateTime"
                                                value={eventData.endDateTime}
                                                onChange={handleChange}
                                                className={`w-full ${isDark ? 'bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 [color-scheme:dark]' : 'bg-gray-50 text-slate-900 border-gray-200 focus:border-blue-400 focus:bg-white [color-scheme:light]'} pl-10 pr-4 py-3 rounded-xl border outline-none transition-all`}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Logistics */}
                        <div className="space-y-6">
                            <motion.div
                                variants={formSection}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.3 }}
                                className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm'} backdrop-blur-xl border rounded-2xl p-6 shadow-xl`}
                            >
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4 flex items-center`}>
                                    <MapPin className="text-green-400 mr-2" size={20} />
                                    Location
                                </h3>
                                <div className="space-y-1">
                                    <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>Venue</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={eventData.location}
                                        onChange={handleChange}
                                        className={`w-full ${isDark ? 'bg-slate-900/50 text-white border-slate-600 focus:border-blue-500' : 'bg-gray-50 text-slate-900 border-gray-200 focus:border-blue-400 focus:bg-white'} px-4 py-3 rounded-xl border outline-none transition-all`}
                                        placeholder="City, Hall, or Online Link"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                variants={formSection}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: 0.4 }}
                                className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm'} backdrop-blur-xl border rounded-2xl p-6 shadow-xl`}
                            >
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-4 flex items-center`}>
                                    <DollarSign className="text-yellow-400 mr-2" size={20} />
                                    Ticketing
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>Price ($)</label>
                                            <input
                                                type="number"
                                                name="pricePerPerson"
                                                value={eventData.pricePerPerson}
                                                onChange={handleChange}
                                                className={`w-full ${isDark ? 'bg-slate-900/50 text-white border-slate-600 focus:border-blue-500' : 'bg-gray-50 text-slate-900 border-gray-200 focus:border-blue-400 focus:bg-white'} px-4 py-3 rounded-xl border outline-none transition-all`}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>Capacity</label>
                                            <input
                                                type="number"
                                                name="capacity"
                                                value={eventData.capacity}
                                                onChange={handleChange}
                                                className={`w-full ${isDark ? 'bg-slate-900/50 text-white border-slate-600 focus:border-blue-500' : 'bg-gray-50 text-slate-900 border-gray-200 focus:border-blue-400 focus:bg-white'} px-4 py-3 rounded-xl border outline-none transition-all`}
                                                placeholder="100"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>Min. Payment % (Optional)</label>
                                    <input
                                        type="number"
                                        name="minimumAdvancePercent"
                                        value={eventData.minimumAdvancePercent || ''}
                                        onChange={handleChange}
                                        className={`w-full ${isDark ? 'bg-slate-900/50 text-white border-slate-600 focus:border-blue-500' : 'bg-gray-50 text-slate-900 border-gray-200 focus:border-blue-400 focus:bg-white'} px-4 py-3 rounded-xl border outline-none transition-all`}
                                        placeholder="100"
                                        min="0"
                                        max="100"
                                    />
                                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Minimum percentage users must pay to book.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-slate-500'} uppercase tracking-wider`}>Category</label>
                                    <select
                                        name="categoryId"
                                        value={eventData.categoryId}
                                        onChange={handleChange}
                                        className={`w-full ${isDark ? 'bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 appearance-none' : 'bg-gray-50 text-slate-900 border-gray-200 focus:border-blue-400 focus:bg-white appearance-none'} px-4 py-3 rounded-xl border outline-none transition-all`}
                                        required
                                    >
                                        <option value="" className={isDark ? 'bg-slate-900' : 'bg-white'}>Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id} className={isDark ? 'bg-slate-900' : 'bg-white'}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="mr-2"
                                    >
                                        ⚪
                                    </motion.div>
                                ) : (
                                    <>
                                        <Save className="mr-2" size={20} />
                                        Publish Event
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateEvent;
