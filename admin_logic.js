// --- إدارة المنتجات ---
function saveProduct(e) {
    e.preventDefault();
    const id = document.getElementById('prod-id').value || generateId('PRD');
    const data = {
        id: id,
        name: document.getElementById('prod-name').value.trim(),
        price: parseFloat(document.getElementById('prod-price').value),
        category: document.getElementById('prod-cat').value,
        brand: document.getElementById('prod-brand').value,
        desc: document.getElementById('prod-desc').value.trim(),
        images: document.getElementById('prod-imgs').value.split('\n').filter(i => i.trim()),
        active: true
    };

    db.ref('products/' + id).set(data).then(() => {
        showToast('تم حفظ المنتج بنجاح');
        closeModal('product-modal');
    });
}

function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        db.ref('products/' + id).remove();
    }
}

// --- تصدير البيانات ---
function exportProductsToExcel() {
    const data = Object.values(state.products).map(p => ({
        "الاسم": p.name,
        "السعر": p.price,
        "القسم": p.category,
        "البراند": p.brand
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "Jabbar_Products.xlsx");
}

// --- إدارة الطلبات ---
function updateOrderStatus(orderId, newStatus) {
    db.ref(`orders/${orderId}/status`).set(newStatus).then(() => {
        showToast('تم تحديث حالة الطلب');
    });
}
