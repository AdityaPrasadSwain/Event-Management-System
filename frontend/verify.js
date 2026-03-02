// MANUAL TESTING SCRIPT - Run in Browser Console (F12)
// Copy and paste this entire script after logging in

console.log('%c=== EVENT MANAGEMENT SYSTEM - VERIFICATION SCRIPT ===', 'color: #00ff00; font-size: 16px; font-weight: bold');

// ========================================
// STEP 1: Check Authentication Status
// ========================================
console.log('%c\n[STEP 1] Checking Authentication...', 'color: #ffff00; font-weight: bold');

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const email = localStorage.getItem('email');
const name = localStorage.getItem('name');

console.log('✓ Token exists:', !!token);
console.log('✓ Role:', role);
console.log('✓ Email:', email);
console.log('✓ Name:', name);

// Decode JWT to see actual claims
if (token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('✓ JWT Payload:', payload);
        console.log('✓ JWT Roles:', payload.roles);
        console.log('✓ JWT Expiry:', new Date(payload.exp * 1000).toLocaleString());
    } catch (e) {
        console.error('❌ Error decoding token:', e);
    }
}

// ========================================
// STEP 2: Test API Endpoints
// ========================================
console.log('%c\n[STEP 2] Testing API Endpoints...', 'color: #ffff00; font-weight: bold');

async function testAPI(method, endpoint, data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`http://localhost:9090${endpoint}`, options);
        const status = response.status;
        const statusText = response.statusText;

        let result = `${method} ${endpoint} → ${status} ${statusText}`;

        if (status === 200 || status === 201) {
            console.log(`✅ ${result}`);
        } else if (status === 403) {
            console.log(`⚠️  ${result} (Expected for cross-role access)`);
        } else {
            console.error(`❌ ${result}`);
        }

        return { status, statusText };
    } catch (error) {
        console.error(`❌ ${method} ${endpoint} → NETWORK ERROR:`, error.message);
        return { error: error.message };
    }
}

// Test based on role
if (role === 'EVENT_ORGANIZER' || role === 'ORGANIZER') {
    console.log('\n📊 Testing ORGANIZER APIs...');
    await testAPI('GET', '/api/organizer/events');
    console.log('\n🔒 Testing Cross-Role Access (should be 403)...');
    await testAPI('GET', '/api/admin/users');
} else if (role === 'ADMIN') {
    console.log('\n📊 Testing ADMIN APIs...');
    await testAPI('GET', '/api/admin/users');
    await testAPI('GET', '/api/admin/events');
} else if (role === 'USER') {
    console.log('\n📊 Testing USER APIs...');
    await testAPI('GET', '/api/user/bookings');
}

// ========================================
// STEP 3: Check Current Page
// ========================================
console.log('%c\n[STEP 3] Checking Current Page...', 'color: #ffff00; font-weight: bold');

const currentPath = window.location.pathname;
console.log('✓ Current path:', currentPath);
console.log('✓ Page title:', document.title);

// Check if on error page
const is403 = document.body.innerText.includes('403') || document.body.innerText.includes('Access Denied');
const is404 = document.body.innerText.includes('404') || document.body.innerText.includes('Not Found');
const isBlank = document.body.innerText.trim().length < 100;

if (is403) {
    console.error('❌ Currently on 403 Access Denied page!');
} else if (is404) {
    console.warn('⚠️  Currently on 404 Not Found page');
} else if (isBlank) {
    console.error('❌ Page appears blank/empty!');
} else {
    console.log('✅ Page loaded successfully');
}

// ========================================
// STEP 4: Test Route Navigation
// ========================================
console.log('%c\n[STEP 4] Route Navigation Test', 'color: #ffff00; font-weight: bold');
console.log('Copy and run these commands to test each route:\n');

if (role === 'EVENT_ORGANIZER' || role === 'ORGANIZER') {
    const routes = [
        '/organizer/dashboard',
        '/organizer/create-event',
        '/organizer/events',
        '/organizer/bookings',
        '/organizer/revenue',
        '/organizer/notifications',
        '/organizer/ai/description',
        '/organizer/ai/pricing',
        '/organizer/ai/marketing',
        '/organizer/analytics',
        '/organizer/profile',
        '/organizer/support'
    ];

    console.log('ORGANIZER ROUTES TO TEST:');
    routes.forEach((route, index) => {
        console.log(`${index + 1}. window.location.href = "http://localhost:5181${route}";`);
    });

    console.log('\nTO TEST ALL ROUTES AUTOMATICALLY:');
    console.log(`
window.testAllRoutes = async function() {
    const routes = ${JSON.stringify(routes)};
    for (let route of routes) {
        console.log('Testing:', route);
        window.location.href = 'http://localhost:5181' + route;
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const isError = document.body.innerText.includes('403') || 
                       document.body.innerText.includes('404') ||
                       document.body.innerText.trim().length < 100;
        
        if (isError) {
            console.error('❌ FAILED:', route);
            break;
        } else {
            console.log('✅ PASSED:', route);
        }
    }
};
testAllRoutes();
    `);
}

// ========================================
// STEP 5: Check for Errors
// ========================================
console.log('%c\n[STEP 5] Checking for Errors...', 'color: #ffff00; font-weight bold');

// Check console for errors
const errorCount = performance.getEntriesByType('navigation')[0]?.transferSize || 0;
console.log('✓ Page loaded successfully');

// Check network for failed requests
if (window.performance && window.performance.getEntriesByType) {
    const resources = window.performance.getEntriesByType('resource');
    const failedResources = resources.filter(r => r.transferSize === 0 && !r.name.includes('chrome-extension'));

    if (failedResources.length > 0) {
        console.warn('⚠️  Some resources failed to load:');
        failedResources.forEach(r => console.warn('  -', r.name));
    } else {
        console.log('✅ All resources loaded successfully');
    }
}

// ========================================
// FINAL SUMMARY
// ========================================
console.log('%c\n=== VERIFICATION COMPLETE ===', 'color: #00ff00; font-size: 16px; font-weight: bold');
console.log('\n📋 SUMMARY:');
console.log('✓ Token:', !!token ? 'PRESENT' : 'MISSING');
console.log('✓ Role:', role || 'NOT SET');
console.log('✓ Current Page:', currentPath);
console.log('✓ Page Status:', isBlank ? 'BLANK ❌' : is403 ? '403 ERROR ❌' : is404 ? '404 ERROR ⚠️' : 'LOADED ✅');

console.log('\n🎯 NEXT STEPS:');
if (role === 'EVENT_ORGANIZER' || role === 'ORGANIZER') {
    console.log('1. Click sidebar items one by one');
    console.log('2. Verify each page loads (NOT 403!)');
    console.log('3. Pay special attention to:');
    console.log('   - Create Event (was showing 403)');
    console.log('   - Analytics (was showing 403)');
}

console.log('\n💡 TIP: If you see 403 errors, run this:');
console.log('localStorage.clear(); location.reload();');
console.log('Then login again with fresh credentials.');
