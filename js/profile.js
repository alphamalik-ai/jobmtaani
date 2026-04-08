var userRole = localStorage.getItem('userRole');
var userName = localStorage.getItem('userName');
var userPhone = localStorage.getItem('userPhone');
var userProfilePic = localStorage.getItem('userProfilePic') || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%231a472a"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
var isLoggedIn = localStorage.getItem('isLoggedIn');

var messages = JSON.parse(localStorage.getItem('chatMessages') || '{}');

document.addEventListener('DOMContentLoaded', function() {
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    var userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = userName || 'User';
    
    var profileImg = document.getElementById('profileImg');
    if (profileImg) profileImg.src = userProfilePic;
    
    if (userRole === 'client') {
        loadEmployerProfile();
    } else {
        loadWorkerProfile();
    }
});

function loadEmployerProfile() {
    var userRoleEl = document.getElementById('userRole');
    if (userRoleEl) userRoleEl.textContent = 'Employer';
    
    var postedJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
    var applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    
    var totalApplicants = 0;
    postedJobs.forEach(function(job) {
        var jobApplicants = applications.filter(function(app) { return app.jobId == job.id; });
        job.applicants = jobApplicants;
        totalApplicants += jobApplicants.length;
    });
    
    var statJobs = document.getElementById('statJobs');
    var statApplicants = document.getElementById('statApplicants');
    var statMessages = document.getElementById('statMessages');
    
    if (statJobs) statJobs.textContent = postedJobs.length;
    if (statApplicants) statApplicants.textContent = totalApplicants;
    if (statMessages) statMessages.textContent = Object.keys(messages).length;
    
    var jobsHtml = '';
    
    if (postedJobs.length === 0) {
        jobsHtml = '<div class="text-center py-5"><h4>No jobs posted yet</h4><a href="post-job.html" class="btn btn-success mt-3">Post a Job</a></div>';
    } else {
        postedJobs.forEach(function(job) {
            var jobApplicants = job.applicants || [];
            var salaryDisplay = 'KSh ' + (job.salaryMin || '0') + ' - ' + (job.salaryMax || '0');
            
            jobsHtml += '<div class="job-card card mb-3 p-3">';
            jobsHtml += '<div class="d-flex justify-content-between align-items-start">';
            jobsHtml += '<div><h5>' + job.title + '</h5>';
            jobsHtml += '<p class="text-muted mb-1"><i class="fa fa-map-marker-alt me-2"></i>' + (job.location || 'Not specified') + '</p>';
            jobsHtml += '<p class="text-success mb-0"><i class="fa fa-money-bill-alt me-2"></i>' + salaryDisplay + '</p></div>';
            jobsHtml += '<div class="text-end"><span class="badge bg-success">' + jobApplicants.length + ' Applicants</span></div></div>';
            jobsHtml += '<hr><h6 class="mb-2">Applicants:</h6>';
            
            if (jobApplicants.length === 0) {
                jobsHtml += '<p class="text-muted">No applicants yet. Share your job to get applications.</p>';
            } else {
                jobApplicants.forEach(function(app) {
                    jobsHtml += '<div class="applicant-card card mb-2 p-2">';
                    jobsHtml += '<div class="d-flex justify-content-between align-items-center">';
                    jobsHtml += '<div><strong>' + app.workerName + '</strong><br><small class="text-muted">' + app.workerPhone + '</small></div>';
                    jobsHtml += '<button class="btn btn-success btn-sm" onclick="openEmployerChat(\'' + app.workerName + '\', ' + job.id + ', \'' + app.workerPhone + '\')"><i class="fa fa-comments me-1"></i>Chat</button>';
                    jobsHtml += '</div></div>';
                });
            }
            jobsHtml += '</div>';
        });
    }
    
    var jobsContainer = document.getElementById('jobsContainer');
    if (jobsContainer) jobsContainer.innerHTML = jobsHtml;
    
    var conversationsList = document.getElementById('conversationsList');
    if (conversationsList) conversationsList.innerHTML = '<div class="text-center text-muted p-3">Chat with applicants from your posted jobs</div>';
}

