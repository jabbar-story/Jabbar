// --- Navigation UI ---
function updateNavUI() {
    const nameEl = document.getElementById('nav-user-name'); 
    const isAdminView = !document.getElementById('admin-dashboard')?.classList.contains('hidden-view');
    if (state.currentUser) {
        nameEl.innerText = state.currentUser.name.split(' ')[0];
        document.getElementById('dd-login')?.classList.add('hidden'); 
        document.getElementById('dd-logout')?.classList.remove('hidden');
        document.getElementById('dd-admin')?.classList.toggle('hidden', state.currentUser.role !== 'admin');
        document.getElementById('dd-orders')?.classList.toggle('hidden', state.currentUser.role !== 'client');
        document.getElementById('nav-orders-btn')?.classList.toggle('hidden', state.currentUser.role !== 'client');
    } else {
        if(nameEl) nameEl.innerText = 'دخول'; 
        document.getElementById('dd-login')?.classList.remove('hidden'); 
        document.getElementById('dd-logout')?.classList.add('hidden');
        document.getElementById('dd-admin')?.classList.add('hidden'); 
        document.getElementById('dd-orders')?.classList.add('hidden'); 
        document.getElementById('nav-orders-btn')?.classList.add('hidden');
    }
    document.getElementById('client-nav-elements')?.classList.toggle('hidden', isAdminView); 
    document.getElementById('admin-nav-elements')?.classList.toggle('hidden', !isAdminView);
    updateCartBadge();
}

function updateStoreInfo() {
    const s = state.settings; 
    const nameDisplay = document.getElementById('store-name-display');
    if(nameDisplay) nameDisplay.innerText = s.name || 'جبار';
    
    const logoCont = document.getElementById('store-logo-container');
    if(logoCont) {
        if(s.logo && s.logo.trim() !== '') { 
            logoCont.innerHTML = `<img src="${s.logo}" class="w-full h-full object-cover bg-white">`; 
            logoCont.classList.remove('bg-gradient-to-br', 'from-primary', 'to-primaryDark'); 
        } else { 
            logoCont.innerHTML = `<i class="ph-fill ph-pill text-xl md:text-3xl text-slate-900" id="default-logo-icon"></i>`; 
            logoCont.classList.add('bg-gradient-to-br', 'from-primary', 'to-primaryDark'); 
        }
    }
}

function toggleUserDropdown() { document.getElementById('user-dropdown').classList.toggle('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

document.addEventListener('click', (e) => { 
    if(!e.target.closest('#user-menu-btn')) {
        const dd = document.getElementById('user-dropdown');
        if(dd) dd.classList.add('hidden');
    }
});

// Floating Action Buttons Scroll Logic
window.addEventListener('scroll', () => {
    const fabTop = document.getElementById('fab-top');
    if(fabTop) {
        if(window.scrollY > 300) { fabTop.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10'); } 
        else { fabTop.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10'); }
    }
});
