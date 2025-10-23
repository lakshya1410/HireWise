// Landing Page Scripts
document.addEventListener('DOMContentLoaded', () => {
    // Particle Animation for Hero Section
    initParticleAnimation();
    
    // Smooth scrolling for anchor links
    initSmoothScroll();
    
    // Mobile menu toggle (if needed)
    initMobileMenu();
    
    // Feature card animations
    initFeatureCards();
    
    // Scroll progress indicator
    initScrollProgress();
    
    // Load testimonials from localStorage
    loadTestimonials();
});

// Particle Animation
function initParticleAnimation() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 172, 193, 0.5)';
            ctx.fill();
        }
    }
    
    // Create particles
    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Connect particles
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 172, 193, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        
        animationId = requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
    
    // Cleanup on page leave
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Calculate offset for fixed navbar
                const navbarHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuButton || !mobileMenu) return;
    
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Feature Cards Animation on Scroll
function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => observer.observe(card));
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// Check authentication status
function checkAuthStatus() {
    if (Storage && Storage.isAuthenticated()) {
        // User is logged in, update UI if needed
        const loginBtn = document.querySelector('a[href="auth.html?mode=login"]');
        const signupBtn = document.querySelector('a[href="auth.html?mode=signup"]');
        
        if (loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.href = 'dashboard.html';
        }
        
        if (signupBtn) {
            signupBtn.classList.add('hidden');
        }
    }
}

// Initialize on load
checkAuthStatus();

// Newsletter subscription (mock)
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Show success message
        showNotification('Thank you for subscribing!', 'success');
        newsletterForm.reset();
    });
}

// Utility: Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load Testimonials from localStorage
function loadTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;
    
    const feedbacks = JSON.parse(localStorage.getItem('hirewise_feedbacks') || '[]');
    
    if (feedbacks.length === 0) {
        // Show placeholder if no feedbacks
        container.innerHTML = `
            <div class="border border-accent-cyan/20 rounded-lg p-6 backdrop-blur-md bg-primary-dark-secondary/30">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-accent-cyan/20 rounded-full flex items-center justify-center text-xl font-bold">?</div>
                    <div class="ml-4">
                        <div class="font-bold">Your Story Here</div>
                        <div class="text-sm text-gray-400">Be our first success story!</div>
                    </div>
                </div>
                <p class="text-gray-300 italic">"Complete an interview and share your experience to appear here!"</p>
                <div class="mt-4 text-accent-cyan">⭐⭐⭐⭐⭐</div>
            </div>
        `;
        return;
    }
    
    // Show latest feedbacks (max 6)
    const latestFeedbacks = feedbacks.slice(0, 6);
    
    container.innerHTML = latestFeedbacks.map(feedback => {
        const initials = feedback.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const stars = '⭐'.repeat(feedback.rating);
        
        return `
            <div class="border border-accent-cyan/20 rounded-lg p-6 backdrop-blur-md bg-primary-dark-secondary/30 transform hover:scale-105 transition">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-accent-cyan/20 rounded-full flex items-center justify-center text-xl font-bold">${initials}</div>
                    <div class="ml-4">
                        <div class="font-bold">${feedback.name}</div>
                        <div class="text-sm text-gray-400">${feedback.title}</div>
                    </div>
                </div>
                <p class="text-gray-300 italic">"${feedback.text}"</p>
                <div class="mt-4 text-accent-cyan">${stars}</div>
            </div>
        `;
    }).join('');
}
