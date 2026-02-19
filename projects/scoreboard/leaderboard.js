// Leaderboard Script

document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
    
    // Refresh leaderboard every 30 seconds
    setInterval(loadLeaderboard, 30000);
});

function loadLeaderboard() {
    const challengers = JSON.parse(localStorage.getItem('challengers')) || [];
    const container = document.getElementById('leaderboardContent');
    
    if (challengers.length === 0) {
        container.innerHTML = '<div class="no-challengers">No scores available yet.</div>';
        return;
    }
    
    // Sort by score (highest first)
    const sortedChallengers = challengers.sort((a, b) => {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return scoreB - scoreA;
    });
    
    let html = '<div class="leaderboard-list">';
    
    sortedChallengers.forEach((challenger, index) => {
        const rank = index + 1;
        const score = challenger.score || 0;
        
        let rankClass = '';
        let rankLabel = '';
        let medal = '';
        
        if (rank === 1) {
            rankClass = 'rank-gold';
            rankLabel = 'Golden Senior';
            medal = '🥇';
        } else if (rank === 2) {
            rankClass = 'rank-silver';
            rankLabel = 'Silver Medior';
            medal = '🥈';
        } else if (rank === 3) {
            rankClass = 'rank-bronze';
            rankLabel = 'Bronze Junior';
            medal = '🥉';
        } else {
            rankClass = 'rank-normal';
            rankLabel = `#${rank}`;
            medal = '';
        }
        
        html += `
            <div class="leaderboard-item ${rankClass}">
                <div class="rank-badge">
                    ${medal ? `<span class="medal">${medal}</span>` : `<span class="rank-number">${rank}</span>`}
                </div>
                <div class="player-info">
                    <div class="player-name">${escapeHtml(challenger.username)}</div>
                    ${rank <= 3 ? `<div class="rank-title">${rankLabel}</div>` : ''}
                </div>
                <div class="player-score">
                    <div class="score-value">${score}</div>
                    <div class="score-label">points</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
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
