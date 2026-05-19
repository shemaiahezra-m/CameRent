document.addEventListener('DOMContentLoaded', () => {
    const avatarEl = document.getElementById('avatar');
    const emailEl = document.getElementById('email');
    const emailRow = document.getElementById('emailRow');
    const nameEl = document.getElementById('name');
    const phoneEl = document.getElementById('phone');
    const statusEl = document.getElementById('status');
    const logoutBtn = document.getElementById('logoutBtn');

    const showStatus = (msg, type = 'info') => {
        statusEl.textContent = msg;
        statusEl.style.color = type === 'error' ? '#b91c1c' : '#6b7280';
    };

    const loadProfile = async () => {
        try {
            const res = await fetch('/api/me');
            const body = await res.json();
            if (!res.ok || !body.user) {
                showStatus('Please log in to view your profile.', 'error');
                setTimeout(() => { window.location.href = 'login.html'; }, 800);
                return;
            }
            const u = body.user;
            const initials = (u.firstName?.[0] || '?') + (u.lastName?.[0] || '');
            avatarEl.textContent = initials.toUpperCase();
            emailEl.textContent = u.email;
            emailRow.textContent = u.email;
            nameEl.textContent = `${u.firstName || ''} ${u.lastName || ''}`.trim();
            phoneEl.textContent = u.phone || '—';
            showStatus('Signed in');
        } catch (err) {
            console.error('Profile load error', err);
            showStatus('Cannot reach server. Please try again.', 'error');
        }
    };

    logoutBtn?.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/logout', { method: 'POST' });
            if (!res.ok) throw new Error('Logout failed');
            showStatus('Logged out');
            setTimeout(() => { window.location.href = 'index.html'; }, 500);
        } catch (err) {
            console.error('Logout error', err);
            showStatus('Logout failed. Try again.', 'error');
        }
    });

    loadProfile();
});
