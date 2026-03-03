# بوابة خدمات الغرف — Chambers E-Services Portal

## 🚀 تشغيل المشروع

### المتطلبات
- Node.js 18+
- npm أو yarn

### خطوات التشغيل

```bash
# 1. فك ضغط الملف وادخل المجلد
cd room-services-portal

# 2. تثبيت الحزم
npm install

# 3. تشغيل السيرفر
npm run dev
```

ثم افتح المتصفح على: **http://localhost:5173**

---

## 📁 هيكل المشروع

```
room-services-portal/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              ← نقطة الدخول
    ├── App.jsx               ← التوجيه (React Router)
    ├── styles/
    │   └── global.css        ← كل الستايلات
    ├── api/
    │   └── mockAPI.js        ← Mock API calls
    ├── components/
    │   ├── StarIcon.jsx      ← أيقونة النجمة
    │   ├── Icons.jsx         ← أيقونات SVG متعددة
    │   ├── Spinner.jsx       ← مؤشر التحميل
    │   ├── Toast.jsx         ← رسائل النجاح/الخطأ
    │   ├── ClientCard.jsx    ← كارت العميل
    │   └── ClientModal.jsx   ← نافذة إضافة/تعديل
    └── pages/
        ├── LoginPage.jsx     ← صفحة تسجيل الدخول
        └── DashboardPage.jsx ← صفحة لوحة التحكم
```

---

## 🔐 بيانات الدخول (Mock)

- **اسم المستخدم:** أي نص
- **كلمة المرور:** أي 6 أحرف أو أكثر

---

## ⚡ المميزات

- ✅ React 18 + Vite
- ✅ React Router v6 (Protected Routes)
- ✅ JWT Token مخزن في localStorage
- ✅ Loading spinners
- ✅ Toast notifications
- ✅ نماذج مع Validation
- ✅ Modal للإضافة والتعديل
- ✅ تحميل PDF
- ✅ تصميم RTL عربي كامل
- ✅ Responsive للجوال
