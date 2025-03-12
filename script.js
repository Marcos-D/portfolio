// Initialize AOS
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

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
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
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
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
    const text = codeContent.innerHTML;
    codeContent.innerHTML = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            codeContent.innerHTML += text.charAt(i);
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
    const btn = document.querySelector('.more-projects-btn');
    const additionalProjects = document.querySelector('.additional-projects');
    const btnText = btn.querySelector('span');
    
    btn.classList.toggle('active');
    additionalProjects.classList.toggle('show');
    
    if (additionalProjects.classList.contains('show')) {
        btnText.textContent = 'Show Less';
    } else {
        btnText.textContent = 'View More Projects';
    }
}

// Project card expansion
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
        syncVideos();
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

function syncVideos() {
    // Get the videos by their IDs.
    const dfsVideo   = document.getElementById('dfsVideo');
    const bfsVideo   = document.getElementById('bfsVideo');
    const ucsVideo   = document.getElementById('ucsVideo'); // Longest video (7 s)
    const aStarVideo = document.getElementById('aStarVideo');
    
    // If any video is missing, exit the function.
    if (!dfsVideo || !bfsVideo || !ucsVideo || !aStarVideo) return;

    // Put the videos in an array for convenience.
    const videos = [dfsVideo, bfsVideo, ucsVideo, aStarVideo];

    // Disable controls and set up pause listeners on each video.
    videos.forEach(video => {
        video.loop = false;           // Disable native looping.
        video.muted = true;           // Mute to ensure autoplay works.
        video.controls = false;       // Remove the controls so users cannot click pause.
        
        // Listen for the pause event and immediately resume playing.
        video.addEventListener('pause', () => {
            // Only resume if the video is not already at time 0 (i.e. during our intentional reset).
            if (video.currentTime !== 0) {
                video.play();
            }
        });
    });

    // Function to reset and play all videos.
    function playAllVideos() {
        videos.forEach(video => {
            video.currentTime = 0; // Rewind each video.
            video.play();          // Play the video.
        });
    }

    // Define an event listener for when the UCS video (the longest) ends.
    function onUcsEnded() {
        playAllVideos();
    }

    // Remove any existing listener to prevent stacking.
    ucsVideo.removeEventListener('ended', onUcsEnded);
    // Attach the event listener (without { once: true } so it continues looping).
    ucsVideo.addEventListener('ended', onUcsEnded);

    // Start playing all videos at once.
    playAllVideos();
}