function loadWorkerProfile() {
    var userRoleEl = document.getElementById('userRole');
    if (userRoleEl) userRoleEl.textContent = 'Worker';
    
    var applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    var myApplications = applications.filter(function(app) { return app.workerName === userName; });
    
    var approved = myApplications.filter(function(app) { return app.status === 'approved'; }).length;
    var pending = myApplications.filter(function(app) { return app.status === 'pending'; }).length;
    
    var statJobs = document.getElementById('statJobs');
    var statApplicants = document.getElementById('statApplicants');
    var statMessages = document.getElementById('statMessages');
    
    if (statJobs) statJobs.textContent = myApplications.length;
    if (statApplicants) statApplicants.textContent = approved + ' Hired';
    if (statMessages) statMessages.textContent = pending + ' Pending';
    
    var jobsHtml = '';
    
    if (myApplications.length === 0) {
        jobsHtml = '<div class="text-center py-5"><h4>No applications yet</h4><a href="category.html" class="btn btn-success mt-3">Browse Jobs</a></div>';
    } else {
        myApplications.forEach(function(app) {
            var statusClass = app.status === 'approved' ? 'status-approved' : (app.status === 'pending' ? 'status-pending' : 'status-rejected');
            var statusIcon = app.status === 'approved' ? 'fa-check-circle' : (app.status === 'pending' ? 'fa-clock' : 'fa-times-circle');
            var statusText = app.status === 'approved' ? 'Approved' : (app.status === 'pending' ? 'Pending' : 'Rejected');
            
            jobsHtml += '<div class="job-card card mb-3 p-3">';
            jobsHtml += '<div class="d-flex justify-content-between align-items-start">';
            jobsHtml += '<div><h5>' + app.jobTitle + '</h5>';
            jobsHtml += '<p class="text-muted mb-1"><i class="fa fa-map-marker-alt me-2"></i>' + app.jobLocation + '</p>';
            jobsHtml += '<p class="text-success mb-0"><i class="fa fa-money-bill-alt me-2"></i>' + app.salary + '</p></div>';
            jobsHtml += '<div class="text-end"><span class="' + statusClass + '"><i class="fa ' + statusIcon + ' me-1"></i>' + statusText + '</span></div></div>';
            jobsHtml += '</div>';
        });
    }
    
    var jobsContainer = document.getElementById('jobsContainer');
    if (jobsContainer) jobsContainer.innerHTML = jobsHtml;
    
    loadWorkerConversations();
}

function loadWorkerConversations() {
    var conversationKeys = Object.keys(messages);
    var convHtml = '';
    
    if (conversationKeys.length === 0) {
        convHtml = '<div class="text-center text-muted p-3">No messages yet. Employers will contact you here.</div>';
    } else {
        conversationKeys.forEach(function(key) {
            var msgs = messages[key];
            if (msgs && msgs.length > 0) {
                var lastMsg = msgs[msgs.length - 1];
                var hasReceived = msgs.some(function(m) { return m.from !== 'me'; });
                
                if (hasReceived || lastMsg.from !== 'me') {
                    var employerName = key.split('_')[0];
                    convHtml += '<div class="p-3 border-bottom" onclick="openWorkerChat(\'' + key + '\')" style="cursor:pointer">';
                    convHtml += '<strong>' + employerName + '</strong>';
                    convHtml += '<br><small class="text-muted">' + lastMsg.text.substring(0, 30) + '...</small>';
                    convHtml += '</div>';
                }
            }
        });
        
        if (!convHtml) {
            convHtml = '<div class="text-center text-muted p-3">No messages yet. Employers will contact you here.</div>';
        }
    }
    
    var conversationsList = document.getElementById('conversationsList');
    if (conversationsList) conversationsList.innerHTML = convHtml;
}

var currentChat = null;
var currentChatKey = null;

function openEmployerChat(workerName, jobId, workerPhone) {
    currentChat = workerName;
    currentChatKey = workerName + '_' + jobId;
    
    if (!messages[currentChatKey]) {
        messages[currentChatKey] = [];
    }
    
    var modalChatWith = document.getElementById('modalChatWith');
    if (modalChatWith) modalChatWith.textContent = 'Chat with ' + workerName;
    
    updateChatDisplay();
    var modal = new bootstrap.Modal(document.getElementById('chatModal'));
    modal.show();
}

