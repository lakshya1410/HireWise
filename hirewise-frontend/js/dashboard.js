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
    
    const resume = Storage.getResume();
    
    if (resume && resume.file) {
        resumePreview.innerHTML = `
            <div class="text-center">
                <p class="text-lg mb-4">Resume uploaded on ${new Date(resume.uploadedDate).toLocaleDateString()}</p>
                <iframe src="${resume.file}" class="w-full h-96 border border-accent-cyan/20 rounded-lg"></iframe>
                <button class="mt-4 px-6 py-3 bg-accent-cyan text-white rounded-lg hover:bg-accent-cyan/90 transition">
                    Update Resume
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
}

function uploadResume() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resumeData = await Storage.fileToBase64(file);
                Storage.saveResume(file, resumeData);
                loadResume();
                showNotification('Resume uploaded successfully!', 'success');
            } catch (error) {
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
