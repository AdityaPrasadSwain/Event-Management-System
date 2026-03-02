import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        category: 'Music',
        bannerUrl: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Format dates
            const payload = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString().slice(0, 19).replace('T', ' '),
                endDate: new Date(formData.endDate).toISOString().slice(0, 19).replace('T', ' ')
            };

            await api.post('/events', payload);
            Swal.fire('Success', 'Event created successfully!', 'success');
            navigate('/organizer/dashboard');
        } catch (error) {
            Swal.fire('Error', 'Failed to create event', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
                <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-700 pb-4">Create New Event</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Event Title</label>
                        <input type="text" name="title" required onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Description</label>
                        <textarea name="description" rows="4" onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Start Date & Time</label>
                            <input type="datetime-local" name="startDate" required onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">End Date & Time</label>
                            <input type="datetime-local" name="endDate" required onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-400 mb-2">Location</label>
                            <input type="text" name="location" required onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2">Category</label>
                            <select name="category" onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="Music">Music</option>
                                <option value="Technology">Technology</option>
                                <option value="Sports">Sports</option>
                                <option value="Workshop">Workshop</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2">Banner URL</label>
                        <input type="url" name="bannerUrl" placeholder="https://example.com/image.jpg" onChange={handleChange} className="w-full bg-slate-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all">
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
