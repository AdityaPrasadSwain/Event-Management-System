import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboardMinimal = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log('🔄 Fetching...');
            const response = await api.get('/admin/dashboard');
            console.log('✅ Data:', response.data);
            setStats(response.data);
        } catch (err) {
            console.error('❌ Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // FORCE WHITE BACKGROUND - IMPOSSIBLE TO BE BLACK
    const containerStyle = {
        backgroundColor: '#FFFFFF',
        color: '#000000',
        minHeight: '100vh',
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
    };

    const headerStyle = {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#1976d2'
    };

    const cardContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    };

    const cardStyle = {
        backgroundColor: '#f5f5f5',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        border: '2px solid #e0e0e0'
    };

    const numberStyle = {
        fontSize: '48px',
        fontWeight: 'bold',
        margin: '10px 0'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <h1 style={headerStyle}>Loading...</h1>
                <p style={{ fontSize: '18px' }}>Please wait while we fetch your data</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <h1 style={{ ...headerStyle, color: '#d32f2f' }}>Error!</h1>
                <p style={{ fontSize: '18px', color: '#d32f2f' }}>{error}</p>
                <p style={{ marginTop: '20px' }}>Check console for details (press F12)</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div style={containerStyle}>
                <h1 style={headerStyle}>No Data</h1>
                <p style={{ fontSize: '18px' }}>Stats data is not available</p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>🎯 Admin Dashboard</h1>
            <p style={{ fontSize: '18px', marginBottom: '30px' }}>Welcome to SEMS Admin Panel</p>

            <div style={cardContainerStyle}>
                <div style={cardStyle}>
                    <div style={{ ...numberStyle, color: '#1976d2' }}>
                        {stats.totalUsers || 0}
                    </div>
                    <div style={{ fontSize: '16px', color: '#666' }}>Total Users</div>
                </div>

                <div style={cardStyle}>
                    <div style={{ ...numberStyle, color: '#9c27b0' }}>
                        {stats.totalOrganizers || 0}
                    </div>
                    <div style={{ fontSize: '16px', color: '#666' }}>Organizers</div>
                </div>

                <div style={cardStyle}>
                    <div style={{ ...numberStyle, color: '#2e7d32' }}>
                        {stats.totalEvents || 0}
                    </div>
                    <div style={{ fontSize: '16px', color: '#666' }}>Total Events</div>
                </div>

                <div style={cardStyle}>
                    <div style={{ ...numberStyle, color: '#f57c00' }}>
                        {stats.pendingEvents || 0}
                    </div>
                    <div style={{ fontSize: '16px', color: '#666' }}>Pending Events</div>
                </div>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>📊 Debug Data</h2>
                <pre style={{
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '5px',
                    overflow: 'auto',
                    fontSize: '12px',
                    border: '1px solid #ddd'
                }}>
                    {JSON.stringify(stats, null, 2)}
                </pre>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                    ✅ <strong>Dashboard loaded successfully!</strong> If you see this, the issue is fixed.
                </p>
                <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
                    Backend: Connected | Auth: Working | Role: ADMIN
                </p>
            </div>
        </div>
    );
};

export default AdminDashboardMinimal;
