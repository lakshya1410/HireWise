// Particle Background Animation
function initParticleBackground() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = rgba(0, 172, 193, ${Math.random() * 0.4});
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const particles = [];
    const particleCount = Math.min(window.innerWidth / 10, 100);

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        const maxDistance = 100;

        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = rgba(0, 172, 193, ${opacity * 0.2});
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const particle of particles) {
            particle.update();
            particle.draw();
        }

        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

// Navbar scroll effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('bg-[#1a237e]/90', 'backdrop-blur-md', 'py-2', 'shadow-lg');
            navbar.classList.remove('bg-transparent', 'py-4');
        } else {
            navbar.classList.remove('bg-[#1a237e]/90', 'backdrop-blur-md', 'py-2', 'shadow-lg');
            navbar.classList.add('bg-transparent', 'py-4');
        }
    });

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });
}

// Hero headline animation
function initHeroAnimation() {
    const headline = document.getElementById('heroHeadline');
    const text = headline.innerText;
    headline.innerHTML = '';

    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.innerText = char;
        span.style.opacity = '0';
        span.style.animation = fadeIn 0.1s forwards ${index * 0.03}s;
        headline.appendChild(span);
    });
}

// Feature tabs functionality
function initFeatureTabs() {
    const tabs = document.querySelectorAll('.feature-tab');
    const mockup = document.getElementById('feature-mockup');
    const title = document.getElementById('feature-title');
    const description = document.getElementById('feature-description');
    const benefits = document.getElementById('feature-benefits');

    const features = [
        {
            title: 'Resume-JD Compatibility Analysis',
            description: 'Our AI analyzes your resume against job descriptions to identify gaps, suggest improvements, and maximize your match score.',
            benefits: [
                'Analyzes keyword frequency and relevance to job requirements',
                'Identifies missing skills and experience gaps',
                'Suggests tailored improvements to increase match percentage'
            ],
            mockup: `
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold">Resume Match Analysis</h4>
                    <span class="text-[#00acc1] font-bold">78%</span>
                </div>

                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Technical Skills</span>
                            <span class="text-[#00acc1]">85%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 85%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Experience</span>
                            <span class="text-[#00acc1]">72%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 72%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Education</span>
                            <span class="text-[#00acc1]">90%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 90%"></div>
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Keywords</span>
                            <span class="text-[#00acc1]">65%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 65%"></div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 p-3 bg-white/5 rounded-lg">
                    <h5 class="text-sm font-medium mb-2">Recommendations:</h5>
                    <ul class="text-xs space-y-1 text-gray-300">
                        <li>• Add more cloud deployment experience to your resume</li>
                        <li>• Highlight team leadership skills in your summary</li>
                        <li>• Include specific metrics from previous projects</li>
                    </ul>
                </div>
            `
        },
        {
            title: 'AI Interview Coaching',
            description: 'Practice with our AI interviewer → Real-time feedback on answers, tone & body language for continuous improvement.',
            benefits: [
                'Real-time feedback on answers',
                'Analysis of your tone and voice',
                'Insights into body language (if video is used)'
            ],
            mockup: `
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold">Mock Interview Progress</h4>
                    <span class="text-[#00acc1] font-bold">Session 5/10</span>
                </div>
                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Answer Clarity</span>
                            <span class="text-[#00acc1]">80%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 80%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Confidence Score</span>
                            <span class="text-[#00acc1]">75%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 75%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Conciseness</span>
                            <span class="text-[#00acc1]">60%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 60%"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-white/5 rounded-lg">
                    <h5 class="text-sm font-medium mb-2">Next Steps:</h5>
                    <ul class="text-xs space-y-1 text-gray-300">
                        <li>• Work on structuring your STAR method responses more clearly.</li>
                        <li>• Practice maintaining consistent eye contact.</li>
                        <li>• Reduce filler words by pausing before answering.</li>
                    </ul>
                </div>
            `
        },
        {
            title: 'Voice & Tone Analysis',
            description: 'Get real-time feedback on your voice, tone, and delivery during AI mock interviews to ensure effective communication.',
            benefits: [
                'Analyzes pitch, volume, and speaking rate',
                'Detects nervousness or monotone delivery',
                'Provides tips for vocal modulation and clarity'
            ],
            mockup: `
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold">Vocal Analysis</h4>
                    <span class="text-[#00acc1] font-bold">Good</span>
                </div>
                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Volume</span>
                            <span class="text-[#00acc1]">70%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 70%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Pitch Variation</span>
                            <span class="text-[#00acc1]">65%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 65%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Speaking Rate</span>
                            <span class="text-[#00acc1]">85%</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 85%"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-white/5 rounded-lg">
                    <h5 class="text-sm font-medium mb-2">Recommendations:</h5>
                    <ul class="text-xs space-y-1 text-gray-300">
                        <li>• Vary your pitch to sound more engaging.</li>
                        <li>• Be mindful of speaking too quickly; try to moderate your pace.</li>
                    </ul>
                </div>
            `
        },
        {
            title: 'Performance Analytics Dashboard',
            description: 'Track your progress over time with a comprehensive dashboard that provides actionable insights to boost your confidence and interview skills.',
            benefits: [
                'Detailed breakdown of interview performance',
                'Progress tracking over multiple sessions',
                'Identification of strengths and areas for improvement'
            ],
            mockup: `
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold">Overall Performance</h4>
                    <span class="text-[#00acc1] font-bold">Improved</span>
                </div>
                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Overall Score</span>
                            <span class="text-[#00acc1]">75% (+5%)</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 75%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Mock Interviews Completed</span>
                            <span class="text-[#00acc1]">12</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 100%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Resume Match Trend</span>
                            <span class="text-[#00acc1]">📈</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 100%"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-white/5 rounded-lg">
                    <h5 class="text-sm font-medium mb-2">Insights:</h5>
                    <ul class="text-xs space-y-1 text-gray-300">
                        <li>• Consistently improving in behavioral questions.</li>
                        <li>• Need to focus on technical depth for specific roles.</li>
                    </ul>
                </div>
            `
        },
        {
            title: 'Integrated Job Search',
            description: 'Search and apply for jobs directly from Naukri and LinkedIn, all within one platform with integrated tracking and application management.',
            benefits: [
                'Search jobs across multiple platforms',
                'Track application status and progress',
                'Receive personalized job recommendations'
            ],
            mockup: `
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold">Job Applications</h4>
                    <span class="text-[#00acc1] font-bold">15 Active</span>
                </div>
                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Applied (LinkedIn)</span>
                            <span class="text-[#00acc1]">8</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 80%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Applied (Naukri)</span>
                            <span class="text-[#00acc1]">7</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 70%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span>Interviews Scheduled</span>
                            <span class="text-[#00acc1]">3</span>
                        </div>
                        <div class="h-2 bg-white/10 rounded-full">
                            <div class="h-full bg-[#00acc1] rounded-full" style="width: 30%"></div>
                        </div>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-white/5 rounded-lg">
                    <h5 class="text-sm font-medium mb-2">Recent Searches:</h5>
                    <ul class="text-xs space-y-1 text-gray-300">
                        <li>• Software Engineer, Bangalore</li>
                        <li>• Data Scientist, Remote</li>
                    </ul>
                </div>
            `
        },
        {
            title: 'Interview Scheduling & Tracking',
            description: 'Effortlessly manage your interview schedule and track the progress of each application, ensuring you never miss an opportunity.',
            benefits: [
                'Centralized interview calendar',
                'Automated reminders for upcoming interviews',
                'Status updates for each application stage'
            ],
            mockup: `
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold">Upcoming Interviews</h4>
                    <span class="text-[#00acc1] font-bold">Next: Mon, July 8</span>
                </div>
                <div class="space-y-3">
                    <div class="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium">Google - Software Engineer</p>
                            <p class="text-xs text-gray-400">July 8, 2025, 10:00 AM</p>
                        </div>
                        <span class="text-[#00acc1] text-xs px-2 py-1 rounded-full bg-[#00acc1]/20">Scheduled</span>
                    </div>
                    <div class="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium">Amazon - Data Scientist</p>
                            <p class="text-xs text-gray-400">July 10, 2025, 2:30 PM</p>
                        </div>
                        <span class="text-[#00acc1] text-xs px-2 py-1 rounded-full bg-[#00acc1]/20">Scheduled</span>
                    </div>
                    <div class="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium">Microsoft - ML Engineer</p>
                            <p class="text-xs text-gray-400">Status: Pending</p>
                        </div>
                        <span class="text-gray-400 text-xs px-2 py-1 rounded-full bg-white/10">Follow-up</span>
                    </div>
                </div>
                <div class="mt-4 p-3 bg-white/5 rounded-lg">
                    <h5 class="text-sm font-medium mb-2">Application Pipeline:</h5>
                    <ul class="text-xs space-y-1 text-gray-300">
                        <li>• Initial Screening: 8</li>
                        <li>• Technical Interview: 5</li>
                        <li>• Final Round: 2</li>
                    </ul>
                </div>
            `
        }
    ];

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => {
                t.classList.remove('bg-[#00acc1]', 'text-white');
                t.classList.add('bg-white/5', 'hover:bg-white/10');
            });
            tab.classList.add('bg-[#00acc1]', 'text-white');
            tab.classList.remove('bg-white/5', 'hover:bg-white/10');

            // Update content
            if (features[index]) {
                title.textContent = features[index].title;
                description.textContent = features[index].description;
                mockup.innerHTML = features[index].mockup;

                benefits.innerHTML = features[index].benefits.map(benefit => `
                    <div class="flex items-start gap-3">
                        <div class="w-6 h-6 rounded-full bg-[#00acc1]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span class="text-[#00acc1] text-sm">✓</span>
                        </div>
                        <p class="text-gray-300">${benefit}</p>
                    </div>
                `).join('');
            }
        });
    });
}

// Set current year in footer
function setCurrentYear() {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initParticleBackground();
    initNavbar();
    initHeroAnimation();
    initFeatureTabs();
    setCurrentYear();
});