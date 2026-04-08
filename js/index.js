// Check user authentication and update navigation
document.addEventListener('DOMContentLoaded', function() {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    var userRole = localStorage.getItem('userRole');
    var userName = localStorage.getItem('userName');
    
    if (isLoggedIn === 'true') {
        var authButtons = document.getElementById('authButtons');
        var userMenuLink = document.getElementById('userMenuLink');
        
        if (authButtons) {
            authButtons.classList.add('d-none');
            authButtons.classList.remove('d-flex');
        }
        if (userMenuLink) {
            userMenuLink.classList.remove('d-none');
            userMenuLink.classList.add('nav-link');
        }
        
        // Show/hide Post A Job based on role
        if (userRole === 'client') {
            var navPostJob = document.getElementById('navPostJob');
            var navHome = document.getElementById('navHome');
            if (navPostJob) navPostJob.style.display = 'block';
            if (navHome) navHome.classList.add('active');
        } else {
            var navPostJob = document.getElementById('navPostJob');
            var navHome = document.getElementById('navHome');
            if (navPostJob) navPostJob.style.display = 'none';
            if (navHome) navHome.classList.add('active');
        }
    } else {
        var navPostJob = document.getElementById('navPostJob');
        var navHome = document.getElementById('navHome');
        if (navPostJob) navPostJob.style.display = 'none';
        if (navHome) navHome.classList.add('active');
    }
});

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    window.location.href = 'index.html';
}

function openApplyModal(jobTitle, location, salary) {
    window.location.href = 'category.html';
}

// Counter animation
function animateCounters() {
    var counters = document.querySelectorAll('.stat-number');
    counters.forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-count'));
        var duration = 2000;
        var step = target / (duration / 16);
        var current = 0;
        
        var timer = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + '+';
        }, 16);
    });
}

// Trigger counter animation when statistics section is visible
var statsSection = document.querySelector('.stats-section');
if (statsSection) {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.5});
    observer.observe(statsSection);
}