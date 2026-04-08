var isLoginMode = false;

function previewProfilePic(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var preview = document.getElementById('profilePreview');
            if (preview) {
                preview.src = e.target.result;
                localStorage.setItem('userProfilePic', e.target.result);
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function selectRole(role) {
    var selectedRole = document.getElementById('selectedRole');
    var workerRole = document.getElementById('workerRole');
    var clientRole = document.getElementById('clientRole');
    var workerFields = document.getElementById('workerFields');
    var clientFields = document.getElementById('clientFields');
    var workerLocationField = document.getElementById('workerLocationField');
    var commonLocationField = document.getElementById('commonLocationField');
    
    if (selectedRole) selectedRole.value = role;
    
    if (workerRole) workerRole.classList.remove('selected');
    if (clientRole) clientRole.classList.remove('selected');
    
    if (role === 'worker') {
        if (workerRole) workerRole.classList.add('selected');
        if (workerFields) workerFields.style.display = 'block';
        if (clientFields) clientFields.style.display = 'none';
        if (workerLocationField) workerLocationField.style.display = 'none';
        if (commonLocationField) commonLocationField.style.display = 'block';
    } else {
        if (clientRole) clientRole.classList.add('selected');
        if (clientFields) clientFields.style.display = 'block';
        if (workerFields) workerFields.style.display = 'none';
        if (workerLocationField) workerLocationField.style.display = 'none';
        if (commonLocationField) commonLocationField.style.display = 'none';
    }
}

function toggleLoginMode() {
    isLoginMode = !isLoginMode;
    var title = document.querySelector('.auth-right h4');
    var subtitle = document.querySelector('.auth-right p');
    var submitBtn = document.querySelector('button[type="submit"]');
    var toggleLink = document.querySelector('.auth-right .text-center p');
    var roleSelection = document.querySelector('.role-selection');
    var workerFields = document.getElementById('workerFields');
    var clientFields = document.getElementById('clientFields');
    var nameLabel = document.querySelector('label.form-label');
    var nameInput = document.querySelector('input[type="text"]');
    var phoneLabel = document.querySelectorAll('label.form-label')[1];
    var emailLabel = document.querySelectorAll('label.form-label')[2];
    var workerLocationField = document.getElementById('workerLocationField');
    var commonLocationField = document.getElementById('commonLocationField');
    
    if (isLoginMode) {
        if (title) title.textContent = 'Login to JOB MTAANI';
        if (subtitle) subtitle.textContent = 'Enter your credentials to login';
        if (submitBtn) submitBtn.textContent = 'Login';
        if (toggleLink) toggleLink.innerHTML = 'Don\'t have an account? <a href="#" class="text-decoration-none" style="color: #1a472a;" onclick="toggleLoginMode(); return false;">Sign Up</a>';
        
        if (roleSelection) roleSelection.style.display = 'none';
        if (workerFields) workerFields.style.display = 'none';
        if (clientFields) clientFields.style.display = 'none';
        if (workerLocationField) workerLocationField.style.display = 'none';
        var profilePicSection = document.getElementById('profilePicSection');
        if (profilePicSection) profilePicSection.style.display = 'none';
        
        if (nameLabel) nameLabel.textContent = 'Email or Phone';
        if (nameInput) nameInput.placeholder = 'Enter your email or phone';
        if (phoneLabel) phoneLabel.style.display = 'none';
        if (emailLabel) emailLabel.textContent = 'Password';
    } else {
        if (title) title.textContent = 'Welcome to JOB MTAANI';
        if (subtitle) subtitle.textContent = 'Select your role to continue';
        if (submitBtn) submitBtn.textContent = 'Sign Up';
        if (toggleLink) toggleLink.innerHTML = 'Already have an account? <a href="#" class="text-decoration-none" style="color: #1a472a;" onclick="toggleLoginMode(); return false;">Login</a>';
        
        if (roleSelection) roleSelection.style.display = 'flex';
        if (workerLocationField) workerLocationField.style.display = 'none';
        if (commonLocationField) commonLocationField.style.display = 'none';
        var profilePicSection = document.getElementById('profilePicSection');
        if (profilePicSection) profilePicSection.style.display = 'block';
        
        if (nameLabel) nameLabel.textContent = 'Full Name';
        if (nameInput) nameInput.placeholder = 'Enter your full name';
        if (phoneLabel) phoneLabel.style.display = 'block';
        if (emailLabel) emailLabel.textContent = 'Email Address';
    }
}

var authForm = document.getElementById('authForm');
if (authForm) {
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var role = document.getElementById('selectedRole').value;
        var name = document.querySelector('input[type="text"]').value;
        var phone = document.querySelector('input[type="tel"]').value;
        
        if (isLoginMode) {
            localStorage.setItem('userRole', localStorage.getItem('userRole') || 'worker');
            localStorage.setItem('userName', name);
            localStorage.setItem('userPhone', phone);
            localStorage.setItem('isLoggedIn', 'true');
            if (!localStorage.getItem('userProfilePic')) {
                localStorage.setItem('userProfilePic', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231a472a"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E');
            }
            window.location.href = 'profile.html';
        } else {
            if (!role) {
                alert('Please select whether you are a Worker or Client');
                return;
            }

            localStorage.setItem('userRole', role);
            localStorage.setItem('userName', name);
            localStorage.setItem('userPhone', phone);
            localStorage.setItem('isLoggedIn', 'true');
            if (!localStorage.getItem('userProfilePic')) {
                localStorage.setItem('userProfilePic', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231a472a"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E');
            }

            window.location.href = 'profile.html';
        }
    });
}

function getLocation() {
    if (navigator.geolocation) {
        var status = document.getElementById('locationStatus');
        if (status) status.textContent = 'Getting location...';
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        var status = document.getElementById('locationStatus');
        if (status) status.textContent = 'Geolocation is not supported by this browser.';
    }
}

function getWorkerLocation() {
    if (navigator.geolocation) {
        var status = document.getElementById('workerLocationStatus');
        if (status) status.textContent = 'Getting location...';
        navigator.geolocation.getCurrentPosition(showWorkerPosition, showError);
    } else {
        var status = document.getElementById('workerLocationStatus');
        if (status) status.textContent = 'Geolocation is not supported by this browser.';
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var userLatitude = document.getElementById('userLatitude');
    var userLongitude = document.getElementById('userLongitude');
    var clientLocation = document.getElementById('clientLocation');
    var locationStatus = document.getElementById('locationStatus');
    
    if (userLatitude) userLatitude.value = lat;
    if (userLongitude) userLongitude.value = lon;
    
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon)
        .then(response => response.json())
        .then(data => {
            var locationName = data.address.city || data.address.town || data.address.county || data.address.state || 'Unknown';
            if (clientLocation) clientLocation.value = locationName.toLowerCase();
            if (clientLocation && clientLocation.value === '') {
                clientLocation.value = 'other';
            }
            if (locationStatus) locationStatus.textContent = 'Location found: ' + locationName;
        })
        .catch(err => {
            if (locationStatus) locationStatus.textContent = 'Location detected! Lat: ' + lat.toFixed(4) + ', Lon: ' + lon.toFixed(4);
        });
}

function showWorkerPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var workerLocation = document.getElementById('workerLocation');
    var workerLocationStatus = document.getElementById('workerLocationStatus');
    
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon)
        .then(response => response.json())
        .then(data => {
            var locationName = data.address.city || data.address.town || data.address.county || data.address.state || 'Unknown';
            if (workerLocation) workerLocation.value = locationName;
            if (workerLocationStatus) workerLocationStatus.textContent = 'Location found: ' + locationName;
        })
        .catch(err => {
            if (workerLocation) workerLocation.value = lat.toFixed(4) + ', ' + lon.toFixed(4);
            if (workerLocationStatus) workerLocationStatus.textContent = 'Location detected!';
        });
}

