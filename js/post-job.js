function selectJobType(type) {
    var selectedJobType = document.getElementById('selectedJobType');
    
    document.querySelectorAll('.job-type-card').forEach(function(card) {
        card.classList.remove('selected');
    });
    
    if (selectedJobType) selectedJobType.value = type;
    
    var typeElement = document.getElementById(type);
    if (typeElement) typeElement.classList.add('selected');
}

var postJobForm = document.getElementById('postJobForm');
if (postJobForm) {
    postJobForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var jobType = document.getElementById('selectedJobType').value;
        if (!jobType) {
            alert('Please select the type of worker you need');
            return;
        }
        
        var form = e.target;
        var textInputs = form.querySelectorAll('input[type="text"]');
        var textAreas = form.querySelectorAll('textarea');
        var selects = form.querySelectorAll('select');
        var numberInputs = form.querySelectorAll('input[type="number"]');
        var dateInput = form.querySelector('input[type="date"]');
        var telInput = form.querySelector('input[type="tel"]');
        var emailInput = form.querySelector('input[type="email"]');
        
        var jobData = {
            id: Date.now(),
            type: jobType,
            title: textInputs[0].value,
            description: textAreas[0].value,
            location: selects[0].value,
            employmentType: selects[1].value,
            salaryMin: numberInputs[0].value,
            salaryMax: numberInputs[1].value,
            startDate: dateInput ? dateInput.value : '',
            experience: selects[2].value,
            gender: selects[3].value,
            otherRequirements: textAreas[1].value,
            contactName: textInputs[1] ? textInputs[1].value : '',
            contactPhone: telInput ? telInput.value : '',
            contactEmail: emailInput ? emailInput.value : '',
            createdAt: new Date().toISOString(),
            applicants: []
        };
        
        var jobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
        jobs.push(jobData);
        localStorage.setItem('postedJobs', JSON.stringify(jobs));
        
        alert('Job posted successfully! Workers will be able to view your job.');
        window.location.href = 'profile.html';
    });
}

// Check user authentication and update navigation
document.addEventListener('DOMContentLoaded', function() {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    var userRole = localStorage.getItem('userRole');
    var userName = localStorage.getItem('userName');
    var userPhone = localStorage.getItem('userPhone');
    
    var authButtons = document.getElementById('authButtons');
    var userMenuLink = document.getElementById('userMenuLink');
    var navPostJob = document.getElementById('navPostJob');
    
    if (isLoggedIn === 'true') {
        if (authButtons) {
            authButtons.classList.add('d-none');
            authButtons.classList.remove('d-flex');
        }
        if (userMenuLink) {
            userMenuLink.classList.remove('d-none');
            userMenuLink.classList.add('nav-link');
        }
        if (navPostJob) navPostJob.classList.add('active');
        
        // Populate contact fields with user data
        var textInputs = document.querySelectorAll('input[type="text"]');
        var telInput = document.querySelector('input[type="tel"]');
        var emailInput = document.querySelector('input[type="email"]');
        if (textInputs[1]) textInputs[1].value = userName || '';
        if (telInput) telInput.value = userPhone || '';
        
        // Only clients can access post job page
        if (userRole !== 'client') {
            window.location.href = 'index.html';
        }
    } else {
        window.location.href = 'login.html';
    }
});

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    window.location.href = 'index.html';
}