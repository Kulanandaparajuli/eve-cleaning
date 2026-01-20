// Global state
let currentUser = null;
let mockData = {
    users: [
        { id: 1, email: 'admin@evegroup.com.au', password: 'admin123', firstName: 'Admin', lastName: 'User', role: 'admin' },
        { id: 2, email: 'manager@evegroup.com.au', password: 'admin123', firstName: 'Sarah', lastName: 'Johnson', role: 'manager' },
        { id: 3, email: 'cleaner@evegroup.com.au', password: 'admin123', firstName: 'Emma', lastName: 'White', role: 'cleaner' }
    ],
    sites: [
        { id: 1, name: 'Brisbane City Office Tower', address: '123 Queen St, Brisbane QLD 4000', client: 'Brisbane City Properties', status: 'active' },
        { id: 2, name: 'South Bank Shopping Centre', address: '456 Grey St, South Brisbane QLD 4101', client: 'Brisbane City Properties', status: 'active' },
        { id: 3, name: 'Fortitude Valley Medical Centre', address: '789 Brunswick St, Fortitude Valley QLD 4006', client: 'Brisbane City Properties', status: 'active' }
    ],
    shifts: [
        { id: 1, siteId: 1, cleanerId: 3, date: new Date().toISOString().split('T')[0], startTime: '06:00', endTime: '10:00', status: 'scheduled' },
        { id: 2, siteId: 2, cleanerId: 3, date: new Date().toISOString().split('T')[0], startTime: '18:00', endTime: '22:00', status: 'scheduled' }
    ],
    timesheets: [],
    issues: [
        { id: 1, siteId: 2, title: 'Low cleaning supplies', description: 'Running low on toilet paper and hand soap', severity: 'medium', status: 'open', reportedBy: 3, reportedAt: new Date().toISOString() }
    ]
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('eveUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
});

