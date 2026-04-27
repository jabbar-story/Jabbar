// js/router.js

/**
 * دالة التنقل الرئيسية - تم تعديلها لتعمل مع GitHub Pages والموبيل
 * @param {string} pageId - معرف الصفحة (مثل: client-catalog)
 */
async function navigate(pageId) {
    const content = document.getElementById('app-content');
    
    // 1. إظهار مؤشر تحميل (Loading)
    content.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-slate-400 font-bold">جاري تحميل الصفحة...</p>
        </div>
    `;

    // 2. تحويل المعرف إلى اسم الملف (إزالة البادئات واللواحق)
    // مثال: 'client-catalog-view' يصبح 'catalog'
    let fileName = pageId.replace('client-', '').replace('-view', '').replace('-dashboard', '');
    
    try {
        // 3. التعديل الجوهري: استخدام مسار نسبي بدون "/" في البداية
        // هذا يضمن أن المتصفح يبحث داخل المجلد الحالي للمستودع (Repository)
        const response = await fetch(`views/${fileName}.html`);
        
        if (!response.ok) {
            throw new Error(`تعذر العثور على الملف: views/${fileName}.html (Error ${response.status})`);
        }

        const html = await response.text();

        // 4. حقن المحتوى داخل الصفحة
        content.innerHTML = html;

        // 5. تشغيل دوال العرض (Render) بناءً على الصفحة المحملة
        // تأكد من أن الدوال موجودة في ملفات الـ JS الأخرى
        if (fileName === 'catalog') {
            if (typeof renderProducts === 'function') renderProducts();
        } else if (fileName === 'admin') {
            if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
        }

        // 6. تحديث واجهة التنقل (Navigation UI)
        if (typeof updateNavUI === 'function') updateNavUI();

        // 7. العودة لأعلى الصفحة عند التنقل
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 8. إغلاق القائمة المنسدلة للمستخدم إذا كانت مفتوحة
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) dropdown.classList.add('hidden');

    } catch (err) {
        console.error("خطأ في الـ Routing:", err);
        
        // عرض رسالة خطأ واضحة للمستخدم في حال فشل التحميل
        content.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-pop">
                <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <i class="ph-bold ph-warning-octagon text-4xl"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-800">حدث خطأ في تحميل الصفحة</h2>
                <p class="text-slate-500 mt-2 text-sm max-w-xs mx-auto">
                    تأكد من رفع ملف <span class="font-mono text-red-600 bg-red-50 px-1">views/${fileName}.html</span> على جيت هوب بنفس الاسم الصغير.
                </p>
                <button onclick="navigate('client-catalog')" class="mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 transition-all">
                    العودة للمتجر
                </button>
            </div>
        `;
    }
}