function showError(error) {
    var locationStatus = document.getElementById('locationStatus');
    var workerLocationStatus = document.getElementById('workerLocationStatus');
    var commonLocationStatus = document.getElementById('commonLocationStatus');
    
    switch(error.code) {
        case error.PERMISSION_DENIED:
            var statusEl = locationStatus || workerLocationStatus || commonLocationStatus;
            if (statusEl) statusEl.textContent = 'Location access denied. Please enable GPS.';
            break;
        case error.POSITION_UNAVAILABLE:
            if (locationStatus) locationStatus.textContent = 'Location information unavailable.';
            break;
        case error.TIMEOUT:
            if (locationStatus) locationStatus.textContent = 'Location request timed out.';
            break;
        default:
            if (locationStatus) locationStatus.textContent = 'An unknown error occurred.';
    }
}

function getCommonLocation() {
    if (navigator.geolocation) {
        var status = document.getElementById('commonLocationStatus');
        if (status) status.textContent = 'Getting location...';
        navigator.geolocation.getCurrentPosition(showCommonPosition, function(error) {
            var commonLocationStatus = document.getElementById('commonLocationStatus');
            if (commonLocationStatus) commonLocationStatus.textContent = 'Location access denied. Please enable GPS.';
        });
    } else {
        var status = document.getElementById('commonLocationStatus');
        if (status) status.textContent = 'Geolocation not supported.';
    }
}

function showCommonPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var userLocation = document.getElementById('userLocation');
    var commonLocationStatus = document.getElementById('commonLocationStatus');
    
    fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon)
        .then(response => response.json())
        .then(data => {
            var locationName = data.address.city || data.address.town || data.address.county || data.address.state || 'Unknown';
            if (userLocation) userLocation.value = locationName;
            if (commonLocationStatus) commonLocationStatus.textContent = 'Location found: ' + locationName;
        })
        .catch(err => {
            if (userLocation) userLocation.value = lat.toFixed(4) + ', ' + lon.toFixed(4);
            if (commonLocationStatus) commonLocationStatus.textContent = 'Location detected!';
        });
}