// Game Master Dashboard Script

// Simple hash function for password
async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Check if user is authenticated
function checkAuth() {
    // Check if auto-logout is enabled
    const autoLogout = localStorage.getItem('gmAutoLogout') === 'true';
    
    if (autoLogout) {
        // With auto-logout, don't persist authentication
        return false;
    }
    
    const isAuthenticated = sessionStorage.getItem('gmAuthenticated');
    return isAuthenticated === 'true';
}

// Login function
async function login() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    const loginError = document.getElementById('loginError');

    if (!password) {
        loginError.textContent = 'Please enter a password.';
        loginError.style.display = 'block';
        return;
    }

    const hashedPassword = await hashPassword(password);
    
    // Check if this is first time setup
    let storedHash = localStorage.getItem('gmPasswordHash');
    
    if (!storedHash) {
        // First time setup - set the password
        if (password.length < 6) {
            loginError.textContent = 'Password must be at least 6 characters long.';
            loginError.style.display = 'block';
            return;
        }
        
        localStorage.setItem('gmPasswordHash', hashedPassword);
        storedHash = hashedPassword;
        alert('✅ Password created successfully!\n\nYour Game Master password has been set. Please remember it for future access to the dashboard.');
    }

    // Verify password
    if (hashedPassword === storedHash) {
        sessionStorage.setItem('gmAuthenticated', 'true');
        showDashboard();
        loadChallengers();
    } else {
        loginError.textContent = 'Incorrect password. Please try again.';
        loginError.style.display = 'block';
        passwordInput.value = '';
    }
}

// Allow Enter key to login
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }

    // Check authentication on page load
    if (checkAuth()) {
        showDashboard();
        loadChallengers();
    } else {
        // Check if this is first-time setup
        checkFirstTimeSetup();
    }
    
    // Load auto-logout setting
    loadAutoLogoutSetting();
});

// Check if this is first-time setup
function checkFirstTimeSetup() {
    const storedHash = localStorage.getItem('gmPasswordHash');
    const setupInfo = document.getElementById('setupInfo');
    const loginTitle = document.getElementById('loginTitle');
    const loginSubtitle = document.getElementById('loginSubtitle');
    const loginButton = document.getElementById('loginButton');
    
    if (!storedHash && setupInfo && loginTitle && loginSubtitle && loginButton) {
        // First time setup
        setupInfo.style.display = 'block';
        loginTitle.textContent = 'Game Master Setup';
        loginSubtitle.textContent = 'Create your master password';
        loginButton.textContent = 'Create Password';
    }
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
    loadAutoLogoutSetting();
}

// Show settings modal
function showSettings() {
    document.getElementById('settingsModal').style.display = 'flex';
    loadAutoLogoutSetting();
}

// Close settings modal
function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

// Load auto-logout setting
function loadAutoLogoutSetting() {
    const autoLogout = localStorage.getItem('gmAutoLogout') === 'true';
    const checkbox = document.getElementById('autoLogoutCheckbox');
    if (checkbox) {
        checkbox.checked = autoLogout;
    }
}

// Toggle auto-logout setting
function toggleAutoLogout() {
    const checkbox = document.getElementById('autoLogoutCheckbox');
    localStorage.setItem('gmAutoLogout', checkbox.checked);
}

// Delete all challenger data
async function deleteAllData() {
    const passwordInput = document.getElementById('deletePassword');
    const password = passwordInput.value;
    
    // Check if password is entered
    if (!password) {
        alert('Please enter your password to confirm deletion.');
        return;
    }
    
    // Verify password
    const hashedPassword = await hashPassword(password);
    const storedHash = localStorage.getItem('gmPasswordHash');
    
    if (hashedPassword !== storedHash) {
        alert('Incorrect password. Deletion cancelled.');
        passwordInput.value = '';
        return;
    }
    
    // Show warning and confirm
    const challengers = JSON.parse(localStorage.getItem('challengers')) || [];
    const count = challengers.length;
    
    const confirmMessage = `⚠️ WARNING: You are about to permanently delete ALL challenger data!\n\nThis will remove ${count} challenger${count !== 1 ? 's' : ''} and cannot be undone.\n\nAre you absolutely sure you want to continue?`;
    
    if (!confirm(confirmMessage)) {
        passwordInput.value = '';
        return;
    }
    
    // Final confirmation
    if (!confirm('This is your last chance. Delete everything?')) {
        passwordInput.value = '';
        return;
    }
    
    // Delete all data
    localStorage.removeItem('challengers');
    passwordInput.value = '';
    
    // Close settings and reload challengers
    closeSettings();
    loadChallengers();
    
    alert('All challenger data has been permanently deleted.');
}

// Logout function
function logout() {
    sessionStorage.removeItem('gmAuthenticated');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('passwordInput').value = '';
    document.getElementById('loginError').style.display = 'none';
}

// Show change password modal
function showChangePassword() {
    document.getElementById('changePasswordModal').style.display = 'flex';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('changePasswordError').style.display = 'none';
}

