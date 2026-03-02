import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import CreateEvent from '../pages/organizer/CreateEvent';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../layout/Layout';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/events', element: <Events /> },
            { path: '/events/:id', element: <EventDetails /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            {
                path: '/dashboard',
                element: <ProtectedRoute><Dashboard /></ProtectedRoute>
            },
            {
                path: '/create-event',
                element: <ProtectedRoute roles={['ORGANIZER', 'ADMIN']}><CreateEvent /></ProtectedRoute>
            },
            {
                path: '/organizer/create-event',
                element: <ProtectedRoute roles={['ORGANIZER', 'ADMIN']}><CreateEvent /></ProtectedRoute>
            }
        ]
    }
]);
