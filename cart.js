function addToCart(prodId, offerId = null) {
    const product = state.products[prodId];
    if (!product) return;

    const cartItem = {
        cartId: generateId('CART'),
        productId: prodId,
        offerId: offerId,
        quantity: 1
    };

    state.cart.push(cartItem);
    saveLocal();
    updateCartBadge();
    showToast('تمت الإضافة للسلة', 'success');
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(b => {
        b.innerText = state.cart.length;
        b.classList.toggle('hidden', state.cart.length === 0);
    });
}

function removeFromCart(cartId) {
    state.cart = state.cart.filter(item => item.cartId !== cartId);
    saveLocal();
    renderCart();
    updateCartBadge();
}

function calculateCartTotals() {
    let subtotal = 0;
    state.cart.forEach(item => {
        const p = state.products[item.productId];
        if (p) subtotal += parseFloat(p.price) * item.quantity;
    });
    return { subtotal, total: subtotal }; // يمكن إضافة خصومات هنا لاحقاً
}

async function checkout() {
    if (!state.currentUser) {
        showToast('يرجى تسجيل الدخول أولاً لإتمام الطلب', 'info');
        return navigate('auth-view');
    }
    if (state.cart.length === 0) return showToast('السلة فارغة!', 'error');

    const orderId = generateId('ORD');
    const orderData = {
        id: orderId,
        customerId: state.currentUser.id,
        customerName: state.currentUser.name,
        items: state.cart,
        totals: calculateCartTotals(),
        status: 'pending',
        timestamp: Date.now()
    };

    try {
        await db.ref('orders/' + orderId).set(orderData);
        state.cart = [];
        saveLocal();
        showToast('تم إرسال طلبك بنجاح!', 'success');
        navigate('client-orders-view');
    } catch (e) {
        showToast('عذراً، فشل إرسال الطلب', 'error');
    }
}
