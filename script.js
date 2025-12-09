// Basic smooth-scroll and active nav highlighting
const navLinks = document.querySelectorAll('.nav-links a');
const sections = Array.from(document.querySelectorAll('section'));

function setActiveLink() {
    const scrollPos = window.scrollY + 120;
    let currentId = 'home';

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            currentId = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
}

function smoothScroll(event) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
        event.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 60,
                behavior: 'smooth'
            });
        }
    }
}

navLinks.forEach(link => link.addEventListener('click', smoothScroll));
window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

// Work/Education tab toggle
const tabs = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.dataset.tab;
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === targetId));
    });
});

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle?.querySelector('i');
if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    themeIcon.className = savedTheme === 'light' ? 'fa-regular fa-moon' : 'fa-regular fa-sun';

    themeToggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', current);
        localStorage.setItem('theme', current);
        themeIcon.className = current === 'light' ? 'fa-regular fa-moon' : 'fa-regular fa-sun';
    });
}
