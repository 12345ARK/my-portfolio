// Standalone portfolio JavaScript interactions
document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && progressBar) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });

    // 2. Smooth active link spy
    const navLinks = document.querySelectorAll('.nav-links a, .nav-item');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
