// js/router.js

/**
 * دالة التنقل الذكية - تعالج أخطاء التسمية ومسارات GitHub Pages
 * @param {string} pageId - معرف الصفحة
 */
async function navigate(pageId) {
    const content = document.getElementById('app-content');
    
    // 1. إظهار مؤشر التحميل
    content.innerHTML = `
        <div class="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
            <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-slate-400 font-bold">جاري تحميل الصفحة...</p>
        </div>
    `;

    // 2. تنظيف اسم الملف
    let fileName = pageId.replace('client-', '').replace('-view', '').replace('-dashboard', '').toLowerCase();
    
    // 3. قائمة المسارات المحتملة (الذكاء الاصطناعي هنا)
    // سيقوم الكود بتجربة هذه المسارات بالترتيب حتى يجد الملف الصحيح
    const potentialPaths = [
        `views/${fileName}.html`,         // المسار الطبيعي (catalog.html)
        `views/${fileName}.html.html`,    // معالجة خطأ التكرار (catalog.html.html)
        `./views/${fileName}.html`,       // مسار نسبي إضافي
        `views/${fileName.charAt(0).toUpperCase() + fileName.slice(1)}.html` // تجربة أول حرف كبير (Catalog.html)
    ];

    let success = false;

    for (const path of potentialPaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const html = await response.text();
                content.innerHTML = html;
                success = true;
                console.log(`✅ تم تحميل الصفحة من المسار: ${path}`);
                break; // توقف فور العثور على الملف
            }
        } catch (err) {
            console.warn(`⚠️ فشل المحاولة في المسار: ${path}`);
        }
    }

    // 4. معالجة حالة الفشل النهائي
    if (!success) {
        console.error("❌ فشل تحميل الصفحة من جميع المسارات المحتملة");
        content.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <i class="ph-bold ph-file-search text-4xl"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-800">لم يتم العثور على الصفحة</h2>
                <p class="text-slate-500 mt-2 text-sm">جربنا جميع المسارات الممكنة لملف ${fileName}</p>
                <div class="mt-4 p-3 bg-slate-100 rounded-lg text-[10px] font-mono text-left">
                   Checked: ${potentialPaths.join('<br>')}
                </div>
                <button onclick="location.reload()" class="mt-6 bg-primary text-slate-900 px-6 py-2 rounded-xl font-bold">إعادة تحميل الموقع</button>
            </div>
        `;
        return;
    }

    // 5. تشغيل دوال الـ Render وتحديث الواجهة بعد النجاح
    finalizeNavigation(pageId, fileName);
}

/**
 * وظائف إضافية يتم تشغيلها بعد نجاح التحميل
 */
function finalizeNavigation(pageId, fileName) {
    // تشغيل الرندر حسب الصفحة
    if (fileName === 'catalog' && typeof renderProducts === 'function') renderProducts();
    if (fileName === 'admin' && typeof renderAdminDashboard === 'function') renderAdminDashboard();
    
    // تحديث القائمة العلوية
    if (typeof updateNavUI === 'function') updateNavUI();
    
    // غلق القوائم والطلوع لأعلى الصفحة
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
