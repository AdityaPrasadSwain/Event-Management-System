import { Link } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import api from '../services/api';
import { Calendar, MapPin } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const HeroScene = lazy(() => import('../components/three/HeroScene'));

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                // Filter mainly upcoming events or just take first 5
                setEvents(response.data.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="bg-slate-900 min-h-screen">
            <Suspense fallback={<div className="w-full h-[500px] md:h-[600px] bg-slate-900 animate-pulse" />}>
                <HeroScene />
            </Suspense>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4">
                    Featured Events
                </h2>

                {loading ? (
                    <div className="text-center text-white">Loading...</div>
                ) : (
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="pb-12"
                    >
                        {events.map((event) => (
                            <SwiperSlide key={event.id}>
                                <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-700 h-full flex flex-col">
                                    <div className="h-48 bg-slate-700 overflow-hidden">
                                        <img
                                            src={event.bannerUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                                            alt={event.title}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full uppercase font-semibold">
                                                {event.category || 'Event'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{event.title}</h3>
                                        <div className="flex items-center text-gray-400 text-sm mb-2">
                                            <Calendar size={16} className="mr-2" />
                                            <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-gray-400 text-sm mb-4">
                                            <MapPin size={16} className="mr-2" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        <Link
                                            to={`/events/${event.id}`}
                                            className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 rounded transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default Home;
