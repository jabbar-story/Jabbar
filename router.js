// js/router.js

/**
 * دالة التنقل الرئيسية
 * @param {string} pageId - معرف الصفحة (مثال: client-catalog أو admin-dashboard)
 */
async function navigate(pageId) {
    const content = document.getElementById('app-content');
    
    // 1. إظهار مؤشر تحميل بسيط أثناء جلب الصفحة
    content.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
            <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-slate-400 font-bold">جاري تحميل الصفحة...</p>
        </div>
    `;

    // 2. تحويل المعرف إلى اسم الملف الصحيح داخل مجلد views
    // مثال: 'client-catalog' يصبح 'catalog'
    // مثال: 'admin-dashboard' يصبح 'admin'
    let fileName = pageId.replace('client-', '').replace('-view', '').replace('-dashboard', '');
    
    // تصحيح لاسم ملف تسجيل الدخول إذا لزم الأمر
    if (fileName === 'auth') fileName = 'auth'; 

    try {
        // 3. جلب محتوى ملف الـ HTML من مجلد views
        const response = await fetch(`views/${fileName}.html`);
        
        if (!response.ok) throw new Error('الصفحة غير موجودة');

        const html = await response.text();

        // 4. حقن الكود داخل الحاوية الرئيسية
        content.innerHTML = html;

        // 5. تحديث حالة الروابط في القائمة (Navbar) ليعرف المستخدم أين هو
        updateActiveLinks(pageId);

        // 6. تشغيل دوال الرندر (Render) الخاصة بكل صفحة بعد تحميلها
        if (pageId === 'client-catalog') {
            if (typeof renderProducts === 'function') renderProducts();
        } else if (pageId === 'admin-dashboard') {
            if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
        }

        // 7. إغلاق القوائم المنسدلة وسحب الصفحة للأعلى
        if (typeof toggleUserDropdown === 'function') {
            document.getElementById('user-dropdown').classList.add('hidden');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        console.error("خطأ في التنقل:", err);
        content.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
                <i class="ph-bold ph-warning-octagon text-5xl text-red-500 mb-4"></i>
                <h2 class="text-xl font-bold text-slate-800">عذراً، تعذر تحميل الصفحة</h2>
                <p class="text-slate-500 mt-2">تأكد من وجود ملف ${fileName}.html داخل مجلد views</p>
                <button onclick="navigate('client-catalog')" class="mt-6 btn-primary px-6 py-2 rounded-xl">العودة للمتجر</button>
            </div>
        `;
    }
}

/**
 * تحديث شكل الروابط النشطة في القائمة
 */
function updateActiveLinks(pageId) {
    document.querySelectorAll('.nav-icon-btn').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-slate-900');
    });
    // يمكنك إضافة منطق هنا لتمييز الزر النشط بناءً على pageId
}
