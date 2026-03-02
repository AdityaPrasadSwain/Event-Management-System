import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data);
                setFilteredEvents(response.data);
            } catch (error) {
                console.error("Error fetching events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        let result = events;
        if (searchTerm) {
            result = result.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (categoryFilter) {
            result = result.filter(event => event.category === categoryFilter);
        }
        setFilteredEvents(result);
    }, [searchTerm, categoryFilter, events]);

    return (
        <div className="bg-slate-900 min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Browse Events</h1>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search events, locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full md:w-48 px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option value="Music">Music</option>
                        <option value="Technology">Technology</option>
                        <option value="Sports">Sports</option>
                        <option value="Workshop">Workshop</option>
                    </select>
                </div>

                {loading ? (
                    <div className="text-center text-white">Loading events...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map(event => (
                            <div key={event.id} className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:scale-[1.02] transition-transform duration-300">
                                <div className="h-48 bg-slate-700 relative">
                                    <img
                                        src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {event.status}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-blue-400 text-sm font-semibold uppercase">{event.category}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-2">{event.title}</h2>
                                    <div className="space-y-2 text-gray-400 text-sm mb-4">
                                        <div className="flex items-center">
                                            <Calendar size={16} className="mr-2 text-blue-500" />
                                            <span>{new Date(event.startDate).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin size={16} className="mr-2 text-blue-500" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 rounded transition-all"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {filteredEvents.length === 0 && (
                            <div className="col-span-full text-center text-gray-400 py-12">
                                No events found matching your criteria.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