// Login handler
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    const user = mockData.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { userId: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role };
        localStorage.setItem('eveUser', JSON.stringify(currentUser));
        errorDiv.classList.add('hidden');
        showDashboard();
    } else {
        errorDiv.textContent = 'Invalid email or password';
        errorDiv.classList.remove('hidden');
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('eveUser');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('dashboardPage').classList.add('hidden');
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('dashboardPage').classList.remove('hidden');
    document.getElementById('userName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('userRole').textContent = currentUser.role;
    loadDashboardHome();
}

// Load views
function loadView(viewId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');
    
    switch(viewId) {
        case 'home': loadDashboardHome(); break;
        case 'shifts': loadShiftsView(); break;
        case 'sites': loadSitesView(); break;
        case 'timesheets': loadTimesheetsView(); break;
        case 'issues': loadIssuesView(); break;
        case 'reports': loadReportsView(); break;
    }
}

// Dashboard Home
function loadDashboardHome() {
    const content = document.getElementById('mainContent');
    const todayShifts = mockData.shifts.filter(s => s.date === new Date().toISOString().split('T')[0]);
    
    content.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Today's Shifts</p>
                        <p class="text-3xl font-bold text-purple-600">${todayShifts.length}</p>
                    </div>
                    <i class="fas fa-calendar-day text-4xl text-purple-200"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Active Sites</p>
                        <p class="text-3xl font-bold text-blue-600">${mockData.sites.length}</p>
                    </div>
                    <i class="fas fa-building text-4xl text-blue-200"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Open Issues</p>
                        <p class="text-3xl font-bold text-orange-600">${mockData.issues.filter(i => i.status === 'open').length}</p>
                    </div>
                    <i class="fas fa-exclamation-triangle text-4xl text-orange-200"></i>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-1">Team Members</p>
                        <p class="text-3xl font-bold text-green-600">${mockData.users.length}</p>
                    </div>
                    <i class="fas fa-users text-4xl text-green-200"></i>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onclick="loadView('shifts')" class="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-3 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-calendar-plus mr-2"></i>View Shifts
                </button>
                <button onclick="loadView('issues')" class="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-3 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-flag mr-2"></i>View Issues
                </button>
                <button onclick="loadView('sites')" class="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-3 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-building mr-2"></i>Manage Sites
                </button>
                <button onclick="loadView('reports')" class="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-3 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-chart-line mr-2"></i>Reports
                </button>
            </div>
        </div>
    `;
}

// Shifts View
function loadShiftsView() {
    const content = document.getElementById('mainContent');
    const shifts = mockData.shifts.map(shift => {
        const site = mockData.sites.find(s => s.id === shift.siteId);
        const cleaner = mockData.users.find(u => u.id === shift.cleanerId);
        return { ...shift, siteName: site?.name, cleanerName: `${cleaner?.firstName} ${cleaner?.lastName}` };
    });
    
    content.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Shifts & Roster</h2>
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cleaner</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${shifts.map(shift => `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">${shift.siteName}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">${shift.cleanerName}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">${new Date(shift.date).toLocaleDateString('en-AU')}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">${shift.startTime} - ${shift.endTime}</td>
                            <td class="px-6 py-4">
                                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                    ${shift.status}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Sites View
function loadSitesView() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Sites</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${mockData.sites.map(site => `
                <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">${site.name}</h3>
                    <p class="text-sm text-gray-600 mb-1"><i class="fas fa-building mr-2 text-purple-600"></i>${site.client}</p>
                    <p class="text-sm text-gray-600 mb-3"><i class="fas fa-map-marker-alt mr-2 text-purple-600"></i>${site.address}</p>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        ${site.status}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}

// Timesheets View
function loadTimesheetsView() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Timesheets</h2>
        
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
            <i class="fas fa-clock text-6xl text-gray-300 mb-4"></i>
            <p class="text-gray-600 text-lg">No timesheets yet. Timesheets are automatically generated when cleaners check in and out of shifts.</p>
            <button onclick="loadView('shifts')" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
                View Shifts
            </button>
        </div>
    `;
}

// Issues View
function loadIssuesView() {
    const content = document.getElementById('mainContent');
    const issues = mockData.issues.map(issue => {
        const site = mockData.sites.find(s => s.id === issue.siteId);
        const reporter = mockData.users.find(u => u.id === issue.reportedBy);
        return { ...issue, siteName: site?.name, reporterName: `${reporter?.firstName} ${reporter?.lastName}` };
    });
    
    content.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Issues & Incidents</h2>
        
        <div class="space-y-4">
            ${issues.map(issue => `
                <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-400">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-2">
                                <h3 class="text-lg font-bold text-gray-800">${issue.title}</h3>
                                <span class="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                    ${issue.severity}
                                </span>
                                <span class="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                                    ${issue.status}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 mb-2">
                                <i class="fas fa-building mr-1"></i>${issue.siteName}
                            </p>
                            <p class="text-sm text-gray-700">${issue.description}</p>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500">
                        Reported by ${issue.reporterName} on ${new Date(issue.reportedAt).toLocaleString('en-AU')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Reports View
function loadReportsView() {
    const content = document.getElementById('mainContent');
    content.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">
                    <i class="fas fa-users text-purple-600 mr-2"></i>Team Overview
                </h3>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Total Staff:</span>
                        <span class="font-semibold">${mockData.users.length}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Active Sites:</span>
                        <span class="font-semibold">${mockData.sites.length}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Shifts Today:</span>
                        <span class="font-semibold">${mockData.shifts.filter(s => s.date === new Date().toISOString().split('T')[0]).length}</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4">
                    <i class="fas fa-chart-line text-blue-600 mr-2"></i>Performance Metrics
                </h3>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Completion Rate:</span>
                        <span class="font-semibold text-green-600">95%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Avg Quality Score:</span>
                        <span class="font-semibold text-blue-600">87/100</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Open Issues:</span>
                        <span class="font-semibold text-orange-600">${mockData.issues.filter(i => i.status === 'open').length}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
            <p class="text-gray-600">System operational. All sites being monitored.</p>
        </div>
    `;
}
