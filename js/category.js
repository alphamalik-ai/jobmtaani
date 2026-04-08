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
        
        if (userRole === 'client') {
            var navPostJob = document.getElementById('navPostJob');
            if (navPostJob) navPostJob.style.display = 'block';
        } else {
            var navPostJob = document.getElementById('navPostJob');
            if (navPostJob) navPostJob.style.display = 'none';
        }
    } else {
        var navPostJob = document.getElementById('navPostJob');
        if (navPostJob) navPostJob.style.display = 'none';
    }
});

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    window.location.href = 'index.html';
}

var currentJobTitle = '';
var currentLocation = '';
var currentSalary = '';
var currentJobId = 0;

function openDetailsModal(title, location, type, salary, description, employer, jobId) {
    var detailJobTitle = document.getElementById('detailJobTitle');
    var detailJobLocation = document.getElementById('detailJobLocation');
    var detailJobType = document.getElementById('detailJobType');
    var detailJobSalary = document.getElementById('detailJobSalary');
    var detailJobDescription = document.getElementById('detailJobDescription');
    var detailEmployer = document.getElementById('detailEmployer');
    
    if (detailJobTitle) detailJobTitle.textContent = title;
    if (detailJobLocation) detailJobLocation.textContent = location;
    if (detailJobType) detailJobType.textContent = type;
    if (detailJobSalary) detailJobSalary.textContent = salary;
    if (detailJobDescription) detailJobDescription.textContent = description;
    if (detailEmployer) detailEmployer.textContent = employer;
    
    currentJobTitle = title;
    currentLocation = location;
    currentSalary = salary;
    currentJobId = jobId || 0;
    
    var modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
}

function applyFromDetails() {
    var detailsModal = bootstrap.Modal.getInstance(document.getElementById('detailsModal'));
    detailsModal.hide();
    setTimeout(function() {
        openApplyModal(currentJobTitle, currentLocation, currentSalary, currentJobId);
    }, 300);
}

function openApplyModal(jobTitle, location, salary, jobId) {
    var modalJobTitle = document.getElementById('modalJobTitle');
    var modalJobLocation = document.getElementById('modalJobLocation');
    var modalJobSalary = document.getElementById('modalJobSalary');
    
    if (modalJobTitle) modalJobTitle.textContent = jobTitle;
    if (modalJobLocation) modalJobLocation.textContent = location;
    if (modalJobSalary) modalJobSalary.textContent = salary;
    
    currentJobId = jobId || 0;
    
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        alert('Please login or register to apply for jobs');
        window.location.href = 'login.html';
        return;
    }
    
    var userRole = localStorage.getItem('userRole');
    if (userRole === 'client') {
        alert('Clients cannot apply for jobs. Please switch to a worker account.');
        return;
    }
    
    var userName = localStorage.getItem('userName');
    var userPhone = localStorage.getItem('userPhone');
    var appName = document.getElementById('appName');
    var appPhone = document.getElementById('appPhone');
    
    if (isLoggedIn === 'true') {
        if (appName) appName.value = userName || '';
        if (appPhone) appPhone.value = userPhone || '';
    }
    
    var modal = new bootstrap.Modal(document.getElementById('applyModal'));
    modal.show();
}

function filterJobs() {
    var jobSearch = document.getElementById('jobSearch');
    var jobTypeFilter = document.getElementById('jobTypeFilter');
    var locationFilter = document.getElementById('locationFilter');
    var jobCount = document.getElementById('jobCount');
    
    if (!jobSearch || !jobTypeFilter || !locationFilter || !jobCount) return;
    
    var searchText = jobSearch.value.toLowerCase();
    var jobType = jobTypeFilter.value;
    var location = locationFilter.value;
    var jobs = document.querySelectorAll('.job-item');
    var visibleCount = 0;

    jobs.forEach(function(job) {
        var title = job.querySelector('h5').textContent.toLowerCase();
        var locationText = job.querySelectorAll('span')[0].textContent.toLowerCase();
        var typeText = job.querySelectorAll('span')[1].textContent.toLowerCase();
        
        var show = true;
        if (searchText && !title.includes(searchText)) show = false;
        if (jobType && !typeText.includes(jobType.toLowerCase())) show = false;
        if (location && !locationText.includes(location.toLowerCase())) show = false;
        
        job.style.display = show ? 'block' : 'none';
        if (show) visibleCount++;
    });

    jobCount.textContent = visibleCount;
}

function clearFilters() {
    var jobSearch = document.getElementById('jobSearch');
    var jobTypeFilter = document.getElementById('jobTypeFilter');
    var locationFilter = document.getElementById('locationFilter');
    
    if (jobSearch) jobSearch.value = '';
    if (jobTypeFilter) jobTypeFilter.value = '';
    if (locationFilter) locationFilter.value = '';
    
    filterJobs();
}

var applicationForm = document.getElementById('applicationForm');
if (applicationForm) {
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var isLoggedIn = localStorage.getItem('isLoggedIn');
        var userRole = localStorage.getItem('userRole');
        var userName = localStorage.getItem('userName') || document.getElementById('appName').value;
        var userPhone = localStorage.getItem('userPhone') || document.getElementById('appPhone').value;
        
        if (userRole === 'client') {
            alert('Clients cannot apply for jobs. Please switch to a worker account.');
            return;
        }
        
        var name = document.getElementById('appName').value;
        var phone = document.getElementById('appPhone').value;
        var email = document.getElementById('appEmail').value;
        var experience = document.getElementById('appExperience').value;
        var coverLetter = document.getElementById('appCoverLetter').value;
        var jobTitle = document.getElementById('modalJobTitle').textContent;
        var location = document.getElementById('modalJobLocation').textContent;
        var salary = document.getElementById('modalJobSalary').textContent;
        
        var application = {
            id: Date.now(),
            jobId: currentJobId || Math.floor(Math.random() * 100000),
            jobTitle: jobTitle,
            jobLocation: location,
            salary: salary,
            workerName: name,
            workerPhone: phone,
            workerEmail: email,
            experience: experience,
            coverLetter: coverLetter,
            status: 'pending',
            appliedAt: new Date().toISOString()
        };
        
        var applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
        applications.push(application);
        localStorage.setItem('jobApplications', JSON.stringify(applications));
        
        alert('Application submitted successfully!\n\nJob: ' + jobTitle + '\nName: ' + name + '\nPhone: ' + phone + '\nWe will contact you soon.');
        
        var applyModal = document.getElementById('applyModal');
        var modal = bootstrap.Modal.getInstance(applyModal);
        if (modal) modal.hide();
        document.getElementById('applicationForm').reset();
    });
}