// Close change password modal
function closeChangePassword() {
    document.getElementById('changePasswordModal').style.display = 'none';
}

// Change password function
async function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('changePasswordError');

    // Validation
    if (!newPassword || !confirmPassword) {
        errorDiv.textContent = 'Please fill in all fields.';
        errorDiv.style.display = 'block';
        return;
    }

    if (newPassword.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters long.';
        errorDiv.style.display = 'block';
        return;
    }

    if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.style.display = 'block';
        return;
    }

    // Hash and save new password
    const hashedPassword = await hashPassword(newPassword);
    localStorage.setItem('gmPasswordHash', hashedPassword);

    // Close modal and show success
    closeChangePassword();
    alert('Password changed successfully!');
}

// Allow Enter key on password change modal
document.addEventListener('DOMContentLoaded', function() {
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                changePassword();
            }
        });
    }
});

// Load and display challengers
function loadChallengers() {
    const challengers = JSON.parse(localStorage.getItem('challengers')) || [];
    const container = document.getElementById('challengersContainer');

    if (challengers.length === 0) {
        container.innerHTML = '<div class="no-challengers">No challengers registered yet.</div>';
        return;
    }

    let html = '<div class="challengers-grid">';
    
    challengers.forEach((challenger, index) => {
        html += `
            <div class="challenger-card">
                <div class="challenger-header">
                    <div class="challenger-info">
                        <span class="info-label">Username</span>
                        <span class="info-value">${escapeHtml(challenger.username)}</span>
                    </div>
                    <div class="challenger-info">
                        <span class="info-label">Name</span>
                        <span class="info-value">${escapeHtml(challenger.firstName)} ${escapeHtml(challenger.lastName)}</span>
                    </div>
                    <div class="challenger-info">
                        <span class="info-label">Email</span>
                        <span class="info-value">${escapeHtml(challenger.email)}</span>
                    </div>
                    <div class="challenger-info">
                        <span class="info-label">Phone</span>
                        <span class="info-value">${escapeHtml(challenger.phone)}</span>
                    </div>
                    <div class="challenger-info">
                        <span class="info-label">Registered</span>
                        <span class="info-value">${formatDate(challenger.registeredAt)}</span>
                    </div>
                </div>
                
                <div class="challenger-actions">
                    <div class="action-group">
                        <label>Score</label>
                        <input type="number" id="score-${challenger.id}" value="${challenger.score || 0}" min="0">
                    </div>
                    <div class="action-group">
                        <label>Attempts</label>
                        <input type="number" id="attempts-${challenger.id}" value="${challenger.attempts || 0}" min="0">
                    </div>
                    <div class="action-group" style="grid-column: 1 / -1;">
                        <label>Extra Information</label>
                        <textarea id="extraInfo-${challenger.id}" placeholder="Add notes about this challenger...">${challenger.extraInfo || ''}</textarea>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="btn btn-save" onclick="updateChallenger(${challenger.id})">💾 Save Changes</button>
                    <button class="btn btn-delete" onclick="deleteChallenger(${challenger.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Update challenger information
function updateChallenger(id) {
    let challengers = JSON.parse(localStorage.getItem('challengers')) || [];
    
    const index = challengers.findIndex(c => c.id === id);
    if (index !== -1) {
        challengers[index].score = parseInt(document.getElementById(`score-${id}`).value) || 0;
        challengers[index].attempts = parseInt(document.getElementById(`attempts-${id}`).value) || 0;
        challengers[index].extraInfo = document.getElementById(`extraInfo-${id}`).value;
        
        localStorage.setItem('challengers', JSON.stringify(challengers));
        
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Saved!';
        btn.style.background = '#4caf50';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }
}

// Delete challenger
function deleteChallenger(id) {
    if (!confirm('Are you sure you want to delete this challenger? This action cannot be undone.')) {
        return;
    }
    
    let challengers = JSON.parse(localStorage.getItem('challengers')) || [];
    challengers = challengers.filter(c => c.id !== id);
    localStorage.setItem('challengers', JSON.stringify(challengers));
    loadChallengers();
}

// Export to CSV
function exportToCSV() {
    const challengers = JSON.parse(localStorage.getItem('challengers')) || [];
    
    if (challengers.length === 0) {
        alert('No challengers to export.');
        return;
    }

    // CSV headers
    let csv = 'Username,First Name,Last Name,Email,Phone,Score,Attempts,Extra Information,Registered At\n';
    
    // Add data rows
    challengers.forEach(challenger => {
        csv += `"${challenger.username}",`;
        csv += `"${challenger.firstName}",`;
        csv += `"${challenger.lastName}",`;
        csv += `"${challenger.email}",`;
        csv += `"${challenger.phone}",`;
        csv += `${challenger.score || 0},`;
        csv += `${challenger.attempts || 0},`;
        csv += `"${(challenger.extraInfo || '').replace(/"/g, '""')}",`;
        csv += `"${formatDate(challenger.registeredAt)}"\n`;
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `challengers_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Format date
function formatDate(isoString) {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
