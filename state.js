const generateId = (prefix='ID') => prefix + '_' + Date.now() + Math.random().toString(36).substr(2, 4);

let loadedCart = []; 
try { 
    const sc = localStorage.getItem('jabbarCart'); 
    if (sc) loadedCart = JSON.parse(sc); 
} catch (e) { 
    localStorage.removeItem('jabbarCart'); 
}

const state = {
    currentUser: JSON.parse(localStorage.getItem('jabbarUser')) || null, 
    cart: loadedCart,
    products: {}, orders: {}, customers: {}, admins: {}, offers: {}, settings: {}, banners: {}, brandData: {}, categoryData: {}, moms: {},
    selectedProducts: new Set(), showOffersOnly: false,
    activeCategory: null, activeBrand: null, activeLine: null,
    clientSearchTerm: '', catalogScrollPosition: 0,
    advSearchCat: '', advSearchSubcat: '', advSearchContains: ''
};

const saveLocal = () => { 
    localStorage.setItem('jabbarUser', JSON.stringify(state.currentUser)); 
    localStorage.setItem('jabbarCart', JSON.stringify(state.cart)); 
};

function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container'); 
    const toast = document.createElement('div');
    const icons = { success: 'check-circle', error: 'warning-circle', info: 'info' };
    toast.className = `toast ${type}`; 
    toast.innerHTML = `<i class="ph-fill ph-${icons[type]} text-xl shrink-0"></i><span>${msg}</span>`;
    container.appendChild(toast); 
    setTimeout(() => toast.remove(), 3500);
}
