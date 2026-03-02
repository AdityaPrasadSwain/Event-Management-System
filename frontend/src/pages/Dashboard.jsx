import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Plus, Ticket, Calendar, TrendingUp } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0, totalBookings: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    // Determine Role
    const isOrganizer = user?.roles.includes('ROLE_ORGANIZER') || user?.roles.includes('ROLE_ADMIN');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isOrganizer) {
                    const eventsRes = await api.get('/organizer/events');
                    setMyEvents(eventsRes.data);
                    // Calculate simple stats
                    const totalEv = eventsRes.data.length;
                    // For real stats, we'd need more endpoints, but let's mock/derive
                    // This is a simplified view
                    setStats({
                        totalEvents: totalEv,
                        totalBookings: 0, // Need endpoint for organizer bookings
                        revenue: 0
                    });
                }

                const bookingsRes = await api.get('/bookings/my-bookings');
                setBookings(bookingsRes.data);
            } catch (error) {
                console.error("Fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isOrganizer]);

    if (loading) return <div className="text-white text-center py-20">Loading Dashboard...</div>;

    return (
        <div className="bg-slate-900 min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        {isOrganizer ? 'Organizer Dashboard' : 'My Dashboard'}
                    </h1>
                    {isOrganizer && (
                        <Link to="/create-event" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center font-semibold">
                            <Plus className="mr-2" size={20} /> Create Event
                        </Link>
                    )}
                </div>

                {/* Stats Section (Organizer Only) */}
                {isOrganizer && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-400">Total Events</h3>
                                <Calendar className="text-blue-500" />
                            </div>
                            <p className="text-3xl font-bold text-white">{myEvents.length}</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-400">Total Revenue</h3>
                                <TrendingUp className="text-green-500" />
                            </div>
                            <p className="text-3xl font-bold text-white">$0.00 (Mocked)</p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-400">Tickets Sold</h3>
                                <Ticket className="text-purple-500" />
                            </div>
                            <p className="text-3xl font-bold text-white">0 (Mocked)</p>
                        </div>
                    </div>
                )}

                {/* Bookings Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6">My Bookings</h2>
                        {bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.map(booking => (
                                    <div key={booking.id} className="bg-slate-700/50 p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-white">{booking.eventTitle}</h4>
                                            <p className="text-sm text-gray-400">Booking ID: {booking.bookingId}</p>
                                            <p className="text-xs text-blue-400">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${booking.checkedIn ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}`}>
                                                {booking.checkedIn ? 'Checked In' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No bookings found.</p>
                        )}
                    </div>

                    {/* Charts or Organizer Events List */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        {isOrganizer ? (
                            <>
                                <h2 className="text-xl font-bold text-white mb-6">My Events</h2>
                                {myEvents.length > 0 ? (
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                        {myEvents.map(ev => (
                                            <div key={ev.id} className="flex justify-between items-center bg-slate-700/30 p-3 rounded">
                                                <div>
                                                    <p className="text-white font-medium">{ev.title}</p>
                                                    <p className="text-xs text-gray-400">{new Date(ev.startDate).toLocaleDateString()}</p>
                                                </div>
                                                <Link to={`/events/${ev.id}`} className="text-blue-400 hover:text-blue-300 text-sm">View</Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No events created yet.</p>
                                )}
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <p>Charts will appear here for organizers.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
