function toggleAuthMode() {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const title = document.getElementById('auth-title');
    
    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        title.innerText = 'تسجيل الدخول';
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        title.innerText = 'حساب جديد';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const id = document.getElementById('login-id').value.trim();
    const pass = document.getElementById('login-password').value;

    // التحقق من الأدمن أولاً
    const adminKey = Object.keys(state.admins).find(k => state.admins[k].code === id && state.admins[k].password === pass);
    if (adminKey) {
        state.currentUser = { ...state.admins[adminKey], role: 'admin', id: adminKey };
        saveLocal();
        showToast(`مرحباً بك يا سيد ${state.currentUser.name}`, 'success');
        navigate('admin-dashboard');
        return;
    }

    // التحقق من العملاء
    const custKey = Object.keys(state.customers).find(k => k === id && state.customers[k].password === pass);
    if (custKey) {
        state.currentUser = { ...state.customers[custKey], role: 'client', id: custKey };
        saveLocal();
        showToast('تم تسجيل الدخول بنجاح', 'success');
        navigate('client-catalog');
    } else {
        showToast('بيانات الدخول غير صحيحة', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-whatsapp').value.trim();
    const pass = document.getElementById('reg-password').value;
    const addr = document.getElementById('reg-address').value.trim();

    if (state.customers[phone]) return showToast('هذا الرقم مسجل مسبقاً', 'error');

    const newUser = { name, password: pass, address: addr, joinDate: Date.now() };
    db.ref('customers/' + phone).set(newUser).then(() => {
        state.currentUser = { ...newUser, role: 'client', id: phone };
        saveLocal();
        showToast('تم إنشاء الحساب بنجاح', 'success');
        navigate('client-catalog');
    }).catch(() => showToast('فشل التسجيل، حاول مجدداً', 'error'));
}

function logout() {
    state.currentUser = null;
    saveLocal();
    showToast('تم تسجيل الخروج');
    navigate('client-catalog');
}
