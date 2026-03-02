import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box, CircularProgress, useTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // Custom Provider
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PublicLayout from './layout/PublicLayout';
import DashboardLayout from './layout/DashboardLayout';

// Lazy Load Pages for Performance
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Home = lazy(() => import('./pages/Home'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ErrorBoundary = lazy(() => import('./components/ErrorBoundary'));

const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const OrganizerApproval = lazy(() => import('./pages/admin/OrganizerApproval'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
const CategoryManagement = lazy(() => import('./pages/admin/CategoryManagement'));
const AdminRevenue = lazy(() => import('./pages/admin/AdminRevenue'));
const ScanEntry = lazy(() => import('./pages/admin/ScanEntry'));
const OrganizerDashboard = lazy(() => import('./pages/organizer/OrganizerDashboard'));
const CreateEvent = lazy(() => import('./pages/organizer/CreateEvent'));
const BrowseEvents = lazy(() => import('./pages/user/BrowseEvents'));
const EventDetails = lazy(() => import('./pages/user/EventDetails'));
const Bookings = lazy(() => import('./pages/user/Bookings'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const Profile = lazy(() => import('./pages/common/Profile'));
const AiAnalytics = lazy(() => import('./components/dashboard/AiAnalytics'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const AiChatAssistant = lazy(() => import('./components/AiChatAssistant'));
const NotificationsPage = lazy(() => import('./pages/common/NotificationsPage'));

// Error Pages
const AccessDenied = lazy(() => import('./pages/AccessDenied'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Organizer Pages
const OrganizerBookings = lazy(() => import('./pages/organizer/OrganizerBookings'));
const OrganizerRevenue = lazy(() => import('./pages/organizer/OrganizerRevenue'));
const OrganizerNotifications = lazy(() => import('./pages/organizer/OrganizerNotifications'));
const OrganizerSupport = lazy(() => import('./pages/organizer/OrganizerSupport'));
const OrganizerAnalytics = lazy(() => import('./components/dashboard/OrganizerAnalytics'));
const ApprovalPending = lazy(() => import('./pages/organizer/ApprovalPending'));
const OrganizerAttendance = lazy(() => import('./pages/organizer/OrganizerAttendance'));
const MyEvents = lazy(() => import('./pages/organizer/MyEvents'));

// AI Tool Pages
const EventDescription = lazy(() => import('./pages/organizer/ai/EventDescription'));
const PriceSuggestion = lazy(() => import('./pages/organizer/ai/PriceSuggestion'));
const MarketingCopy = lazy(() => import('./pages/organizer/ai/MarketingCopy'));

// Loading Fallback
const PageLoader = () => {
    return <PageLoaderContent />;
};

const PageLoaderContent = () => {
    const { palette } = useTheme(); // Import useTheme from @mui/material in the file header
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            bgcolor: palette.background.default
        }}>
            <CircularProgress color="primary" />
        </Box>
    );
}



function App() {
    return (
        <ThemeProvider>
            <CssBaseline enableColorScheme />
            <Router>
                <AuthProvider>
                    <NotificationProvider>
                        <WishlistProvider>
                            <Suspense fallback={<PageLoader />}>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={
                                        <PublicLayout>
                                            <Home />
                                        </PublicLayout>
                                    } />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />

                                    {/* Admin Routes */}
                                    <Route path="/admin/dashboard" element={
                                        <ErrorBoundary>
                                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                                <DashboardLayout role="ADMIN">
                                                    <AdminDashboard />
                                                </DashboardLayout>
                                            </ProtectedRoute>
                                        </ErrorBoundary>
                                    } />
                                    <Route path="/admin/organizers" element={
                                        <ErrorBoundary>
                                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                                <DashboardLayout role="ADMIN">
                                                    <OrganizerApproval />
                                                </DashboardLayout>
                                            </ProtectedRoute>
                                        </ErrorBoundary>
                                    } />
                                    <Route path="/admin/users" element={
                                        <ProtectedRoute allowedRoles={['ADMIN']}>
                                            <DashboardLayout role="ADMIN">
                                                <AdminUsers />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/admin/analytics" element={
                                        <ErrorBoundary>
                                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                                <DashboardLayout role="ADMIN">
                                                    <Analytics />
                                                </DashboardLayout>
                                            </ProtectedRoute>
                                        </ErrorBoundary>
                                    } />
                                    <Route path="/admin/events" element={
                                        <ProtectedRoute allowedRoles={['ADMIN']}>
                                            <DashboardLayout role="ADMIN">
                                                <AdminEvents />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/admin/categories" element={
                                        <ProtectedRoute allowedRoles={['ADMIN']}>
                                            <DashboardLayout role="ADMIN">
                                                <CategoryManagement />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/admin/profile" element={
                                        <ErrorBoundary>
                                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                                <DashboardLayout role="ADMIN">
                                                    <Profile />
                                                </DashboardLayout>
                                            </ProtectedRoute>
                                        </ErrorBoundary>
                                    } />
                                    <Route path="/admin/ai-analytics" element={
                                        <ProtectedRoute allowedRoles={['ADMIN']}>
                                            <DashboardLayout role="ADMIN">
                                                <AiAnalytics />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/admin/revenue" element={
                                        <ProtectedRoute allowedRoles={['ADMIN']}>
                                            <DashboardLayout role="ADMIN">
                                                <AdminRevenue />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/admin/scan-entry" element={
                                        <ProtectedRoute allowedRoles={['ADMIN']}>
                                            <DashboardLayout role="ADMIN">
                                                <ScanEntry />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } />

                                    {/* Common Authenticated Routes */}
                                    <Route path="/notifications" element={
                                        <ProtectedRoute>
                                            <DashboardLayout role="USER">
                                                <NotificationsPage />
                                            </DashboardLayout>
                                        </ProtectedRoute>
                                    } />

                                    {/* Organizer Routes */}
                                    <Route path="/organizer/*" element={
                                        <ErrorBoundary>
                                            <Routes>
                                                <Route path="dashboard" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <OrganizerDashboard />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="create-event" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <CreateEvent />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="events" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <MyEvents />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="bookings" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <OrganizerBookings />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="attendance" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <OrganizerAttendance />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="revenue" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <OrganizerRevenue />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="notifications" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <OrganizerNotifications />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="support" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <OrganizerSupport />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="analytics" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <OrganizerAnalytics />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="pending" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <ApprovalPending />
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="profile" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <Profile />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="ai/description" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <EventDescription />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="ai/pricing" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <PriceSuggestion />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="ai/marketing" element={
                                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                                        <DashboardLayout role="ORGANIZER">
                                                            <MarketingCopy />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                            </Routes>
                                        </ErrorBoundary>
                                    } />
                                    {/* User Routes */}
                                    <Route path="/user/*" element={
                                        <ErrorBoundary>
                                            <Routes>
                                                <Route path="dashboard" element={
                                                    <ProtectedRoute allowedRoles={['USER']}>
                                                        <DashboardLayout role="USER">
                                                            <UserDashboard />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="browse" element={
                                                    <ProtectedRoute allowedRoles={['USER']}>
                                                        <DashboardLayout role="USER">
                                                            <BrowseEvents />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="events" element={
                                                    <ProtectedRoute allowedRoles={['USER']}>
                                                        <DashboardLayout role="USER">
                                                            <BrowseEvents />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="events/:id" element={
                                                    <ProtectedRoute allowedRoles={['USER']}>
                                                        <DashboardLayout role="USER">
                                                            <EventDetails />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="bookings" element={
                                                    <ProtectedRoute allowedRoles={['USER']}>
                                                        <DashboardLayout role="USER">
                                                            <Bookings />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="wishlist" element={
                                                    <ProtectedRoute allowedRoles={['USER']}>
                                                        <DashboardLayout role="USER">
                                                            <Wishlist />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                                <Route path="profile" element={
                                                    <ProtectedRoute allowedRoles={['USER']}>
                                                        <DashboardLayout role="USER">
                                                            <Profile />
                                                        </DashboardLayout>
                                                    </ProtectedRoute>
                                                } />
                                            </Routes>
                                        </ErrorBoundary>
                                    } />

                                    {/* Error Routes */}
                                    <Route path="/unauthorized" element={<Unauthorized />} />
                                    <Route path="/access-denied" element={<AccessDenied />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Suspense>
                        </WishlistProvider>
                    </NotificationProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