function openWorkerChat(key) {
    currentChatKey = key;
    var employerName = key.split('_')[0];
    
    var chatWithName = document.getElementById('chatWithName');
    var messageInput = document.getElementById('messageInput');
    var sendMessageBtn = document.getElementById('sendMessageBtn');
    var chatHint = document.getElementById('chatHint');
    
    if (chatWithName) chatWithName.textContent = 'Chat with ' + employerName;
    if (messageInput) messageInput.disabled = false;
    if (sendMessageBtn) sendMessageBtn.disabled = false;
    if (chatHint) chatHint.textContent = 'You can now reply to messages';
    
    updateWorkerChatDisplay();
}

function updateChatDisplay() {
    var chatMessages = document.getElementById('modalChatMessages');
    var msgs = messages[currentChatKey] || [];
    
    if (msgs.length === 0) {
        chatMessages.innerHTML = '<div class="text-center text-muted p-4">Start a conversation with ' + currentChat + '</div>';
    } else {
        var html = '';
        msgs.forEach(function(msg) {
            html += '<div class="chat-message ' + (msg.from === 'me' ? 'chat-sent' : 'chat-received') + '">';
            html += msg.text;
            html += '<br><small class="' + (msg.from === 'me' ? 'text-white-50' : 'text-muted') + '">' + msg.time + '</small></div>';
        });
        chatMessages.innerHTML = html;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    localStorage.setItem('chatMessages', JSON.stringify(messages));
}

function updateWorkerChatDisplay() {
    var chatMessages = document.getElementById('chatMessages');
    var msgs = messages[currentChatKey] || [];
    var hasReceived = msgs.some(function(m) { return m.from !== 'me'; });
    
    var input = document.getElementById('messageInput');
    var sendBtn = document.getElementById('sendMessageBtn');
    var hint = document.getElementById('chatHint');
    
    if (msgs.length === 0) {
        chatMessages.innerHTML = '<div class="text-center text-muted p-4">Waiting for employer to message you</div>';
        if (input) input.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
        if (hint) hint.textContent = 'Wait for the employer to message you first';
    } else if (hasReceived) {
        chatMessages.innerHTML = '';
        msgs.forEach(function(msg) {
            chatMessages.innerHTML += '<div class="chat-message ' + (msg.from === 'me' ? 'chat-sent' : 'chat-received') + '">';
            chatMessages.innerHTML += msg.text;
            chatMessages.innerHTML += '<br><small class="' + (msg.from === 'me' ? 'text-white-50' : 'text-muted') + '">' + msg.time + '</small></div>';
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (input) input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        if (hint) hint.textContent = 'You can now reply';
    } else {
        chatMessages.innerHTML = '<div class="text-center text-muted p-4">You sent a message. Wait for the employer to reply.</div>';
        if (input) input.disabled = true;
        if (sendBtn) sendBtn.disabled = true;
        if (hint) hint.textContent = 'Wait for the employer to message you first';
    }
}

function sendModalMessage() {
    var input = document.getElementById('modalMessageInput');
    var text = input.value.trim();
    
    if (!text || !currentChatKey) return;
    
    if (!messages[currentChatKey]) messages[currentChatKey] = [];
    
    messages[currentChatKey].push({
        text: text,
        from: 'me',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    
    input.value = '';
    updateChatDisplay();
    
    var statMessages = document.getElementById('statMessages');
    if (statMessages) {
        statMessages.textContent = Object.keys(messages).length;
    }
}

function sendMessage() {
    var input = document.getElementById('messageInput');
    var text = input.value.trim();
    
    if (!text || !currentChatKey) return;
    
    if (!messages[currentChatKey]) messages[currentChatKey] = [];
    
    messages[currentChatKey].push({
        text: text,
        from: 'me',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    
    input.value = '';
    updateWorkerChatDisplay();
}

var modalMessageInput = document.getElementById('modalMessageInput');
if (modalMessageInput) {
    modalMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendModalMessage();
    });
}

var messageInput = document.getElementById('messageInput');
if (messageInput) {
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userProfilePic');
    window.location.href = 'index.html';
}

function uploadProfilePic(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var profileImg = document.getElementById('profileImg');
            if (profileImg) {
                profileImg.src = e.target.result;
                localStorage.setItem('userProfilePic', e.target.result);
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}