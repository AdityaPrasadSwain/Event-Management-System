import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import { Calendar, MapPin, User, Ticket as TicketIcon } from 'lucide-react';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, ticketRes] = await Promise.all([
                    api.get(`/events/${id}`),
                    api.get(`/bookings/event/${id}/tickets`)
                ]);
                setEvent(eventRes.data);
                setTickets(ticketRes.data);
            } catch (error) {
                console.error("Error fetching event details", error);
                Swal.fire('Error', 'Failed to load event details', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBook = async (ticket) => {
        if (!user) {
            Swal.fire({
                title: 'Login Required',
                text: 'You need to login to book tickets',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Login',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        try {
            // Simple prompt for seat count for now
            const { value: seatCount } = await Swal.fire({
                title: 'Select Seats',
                input: 'number',
                inputLabel: 'How many seats?',
                inputValue: 1,
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value || value < 1) {
                        return 'You need to select at least 1 seat!'
                    }
                    if (value > 10) { // Limit for safety
                        return 'Max 10 seats per booking'
                    }
                }
            });

            if (seatCount) {
                const result = await Swal.fire({
                    title: 'Confirm Booking',
                    text: `Book ${seatCount} seat(s) for ${ticket.type} event? Total: $${ticket.price * seatCount}`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, book it!'
                });

                if (result.isConfirmed) {
                    const bookingRequest = {
                        eventId: id,
                        seatCount: parseInt(seatCount)
                    };

                    const response = await api.post('/bookings/create', bookingRequest);

                    Swal.fire(
                        'Booking Requested!',
                        `Status: ${response.data.bookingStatus}. Ticket #: ${response.data.ticketNumber}`,
                        'success'
                    );

                    // Refresh ticket/event availability
                    // Re-fetching event metadata
                    const [eventRes, ticketRes] = await Promise.all([
                        api.get(`/events/${id}`),
                        api.get(`/bookings/event/${id}/tickets`)
                    ]);
                    setEvent(eventRes.data);
                    setTickets(ticketRes.data);
                }
            }
        } catch (error) {
            Swal.fire('Booking Failed', error.response?.data?.message || 'Error occurred', 'error');
        }
    };

    if (loading) return <div className="text-white text-center py-20">Loading...</div>;
    if (!event) return <div className="text-white text-center py-20">Event not found</div>;

    return (
        <div className="bg-slate-900 min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                <div className="relative h-64 md:h-96">
                    <img
                        src={event.bannerUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900 to-transparent h-32"></div>
                    <div className="absolute bottom-6 left-6 md:left-12">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2 inline-block">
                            {event.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white shadow-sm">{event.title}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-12">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">About Event</h2>
                            <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">{event.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-700/50 p-4 rounded-lg flex items-center">
                                <Calendar className="text-blue-500 mr-4" size={24} />
                                <div>
                                    <p className="text-gray-400 text-sm">Start Date</p>
                                    <p className="text-white font-semibold">{new Date(event.startDate).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="bg-slate-700/50 p-4 rounded-lg flex items-center">
                                <Calendar className="text-blue-500 mr-4" size={24} />
                                <div>
                                    <p className="text-gray-400 text-sm">End Date</p>
                                    <p className="text-white font-semibold">{new Date(event.endDate).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="bg-slate-700/50 p-4 rounded-lg flex items-center col-span-1 sm:col-span-2">
                                <MapPin className="text-blue-500 mr-4" size={24} />
                                <div>
                                    <p className="text-gray-400 text-sm">Location</p>
                                    <p className="text-white font-semibold">{event.location}</p>
                                </div>
                            </div>
                            <div className="bg-slate-700/50 p-4 rounded-lg flex items-center col-span-1 sm:col-span-2">
                                <User className="text-blue-500 mr-4" size={24} />
                                <div>
                                    <p className="text-gray-400 text-sm">Organizer</p>
                                    <p className="text-white font-semibold">{event.organizerName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-700 h-fit">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <TicketIcon className="mr-2" /> Tickets
                        </h3>
                        <div className="space-y-4">
                            {tickets.length > 0 ? (
                                tickets.map(ticket => (
                                    <div key={ticket.id} className="bg-slate-800 p-4 rounded-lg border border-slate-600 hover:border-blue-500 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-white text-lg">{ticket.type}</span>
                                            <span className="text-green-400 font-bold text-xl">${ticket.price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-400 mb-4">
                                            <span>Available: {ticket.availableSeats}</span>
                                            <span>Total: {ticket.totalSeats}</span>
                                        </div>
                                        <button
                                            onClick={() => handleBook(ticket)}
                                            disabled={ticket.availableSeats === 0}
                                            className={`w-full py-2 rounded font-bold transition-all ${ticket.availableSeats === 0
                                                ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            {ticket.availableSeats === 0 ? 'Sold Out' : 'Book Ticket'}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center">No tickets available yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
