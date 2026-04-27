// --- مستمعات قاعدة البيانات (Firebase Listeners) ---
db.ref('settings').on('value', snap => { 
    state.settings = snap.val() || { name: 'جبار' }; 
    updateStoreInfo(); 
    const fabWa = document.getElementById('fab-wa');
    if(state.settings.whatsapp) {
        fabWa.classList.remove('hidden');
        fabWa.href = `https://wa.me/${state.settings.whatsapp}`;
    } else { fabWa.classList.add('hidden'); }
});

db.ref('products').on('value', snap => { 
    state.products = snap.val() || {}; 
    buildCatalogTree(); 
    if(typeof populateAdminBrandFilter === 'function') populateAdminBrandFilter(); 
    if(typeof renderAdminProducts === 'function') renderAdminProducts(true); 
    renderClientCatalog(true); 
    updateCartRender(); 
    renderDynamicFilters(); 
    if(typeof populateBrandsDropdown === 'function') populateBrandsDropdown(); 

    if (isInitialLoad) {
        isInitialLoad = false;
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        if (productId && state.products[productId]) {
            setTimeout(() => { openProductDetails(productId, true); }, 100);
        }
    }
});

db.ref('offers').on('value', snap => { state.offers = snap.val() || {}; renderClientCatalog(true); updateCartRender(); renderDynamicFilters(); if(typeof renderAdminOffersList === 'function') renderAdminOffersList(); });
db.ref('orders').on('value', snap => { state.orders = snap.val() || {}; if(typeof renderAdminOrders === 'function') renderAdminOrders(); renderClientOrders(); });
db.ref('customers').on('value', snap => { state.customers = snap.val() || {}; if(typeof renderAdminCustomers === 'function') renderAdminCustomers(); });
db.ref('banners').on('value', snap => { state.banners = snap.val() || {}; renderClientBanners(); if(typeof renderAdminBanners === 'function') renderAdminBanners(); });
db.ref('brandData').on('value', snap => { state.brandData = snap.val() || {}; if(typeof renderAdminBrands === 'function') renderAdminBrands(); renderDynamicFilters(); renderNewsTicker(); }); 
db.ref('categoryData').on('value', snap => { state.categoryData = snap.val() || {}; renderDynamicFilters(); if(typeof renderAdminBrands === 'function') renderAdminBrands(); });
db.ref('moms').on('value', snap => { state.moms = snap.val() || {}; if(typeof renderAdminMoms === 'function') renderAdminMoms(); renderClientMoms(); });
db.ref('admins').on('value', snap => { state.admins = snap.val() || {}; if(Object.keys(state.admins).length === 0) db.ref('admins/admin').set({name:'المدير العام', code:'admin', password:'admin'}); if(typeof renderAdminUsers === 'function') renderAdminUsers(); });

// --- التهيئة عند بداية التحميل ---
document.addEventListener('DOMContentLoaded', () => { 
    updateNavUI(); 
    navigate('client-catalog'); 
});
