import React from 'react';

function TestPage() {
    return (
        <div style={{
            backgroundColor: '#00FF00',  // Bright green - impossible to miss!
            color: '#000000',
            minHeight: '100vh',
            padding: '50px',
            fontSize: '32px',
            fontWeight: 'bold'
        }}>
            <h1 style={{ fontSize: '64px', marginBottom: '30px' }}>
                ✅ TEST PAGE - YOU CAN SEE THIS!
            </h1>
            <p>If you can see this GREEN page, routing works!</p>
            <p>Current URL: {window.location.href}</p>
            <p>LocalStorage Token: {localStorage.getItem('token') ? 'EXISTS' : 'MISSING'}</p>
            <p>LocalStorage Role: {localStorage.getItem('role')}</p>
        </div>
    );
}

export default TestPage;
