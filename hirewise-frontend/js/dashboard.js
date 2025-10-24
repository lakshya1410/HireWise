// Dashboard Main Logic
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!Storage.isAuthenticated()) {
        window.location.href = 'auth.html?mode=login';
        return;
    }
    
    // Initialize dashboard
    initDashboard();
    initNavigation();
    initProfileMenu();
    loadUserData();
    loadDashboardStats();
    initCalendar();
    initPerformanceChart();
    loadModals();
});

function initDashboard() {
    // Set initial view
    showView('dashboard');
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding view
            const view = item.getAttribute('data-view');
            showView(view);
        });
    });
}

function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected view
    const selectedView = document.getElementById(`${viewName}-view`);
    if (selectedView) {
        selectedView.classList.remove('hidden');
    }
    
    // Load view-specific content
    loadViewContent(viewName);
}

function loadViewContent(viewName) {
    switch(viewName) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'resume':
            loadResume();
            break;
        case 'ats':
            // ATS checker modal button
            const atsBtn = document.getElementById('open-ats-modal');
            if (atsBtn) {
                atsBtn.onclick = () => ATSChecker.instance.openModal();
            }
            break;
        case 'jdmatcher':
            // JD matcher modal button
            const jdBtn = document.getElementById('open-jd-modal');
            if (jdBtn) {
                jdBtn.onclick = () => JDMatcher.instance.openModal();
            }
            break;
        case 'interview':
            // Interview modal button
            const interviewBtn = document.getElementById('open-interview-modal');
            if (interviewBtn) {
                interviewBtn.onclick = () => InterviewManager.instance.startInterview();
            }
            break;
        case 'jobs':
            loadJobs();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

function initProfileMenu() {
    const profileBtn = document.getElementById('profile-menu-btn');
    const profileMenu = document.getElementById('profile-menu');
    const logoutBtn = document.getElementById('logout-btn');
    
    profileBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', () => {
        profileMenu?.classList.add('hidden');
    });
    
    // Logout
    logoutBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (confirm('Are you sure you want to logout?')) {
            await API.logout();
            window.location.href = 'index.html';
        }
    });
}

function loadUserData() {
    const user = Storage.getUser();
    if (!user) return;
    
    // Update user info in header
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const streakCount = document.getElementById('streak-count');
    const pointsCount = document.getElementById('points-count');
    
    if (userName) userName.textContent = user.fullName.split(' ')[0];
    if (userAvatar) userAvatar.textContent = user.fullName.charAt(0).toUpperCase();
    if (streakCount) streakCount.textContent = user.streak || 0;
    if (pointsCount) pointsCount.textContent = user.totalPoints || 0;
}

async function loadDashboardStats() {
    try {
        const response = await API.getDashboardStats();
        
        if (response.success) {
            const stats = response.data;
            
            // Update stats cards
            document.getElementById('total-interviews').textContent = stats.totalInterviews;
            document.getElementById('avg-score').textContent = stats.avgScore;
            document.getElementById('streak-display').textContent = `${stats.streak} days`;
            
            // Update recent activity
            loadRecentActivity(stats.recentInterviews);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function loadRecentActivity(interviews) {
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;
    
    if (interviews.length === 0) {
        activityContainer.innerHTML = '<p class="text-gray-400 text-sm">No recent activity</p>';
        return;
    }
    
    activityContainer.innerHTML = interviews.map(interview => `
        <div class="activity-item">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-semibold">Mock Interview</p>
                    <p class="text-sm text-gray-400">${new Date(interview.date).toLocaleDateString()}</p>
                </div>
                <div class="text-accent-cyan font-bold">${interview.score}/100</div>
            </div>
        </div>
    `).join('');
}

function initCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;
    
    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: getCalendarEvents(),
        eventClick: function(info) {
            alert('Interview: ' + info.event.title);
        },
        height: 'auto'
    });
    
    calendar.render();
}

function getCalendarEvents() {
    const interviews = Storage.getInterviews();
    
    return interviews.map(interview => ({
        title: 'Interview',
        start: interview.date,
        color: interview.status === 'completed' ? '#10b981' : '#00acc1',
        extendedProps: {
            interviewId: interview.interviewId,
            score: interview.score
        }
    }));
}

function initPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;
    
    const interviews = Storage.getInterviews()
        .filter(i => i.status === 'completed')
        .slice(-10); // Last 10 interviews
    
    const labels = interviews.map((_, index) => `Interview ${index + 1}`);
    const scores = interviews.map(i => i.score || 0);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Interview Score',
                data: scores,
                borderColor: '#00acc1',
                backgroundColor: 'rgba(0, 172, 193, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#9ca3af'
                    },
                    grid: {
                        color: 'rgba(0, 172, 193, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#9ca3af'
                    },
                    grid: {
                        color: 'rgba(0, 172, 193, 0.1)'
                    }
                }
            }
        }
    });
}

function loadResume() {
    const resumePreview = document.getElementById('resume-preview');
    if (!resumePreview) return;
    
    // Show loading
    resumePreview.innerHTML = '<div class="text-center py-12"><div class="spinner mx-auto"></div><p class="mt-4 text-gray-400">Loading resumes...</p></div>';
    
    // Fetch resumes from backend
    API.getUserResumes().then(response => {
        if (response.success && response.data && response.data.length > 0) {
            const resumes = response.data;
            
            resumePreview.innerHTML = `
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold mb-4">Your Resumes</h2>
                    ${resumes.map(resume => `
                        <div class="p-4 bg-primary-dark-secondary border border-accent-cyan/20 rounded-lg">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="font-semibold text-lg">${resume.fileName}</h3>
                                    <p class="text-sm text-gray-400">Uploaded: ${new Date(resume.uploadedAt).toLocaleDateString()}</p>
                                    ${resume.atsScore ? `<p class="text-sm text-accent-cyan">ATS Score: ${resume.atsScore}%</p>` : ''}
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="viewResume('${resume.resumeId}')" 
                                            class="px-4 py-2 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                                        View
                                    </button>
                                    <button onclick="downloadResume('${resume.resumeId}', '${resume.fileName}')" 
                                            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    <button onclick="uploadResume()" 
                            class="w-full px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                        + Upload New Resume
                    </button>
                </div>
            `;
        } else {
            resumePreview.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-gray-400 mb-4">No resume uploaded yet</p>
                    <button onclick="uploadResume()" class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                        Upload Resume
                    </button>
                </div>
            `;
        }
    }).catch(error => {
        console.error('Error loading resumes:', error);
        resumePreview.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-500 mb-4">❌ Failed to load resumes</p>
                <button onclick="loadResume()" class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                    Retry
                </button>
            </div>
        `;
    });
}

async function viewResume(resumeId) {
    try {
        const blob = await API.getResumeFile(resumeId);
        if (blob) {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } else {
            showNotification('Failed to load resume file', 'error');
        }
    } catch (error) {
        console.error('Error viewing resume:', error);
        showNotification('Error viewing resume', 'error');
    }
}

async function downloadResume(resumeId, fileName) {
    try {
        const blob = await API.getResumeFile(resumeId);
        if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
            showNotification('Resume downloaded!', 'success');
        } else {
            showNotification('Failed to download resume', 'error');
        }
    } catch (error) {
        console.error('Error downloading resume:', error);
        showNotification('Error downloading resume', 'error');
    }
}

function uploadResume() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show notification
            showNotification('Uploading resume...', 'info');
            
            try {
                // Use ATS upload endpoint to save resume
                const response = await API.checkATS(file);
                
                if (response.success) {
                    showNotification('Resume uploaded successfully!', 'success');
                    loadResume(); // Reload the resume list
                } else {
                    showNotification(response.message || 'Upload failed', 'error');
                }
            } catch (error) {
                console.error('Error uploading resume:', error);
                showNotification('Error uploading resume', 'error');
            }
        }
    };
    
    input.click();
}

function loadJobs() {
    // Mock job listings
    // This will be replaced with actual API call
    const jobsView = document.getElementById('jobs-view');
    if (jobsView) {
        jobsView.innerHTML = `
            <h1 class="text-3xl font-bold mb-6">Job Discovery</h1>
            <div class="bg-primary-dark-secondary border border-accent-cyan/20 rounded-lg p-8 text-center">
                <div class="text-6xl mb-4">💼</div>
                <h3 class="text-2xl font-bold mb-4">Job Discovery Coming Soon!</h3>
                <p class="text-gray-400 mb-6">
                    We're working on an amazing job discovery feature that will help you find 
                    the perfect opportunities matched to your skills and experience.
                </p>
                <div class="inline-block px-6 py-3 bg-accent-cyan/20 text-accent-cyan rounded-lg">
                    Feature in Development
                </div>
            </div>
        `;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

async function loadProfile() {
    const profileView = document.getElementById('profile-view');
    if (!profileView) return;
    
    // Show loading
    profileView.innerHTML = '<div class="text-center py-12"><div class="spinner mx-auto"></div><p class="mt-4 text-gray-400">Loading profile...</p></div>';
    
    const response = await API.getProfile();
    
    if (response.success && response.data) {
        const profile = response.data;
        
        profileView.innerHTML = `
            <h1 class="text-3xl font-bold mb-6">My Profile</h1>
            
            <div class="bg-primary-dark-secondary border border-accent-cyan/20 rounded-lg p-6">
                <div id="profile-view-mode">
                    <div class="space-y-6">
                        <div class="flex items-center gap-6 mb-8">
                            <div class="w-24 h-24 bg-accent-cyan/20 rounded-full flex items-center justify-center text-4xl font-bold text-accent-cyan">
                                ${profile.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold">${profile.fullName}</h2>
                                <p class="text-gray-400">${profile.email}</p>
                            </div>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                <p class="text-lg">${profile.fullName}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <p class="text-lg">${profile.email}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                                <p class="text-lg">${profile.phone || 'Not provided'}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-400 mb-2">Member Since</label>
                                <p class="text-lg">${new Date(profile.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        ${profile.education && profile.education.length > 0 ? `
                            <div>
                                <label class="block text-sm font-medium text-gray-400 mb-4">Education</label>
                                <div class="space-y-3">
                                    ${profile.education.map(edu => `
                                        <div class="p-4 bg-primary-dark rounded-lg border border-accent-cyan/10">
                                            <h4 class="font-semibold">${edu.degree} in ${edu.field || 'N/A'}</h4>
                                            <p class="text-gray-400">${edu.institution}</p>
                                            <p class="text-sm text-gray-500">${edu.year || 'N/A'}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="flex gap-4 mt-8">
                            <button onclick="editProfile()" 
                                    class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
                
                <div id="profile-edit-mode" class="hidden">
                    <!-- Edit form will be inserted here -->
                </div>
            </div>
        `;
    } else {
        profileView.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-500 mb-4">❌ Failed to load profile</p>
                <button onclick="loadProfile()" class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                    Retry
                </button>
            </div>
        `;
    }
}

async function editProfile() {
    const response = await API.getProfile();
    if (!response.success) {
        showNotification('Failed to load profile', 'error');
        return;
    }
    
    const profile = response.data;
    const viewMode = document.getElementById('profile-view-mode');
    const editMode = document.getElementById('profile-edit-mode');
    
    viewMode.classList.add('hidden');
    editMode.classList.remove('hidden');
    
    editMode.innerHTML = `
        <form id="profile-edit-form" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium mb-2">Full Name</label>
                    <input type="text" id="edit-fullName" value="${profile.fullName}" 
                           class="w-full px-4 py-3 bg-primary-dark border border-accent-cyan/30 rounded-lg focus:outline-none focus:border-accent-cyan text-white">
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-2">Phone</label>
                    <input type="tel" id="edit-phone" value="${profile.phone || ''}" 
                           class="w-full px-4 py-3 bg-primary-dark border border-accent-cyan/30 rounded-lg focus:outline-none focus:border-accent-cyan text-white">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Email (cannot be changed)</label>
                <input type="email" value="${profile.email}" disabled 
                       class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-400">
            </div>
            
            <div class="flex gap-4">
                <button type="submit" 
                        class="px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                    Save Changes
                </button>
                <button type="button" onclick="cancelEditProfile()" 
                        class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                    Cancel
                </button>
            </div>
        </form>
    `;
    
    // Handle form submission
    document.getElementById('profile-edit-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('edit-fullName').value;
        const phone = document.getElementById('edit-phone').value;
        
        showNotification('Updating profile...', 'info');
        
        const updateResponse = await API.updateProfile({
            fullName,
            phone
        });
        
        if (updateResponse.success) {
            showNotification('Profile updated successfully!', 'success');
            loadProfile(); // Reload profile to show changes
        } else {
            showNotification(updateResponse.message || 'Failed to update profile', 'error');
        }
    });
}

function cancelEditProfile() {
    const viewMode = document.getElementById('profile-view-mode');
    const editMode = document.getElementById('profile-edit-mode');
    
    editMode.classList.add('hidden');
    viewMode.classList.remove('hidden');
}
