// Initialize AOS

        document.addEventListener('DOMContentLoaded', () => {
            const auroraContainer = document.querySelector('.aurora-container');
            new Aurora(auroraContainer);
        });
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Always default to light theme, only use saved preference if it exists
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scrolled');
    } else {
        navbar.classList.add('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Typing effect for code window
const codeContent = document.querySelector('.code-content pre code');
if (codeContent) {
    const codeText = `skills() {\n  return ["React", "Node.js", "MongoDB", "Docker", "Python", "C++"];\n}\n\nprojects() {\n  return [\n    "PantryPal — AI-powered recipe app with streamed ChatGPT responses",\n    "Jack Donuts Rewards — Firebase-based loyalty platform"\n  ];\n}\n\nexperience() {\n  return [\n    "Software Engineering Tutor — UC San Diego",\n    "Embedded Systems Researcher — UC San Diego",\n    "Tech Camp Instructor — SCDC"\n  ];\n}`;
    codeContent.innerHTML = '';
    let i = 0;
    
    function typeWriter() {
        if (i < codeText.length) {
            codeContent.innerHTML += codeText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect when the element is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(codeContent);
}

// Project card hover effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelector('.project-overlay').style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
        card.querySelector('.project-overlay').style.opacity = '0.7';
    });
});

// Toggle More Projects
function toggleMoreProjects() {
    const additionalProjects = document.querySelector('.additional-projects');
    const btn = document.querySelector('.more-projects-btn');
    const btnText = btn.querySelector('span');
    const btnIcon = btn.querySelector('i');

    additionalProjects.classList.toggle('show');
    
    if (additionalProjects.classList.contains('show')) {
        btnText.textContent = 'Show Less';
        btnIcon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    } else {
        btnText.textContent = 'View More Projects';
        btnIcon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    }
}

// Initialize video synchronization
const videos = [
    document.getElementById('dfsVideo'),
    document.getElementById('bfsVideo'),
    document.getElementById('ucsVideo'),
    document.getElementById('aStarVideo')
];

let longestDuration = 0;

// Find the longest video duration and set video attributes
videos.forEach(video => {
    // Add muted attribute to allow autoplay
    video.muted = true;
    // Add playsinline for mobile devices
    video.setAttribute('playsinline', '');
    
    video.addEventListener('loadedmetadata', () => {
        if (video.duration > longestDuration) {
            longestDuration = video.duration;
        }
    });
});

function timeUpdateHandler() {
    // Check if all videos have finished
    const allFinished = videos.every(video => video.currentTime >= video.duration - 0.1);
    if (allFinished) {
        // Reset all videos to start
        videos.forEach(async video => {
            video.currentTime = 0;
            try {
                await video.play();
            } catch (error) {
                console.warn('Video autoplay prevented:', error);
            }
        });
    }
}

// Project card functionality
const projectCards = document.querySelectorAll('.project-card');
const body = document.body;

// Create overlay if it doesn't exist
let overlay = document.querySelector('.overlay');
if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    body.appendChild(overlay);
}

projectCards.forEach(card => {
    const closeBtn = card.querySelector('.project-close');
    
    card.addEventListener('click', (e) => {
        // Don't expand if clicking on a link or button
        if (e.target.closest('a') || e.target.closest('.project-btn')) return;
        
        // Close button functionality
        if (e.target.closest('.project-close')) {
            closeExpandedCard();
            return;
        }
        
        // Close any other expanded cards
        closeExpandedCard();

        // Expand card
        card.classList.add('expanded');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';

        // Ensure close button is visible
        if (closeBtn) {
            closeBtn.style.display = 'flex';
        }

        // Initialize viewer if this is the physics card
        if (card === document.querySelector('.project-card:nth-child(2)')) {
            console.log('Initializing 3D viewer...');
            setTimeout(async () => {
                if (viewer) {
                    viewer.cleanup();
                    viewer = null;
                }
                try {
                    viewer = new ModelViewer('modelViewer');
                    // Add error handling for model loading
                    try {
                        await viewer.loadModel('assets/models/tifa_fbx.fbx');
                    } catch (modelError) {
                        console.error('Error loading model:', modelError);
                        // Try with explicit content type
                        const modelResponse = await fetch('assets/models/tifa_fbx.fbx', {
                            headers: {
                                'Accept': 'application/octet-stream'
                            }
                        });
                        const modelBlob = await modelResponse.blob();
                        const modelUrl = URL.createObjectURL(modelBlob);
                        await viewer.loadModel(modelUrl);
                    }
                } catch (error) {
                    console.error('Error initializing viewer:', error);
                    const modelViewer = document.getElementById('modelViewer');
                    if (modelViewer) {
                        modelViewer.innerHTML = '<div style="color: var(--text-color); text-align: center; padding: 20px;">Error loading 3D model. Please try refreshing the page.</div>';
                    }
                }
            }, 100);
        }

        // Handle video synchronization for the pathfinding card
        if (card === document.querySelector('.project-card:nth-child(3)')) {
            videos.forEach(async video => {
                video.currentTime = 0;
                try {
                    await video.play();
                } catch (error) {
                    console.warn('Video autoplay prevented:', error);
                }
                video.addEventListener('timeupdate', timeUpdateHandler);
            });
        }
    });
});

// Close expanded card function
function closeExpandedCard() {
    const expandedCard = document.querySelector('.project-card.expanded');
    if (expandedCard) {
        expandedCard.classList.remove('expanded');
        overlay.classList.remove('active');
        body.style.overflow = '';
        
        const closeBtn = expandedCard.querySelector('.project-close');
        if (closeBtn) {
            closeBtn.style.display = 'none';
        }

        // Cleanup viewer if this was the physics card
        if (expandedCard === document.querySelector('.project-card:nth-child(2)') && viewer) {
            viewer.cleanup();
            viewer = null;
        }

        // Stop and cleanup videos if this was the pathfinding card
        if (expandedCard === document.querySelector('.project-card:nth-child(3)')) {
            videos.forEach(video => {
                video.pause();
                video.currentTime = 0;
                video.removeEventListener('timeupdate', timeUpdateHandler);
            });
        }
    }
}

// Close on overlay click
overlay.addEventListener('click', closeExpandedCard);

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeExpandedCard();
    }
});

// Prevent click events from bubbling up from expanded content
document.querySelectorAll('.project-expanded-content').forEach(content => {
    content.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});


