import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxy handles the rest
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log(`✅ JWT token attached to ${config.method?.toUpperCase()} ${config.url}`);
        } else {
            console.warn(`⚠️ No JWT token found for ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('🔴 Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log all API errors for debugging
        console.error('🔴 API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });

        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message;

            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    console.warn('⚠️ Unauthorized - clearing auth');
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    localStorage.removeItem('email');
                    localStorage.removeItem('name');

                    // Only redirect if not already on login/public page
                    if (!window.location.pathname.match(/^\/(login|register|$)/)) {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    // Forbidden - user doesn't have permission
                    console.error('⚠️ 403 Forbidden:', {
                        url: error.config?.url,
                        method: error.config?.method,
                        token: localStorage.getItem('token') ? 'Present' : 'Missing',
                        message: message
                    });

                    // Avoid infinite redirect loop
                    if (window.location.pathname !== '/unauthorized' && window.location.pathname !== '/login') {
                        console.warn('🔄 Redirecting to unauthorized page');
                        window.location.href = '/unauthorized';
                    }
                    break;

                case 404:
                    // Not found - resource doesn't exist
                    console.warn('⚠️ Resource not found:', message);
                    break;

                case 500:
                    // Server error - log but don't crash the app
                    console.error('❌ Server error:', message);
                    // Don't redirect, let the component handle it
                    break;

                default:
                    console.error('❌ HTTP error', status, ':', message);
            }
        } else if (error.request) {
            // Request was made but no response (network error, server down)
            console.error('❌ Network error - backend might be down');
        } else {
            // Something else happened
            console.error('❌ Unexpected error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
