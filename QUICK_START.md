# 🚀 Quick Start Guide - MongoDB PDF Storage

## ✅ تم إعداد النظام بنجاح!

تم ربط MongoDB بنجاح مع نظام إدارة ملفات PDF. إليك كيفية الاستخدام:

## 🔧 كيفية التشغيل

### 1. تشغيل النظام الكامل (الخادم + العميل)

```bash
npm run dev:full
```

### 2. أو تشغيل كل جزء منفصل

**Terminal 1 - تشغيل خادم MongoDB API:**

```bash
npm run server
```

**Terminal 2 - تشغيل تطبيق React:**

```bash
npm run dev
```

## 📋 الميزات المتاحة

### في Admin Dashboard:

- ✅ رفع ملفات PDF إلى MongoDB
- ✅ عرض قائمة بجميع الملفات
- ✅ حذف الملفات
- ✅ عرض معلومات التخزين
- ✅ دعم الملفات حتى 10MB

### في صفحة Deal Performance:

- ✅ عرض أحدث ملف PDF
- ✅ أدوات التكبير والتصغير
- ✅ تدوير الملف
- ✅ تحميل الملف
- ✅ دعم اللغة العربية والإنجليزية

## 🗄️ قاعدة البيانات

- **MongoDB Atlas**: متصل بنجاح
- **قاعدة البيانات**: `pdfViewer`
- **المجموعة**: `pdfDocuments`
- **تخزين الملفات**: GridFS

## 🌐 API Endpoints

- `http://localhost:3001/api/health` - فحص حالة الخادم
- `http://localhost:3001/api/pdf/upload` - رفع ملف PDF
- `http://localhost:3001/api/pdf/all` - جلب جميع الملفات
- `http://localhost:3001/api/pdf/latest` - جلب أحدث ملف
- `http://localhost:3001/api/pdf/file/:id` - عرض ملف PDF

## 🔍 اختبار النظام

1. **افتح Admin Dashboard**: `http://localhost:5173/admin`
2. **سجل دخول**: استخدم بيانات الإدارة
3. **ارفع ملف PDF**: اختر ملف PDF واضغط "Upload PDF"
4. **انتقل لصفحة الأداء**: `http://localhost:5173/performance`
5. **شاهد الملف**: سيظهر أحدث ملف PDF تم رفعه

## ⚠️ ملاحظات مهمة

- تأكد من تشغيل الخادم قبل استخدام التطبيق
- الملفات محفوظة في MongoDB Atlas
- النظام يدعم الملفات حتى 10MB
- جميع العمليات محمية من الأخطاء

## 🆘 في حالة وجود مشاكل

1. **تأكد من تشغيل الخادم**: `http://localhost:3001/api/health`
2. **تحقق من اتصال MongoDB**: `http://localhost:3001/api/pdf/storage/info`
3. **أعد تشغيل النظام**: أوقف العمليات وأعد التشغيل

## 🎉 النظام جاهز للاستخدام!

يمكنك الآن رفع ملفات PDF من Admin Dashboard ومشاهدتها في صفحة Deal Performance مع تخزين آمن في MongoDB.
