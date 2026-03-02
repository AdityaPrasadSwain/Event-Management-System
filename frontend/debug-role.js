// DEBUG SCRIPT - Run this in browser console after login
// Open DevTools (F12) → Console tab → Paste this code

console.log('=== AUTH DEBUG INFO ===');
console.log('1. LocalStorage role:', localStorage.getItem('role'));
console.log('2. LocalStorage email:', localStorage.getItem('email'));
console.log('3. LocalStorage name:', localStorage.getItem('name'));
console.log('4. Token exists:', !!localStorage.getItem('token'));

// Decode JWT to see what's inside
try {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('5. JWT Payload:', payload);
        console.log('6. JWT roles claim:', payload.roles || payload.role);
    }
} catch (e) {
    console.error('Error decoding token:', e);
}

// Check what ProtectedRoute sees
console.log('=== COPY THESE VALUES ===');
console.log('Role from localStorage:', localStorage.getItem('role'));
console.log('Expected role in routes: EVENT_ORGANIZER');
console.log('Match?', localStorage.getItem('role') === 'EVENT_ORGANIZER');
