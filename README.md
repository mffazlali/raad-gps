# راد جی‌پی‌اس — Raad GPS

> سیستم ردیابی و مانیتورینگ GPS مبتنی بر وب، ساخته‌شده روی پلتفرم Traccar

[![Version](https://img.shields.io/badge/version-1.1.56-green)](./CHANGELOG.md)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-purple)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-Private-red)]()

---

## فهرست مطالب

- [معرفی](#معرفی)
- [ویژگی‌های اصلی](#ویژگیهای-اصلی)
- [تکنولوژی‌ها](#تکنولوژیها)
- [ساختار پروژه](#ساختار-پروژه)
- [پیش‌نیازها](#پیشنیازها)
- [نصب و راه‌اندازی](#نصب-و-راهاندازی)
- [متغیرهای محیطی](#متغیرهای-محیطی)
- [اسکریپت‌های موجود](#اسکریپتهای-موجود)
- [معماری نرم‌افزار](#معماری-نرمافزار)
- [ماژول‌ها و صفحات](#ماژولها-و-صفحات)
- [مدیریت State](#مدیریت-state)
- [ارتباط با سرور](#ارتباط-با-سرور)
- [اجرا با Docker](#اجرا-با-docker)
- [CI/CD Pipeline](#cicd-pipeline)
- [تست](#تست)

---

## معرفی

**راد جی‌پی‌اس** یک اپلیکیشن وب پیشرفته برای ردیابی و مدیریت ناوگان است که بر پایه موتور [Traccar](https://www.traccar.org/) طراحی شده. این سیستم امکان مشاهده لحظه‌ای موقعیت دستگاه‌ها روی نقشه، بازپخش مسیر، گزارش‌گیری جامع و مدیریت کامل ناوگان را فراهم می‌کند.

پروژه رابط کاربری ریسپانسیو دارد و هم روی دسکتاپ و هم موبایل قابل استفاده است. همچنین به‌عنوان **PWA (Progressive Web App)** قابل نصب روی دستگاه‌های مختلف می‌باشد.

---

## ویژگی‌های اصلی

### نقشه و ردیابی
- نمایش لحظه‌ای موقعیت دستگاه‌ها روی نقشه تعاملی (MapLibre GL)
- اتصال WebSocket برای به‌روزرسانی real-time موقعیت‌ها
- نمایش مسیر طی‌شده هر دستگاه روی نقشه
- قابلیت دنبال‌کردن (tracking) دستگاه انتخابی
- پشتیبانی از نقشه‌های ماپ‌تایلر (MapTiler)

### گزارش‌ها
- **گزارش ترکیبی (Combined)** — مجموعه اطلاعات کامل از دستگاه
- **گزارش مسیر (Route)** — نمایش مسیر طی‌شده
- **گزارش توقف (Stop)** — آمار ایست‌های دستگاه
- **گزارش رویدادها (Event)** — لیست رویدادهای ثبت‌شده
- **گزارش نمودار (Chart)** — نمودار روشن/خاموش دیاگرام
- **نقشه حرارتی (Heat Map)** — تراکم تردد در مناطق مختلف
- **گزارش سفر (Trip)** — اطلاعات سفرهای انجام‌شده
- **گزارش خلاصه (Summary)** — خلاصه آماری فعالیت دستگاه
- **بازپخش مسیر (Replay)** — شبیه‌سازی حرکت دستگاه روی نقشه

### تنظیمات
- مدیریت دستگاه‌ها (ثبت، ویرایش، دستورات، اتصالات)
- مدیریت شناسه‌ها / IMEI
- جغرافیای مجازی (Geofence) با امکان رسم روی نقشه
- مدیریت رانندگان
- گروه‌بندی دستگاه‌ها
- تعریف نوتیفیکیشن و هشدارها
- تعمیرات و سرویس‌های دوره‌ای
- دستورات از پیش‌تعریف‌شده
- ویژگی‌های محاسباتی (Computed Attributes)
- تقویم‌های سفارشی

### مدیریت کاربران
- ثبت‌نام و مدیریت کاربران
- نقش‌ها و دسترسی‌ها (Role-Based Access Control)
- تاریخچه ورود کاربران
- تغییر رمز عبور

### سایر
- پشتیبانی از زبان فارسی و انگلیسی (i18n)
- تقویم شمسی/میلادی (Jalali / Gregorian)
- PWA — قابل نصب روی دستگاه‌های موبایل و دسکتاپ
- رابط کاربری موبایل و دسکتاپ (Responsive)
- مانیتورینگ خطاها با Sentry

---

## تکنولوژی‌ها

| حوزه | تکنولوژی |
|---|---|
| فریم‌ورک اصلی | React 19 |
| زبان | TypeScript 5 + JavaScript (JSX) |
| ابزار ساخت | Vite 6 |
| مدیریت State | Redux Toolkit 2 |
| کش و سرور State | TanStack React Query 5 |
| نقشه | MapLibre GL, MapTiler SDK, Mapbox GL |
| رسم روی نقشه | Mapbox GL Draw |
| رابط کاربری | Ant Design 5, MUI 5 |
| استایل | Tailwind CSS 3, CSS Modules |
| انیمیشن | Framer Motion, React Spring |
| نمودار | Recharts |
| جداول | AG Grid 33 |
| فرم | React Hook Form, Formik |
| HTTP Client | Axios |
| ارتباط Real-time | WebSocket (Native) |
| تاریخ | Day.js, Moment.js, Jalali Plugin |
| PWA | Vite Plugin PWA + Workbox |
| مانیتورینگ خطا | Sentry 8 |
| تست | Jest 29, Testing Library |
| Linting | ESLint, Prettier |
| کانتینر | Docker |

---

## ساختار پروژه

```
raad-gps/
├── public/                     # فایل‌های استاتیک
│   └── fonts/map/              # فونت‌های نقشه (PBF)
├── src/
│   ├── main.jsx                # نقطه ورود اپلیکیشن
│   ├── App.jsx                 # کامپوننت اصلی (Layout + Controllers)
│   ├── Navigation.jsx          # تعریف مسیرها و Route-based permission
│   ├── ReactQueryProvider.jsx  # پیکربندی React Query
│   ├── common/
│   │   ├── clientStore/        # Redux store (slices)
│   │   ├── serverStore/        # React Query hooks برای API
│   │   ├── components/         # کامپوننت‌های مشترک و UI Kits
│   │   ├── controllers/        # کنترلرهای اصلی (Socket, Cache, PWA, Update)
│   │   ├── layouts/            # لایوت‌ها (main, mobile, auth, tab)
│   │   ├── map/                # ماژول‌های نقشه
│   │   ├── services/           # سرویس‌های HTTP (auth)
│   │   ├── util/               # توابع کمکی، hooks سفارشی
│   │   ├── attributes/         # تعریف attribute های دستگاه
│   │   └── theme/              # تم و استایل‌ها
│   ├── features/
│   │   ├── auth/               # احراز هویت
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── resetPassword/
│   │   │   └── changePassword/
│   │   ├── main/               # صفحه اصلی و نقشه
│   │   │   ├── MainPage.jsx    # صفحه دسکتاپ
│   │   │   ├── MainMap.jsx     # نقشه اصلی
│   │   │   ├── sidebarDevices/ # سایدبار لیست دستگاه‌ها
│   │   │   └── cardDevice/     # کارت اطلاعات دستگاه
│   │   ├── report/             # ماژول گزارش‌گیری
│   │   │   ├── replayPage/     # بازپخش مسیر
│   │   │   ├── routeReportPage/
│   │   │   ├── stopReportPage/
│   │   │   ├── eventReportPage/
│   │   │   ├── chartReportPage/
│   │   │   ├── heatReportPage/
│   │   │   ├── combinedReportPage/
│   │   │   ├── tripReportPage/
│   │   │   └── summaryReportPage/
│   │   ├── settings/           # ماژول تنظیمات
│   │   │   ├── devices/
│   │   │   ├── drivers/
│   │   │   ├── geofences/
│   │   │   ├── groups/
│   │   │   ├── notifications/
│   │   │   ├── maintenances/
│   │   │   ├── identifiers/
│   │   │   ├── commands/
│   │   │   ├── calendars/
│   │   │   ├── computedAttributes/
│   │   │   └── preferences/
│   │   └── users/              # ماژول مدیریت کاربران
│   │       ├── users/
│   │       └── roles/
│   └── resources/
│       ├── l10n/               # فایل‌های ترجمه (fa.json, en.json)
│       └── images/
├── docs/                       # مستندات HTML صفحات
├── Dockerfile
├── docker-compose.yml
├── PROD.CI.Jenkinsfile         # Pipeline سی‌آی/سی‌دی
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## پیش‌نیازها

- **Node.js** نسخه 18 یا بالاتر
- **npm** نسخه 9 یا بالاتر
- یک سرور **Traccar** (بک‌اند) در دسترس

---

## نصب و راه‌اندازی

### ۱. دریافت کد

```bash
git clone http://gitlab.pnr.ir/raad/frontend/raad_frontend.git
cd raad_frontend
```

### ۲. نصب وابستگی‌ها

```bash
npm install --legacy-peer-deps
```

### ۳. تنظیم متغیرهای محیطی

```bash
cp .env.sample .env
```

فایل `.env` را ویرایش کنید و مقادیر لازم را وارد کنید (به بخش [متغیرهای محیطی](#متغیرهای-محیطی) مراجعه کنید).

### ۴. اجرا در حالت توسعه

```bash
npm run dev
```

اپلیکیشن روی آدرس `http://localhost:3100` در دسترس خواهد بود.

---

## متغیرهای محیطی

فایل `.env.sample` را به `.env` کپی کنید و مقادیر زیر را تنظیم کنید:

```env
# آدرس بک‌اند (بدون پروتکل)
VITE_APP_API_URL=your-server-address:port

# پروتکل ارتباطی: http یا https
VITE_APP_API_PROTOCOL=https

# احراز هویت با token (true) یا cookie (false)
VITE_APP_API_IS_TOKEN=true

# نسخه برنامه
VITE_APP_VERSION=1.1.56

# نمایش نسخه از فایل package.json: true/false
VITE_APP_IS_VERSION=false

# فعال‌سازی APN Map
VITE_APP_APN_ENABLE=false
VITE_APP_APN_MAP_URL=

# فعال‌سازی PWA در حالت development
VITE_ENABLE_PWA_DEVELOPMENT=false

# تنظیمات Sentry (مانیتورینگ خطا)
VITE_APP_SENTRY_ENABLE=false
VITE_APP_SENTRY_ACCEPT_DEVELOPMENT=false
VITE_APP_SENTRY_DSN=""
VITE_APP_SENTRY_TARGETS="['localhost']"

# React Query Devtools
VITE_REACT_QUERY_DEVTOOLS_ACTIVE=false
```

---

## اسکریپت‌های موجود

| دستور | توضیح |
|---|---|
| `npm run dev` | اجرای سرور توسعه روی پورت ۳۱۰۰ |
| `npm run build` | ساخت نسخه production در پوشه `build/` |
| `npm run preview` | پیش‌نمایش build نهایی روی پورت ۳۲۰۰ |
| `npm run lint` | بررسی کد با ESLint |
| `npm run test` | اجرای تست‌ها با Jest |
| `npm run prettier-write` | فرمت کردن کد |
| `npm run release` | ایجاد نسخه جدید (standard-version) |
| `npm run release-as-patch` | انتشار نسخه patch |
| `npm run release-as-minor` | انتشار نسخه minor |
| `npm run release-as-major` | انتشار نسخه major |
| `npm run docker-build` | ساخت image داکر |
| `npm run docker-run` | اجرای کانتینر داکر |

---

## معماری نرم‌افزار

### جریان کلی اپلیکیشن

```
main.jsx
  └── Navigation.jsx (Router + Auth guard + Permission routing)
        └── App.jsx (Controllers + Layout selector)
              ├── SocketController  ─── WebSocket (real-time)
              ├── CachingController ─── مدیریت کش
              ├── PWAController     ─── مدیریت PWA
              ├── UpdateController  ─── به‌روزرسانی
              ├── MainLayout        ─── دسکتاپ
              └── MobileLayout      ─── موبایل
```

### سیستم احراز هویت

اپلیکیشن از دو روش احراز هویت پشتیبانی می‌کند:

- **JWT Token** (پیش‌فرض): توکن در `localStorage` ذخیره شده و در هر درخواست به عنوان `Authorization: Bearer <token>` ارسال می‌شود.
- **Session Cookie**: با غیرفعال کردن `VITE_APP_API_IS_TOKEN`

### مسیریابی مبتنی بر دسترسی

کاربران بر اساس نقش و مجوزهایشان به بخش‌های مختلف دسترسی دارند. مجوزها از API دریافت و در Redux store ذخیره می‌شوند. هر route بر اساس permission متناظر خود رندر می‌شود.

نمونه مجوزها:
- `Device-read` / `Device-persist` / `Device-update`
- `User-read` / `User-persist` / `User-update`
- `Role-read` / `Role-persist` / `Role-update`
- `Geofence-read` / `Geofence-persist`
- `Driver-read` / `Driver-persist`
- `getRoute` / `getEvents` / `getCombined` / `getIgnitionDiagram`

---

## ماژول‌ها و صفحات

### صفحه اصلی (`/`)
نقشه تعاملی با موقعیت لحظه‌ای دستگاه‌ها. سایدبار سمت راست لیست دستگاه‌ها را با وضعیت (آنلاین/آفلاین/در حرکت) نمایش می‌دهد. با کلیک روی هر دستگاه، جزئیات موقعیت، سرعت و وضعیت نمایش داده می‌شود.

### بازپخش مسیر (`/replay`)
شبیه‌سازی حرکت دستگاه روی نقشه در یک بازه زمانی مشخص. قابل دسترس هم از صفحه اصلی و هم از ماژول گزارشات.

### گزارشات (`/report`)
| مسیر | توضیح |
|---|---|
| `/report/combined` | گزارش ترکیبی |
| `/report/route` | مسیر طی‌شده |
| `/report/stop` | توقف‌ها |
| `/report/event` | رویدادها |
| `/report/chart` | نمودار روشن/خاموش |
| `/report/heat` | نقشه حرارتی |
| `/report/trip` | سفرها |
| `/report/replay` | بازپخش از گزارشات |

### تنظیمات (`/settings`)
| مسیر | توضیح |
|---|---|
| `/settings/devices` | مدیریت دستگاه‌ها |
| `/settings/identifiers` | مدیریت IMEI |
| `/settings/drivers` | مدیریت رانندگان |
| `/settings/geofences` | جغرافیای مجازی |
| `/settings/groups` | گروه‌بندی دستگاه‌ها |
| `/settings/notifications` | هشدارها و نوتیفیکیشن |
| `/settings/maintenances` | تعمیرات دوره‌ای |
| `/settings/commands` | دستورات |
| `/settings/attributes` | ویژگی‌های محاسباتی |
| `/settings/calendars` | تقویم‌ها |
| `/settings/preferences` | تنظیمات شخصی |

### مدیریت کاربران (`/users`)
| مسیر | توضیح |
|---|---|
| `/users/users` | لیست و مدیریت کاربران |
| `/users/roles` | نقش‌ها و دسترسی‌ها |

---

## مدیریت State

### Redux Store

پروژه از **Redux Toolkit** برای مدیریت state سمت کلاینت استفاده می‌کند:

| Slice | محتوا |
|---|---|
| `session` | اطلاعات کاربر جاری، موقعیت‌ها، مجوزها، WebSocket state |
| `devices` | لیست دستگاه‌ها، دستگاه انتخابی |
| `events` | رویدادهای دریافتی |
| `notifications` | نوتیفیکیشن‌ها |
| `geofences` | جغرافیای مجازی |
| `groups` | گروه‌ها |
| `drivers` | رانندگان |
| `reports` | داده‌های گزارشات |
| `users` | کاربران |
| `roles` | نقش‌ها |
| `layout` | وضعیت UI |
| `errors` | مدیریت خطاها |

### React Query (Server State)

برای داده‌هایی که از API دریافت می‌شوند از **TanStack React Query** استفاده شده. هر entity یک hook اختصاصی دارد:

```
serverStore/
  useDevice.ts       — GET/POST/PUT/DELETE /api/devices
  useDriver.ts       — GET/POST/PUT/DELETE /api/drivers
  useGeofence.ts     — GET/POST/PUT/DELETE /api/geofences
  useGroup.ts        — GET/POST/PUT/DELETE /api/groups
  useNotification.ts — GET/POST/PUT/DELETE /api/notifications
  useMaintenance.ts  — GET/POST/PUT/DELETE /api/maintenances
  useRole.ts         — GET/POST/PUT/DELETE /api/roles
  useUsers.ts        — GET/POST/PUT/DELETE /api/users
  useCommand.ts      — دستورات
  useCalendar.ts     — تقویم‌ها
  useIdentifier.ts   — IMEI/شناسه‌ها
  usePreference.ts   — تنظیمات کاربر
  usePosition.ts     — موقعیت‌ها
```

---

## ارتباط با سرور

### HTTP (Axios)

یک نمونه سراسری از Axios با interceptorهای زیر پیکربندی شده:

**Request Interceptor:**
- افزودن خودکار `Authorization: Bearer <token>` از `localStorage`

**Response Interceptor:**
- هدایت به `/login` در صورت دریافت خطای `401 Unauthorized`
- هدایت به `/login` پس از logout موفق (`DELETE /api/session`)

### WebSocket

اتصال WebSocket برای دریافت real-time موقعیت دستگاه‌ها و رویدادها:

```
ws(s)://[host]/api/socket
```

پیام‌های دریافتی:
- `positions` — به‌روزرسانی موقعیت دستگاه‌ها → Redux
- `devices` — به‌روزرسانی وضعیت دستگاه‌ها → Redux
- `events` — رویدادهای جدید → نوتیفیکیشن + Redux
- `timestamp` — زمان سرور → Redux

در صورت قطع اتصال، به‌صورت خودکار reconnect می‌شود.

### Proxy در محیط توسعه

در `vite.config.ts` تمام درخواست‌های `/api` به سرور بک‌اند پروکسی می‌شوند:

```typescript
proxy: {
  '/api': `${apiProtocol}://${apiBaseUrl}`,
  '/api/socket': `${socketProtocol}://${apiBaseUrl}`,
}
```

---

## اجرا با Docker

### ساخت image

```bash
docker build -t raad_frontend .
```

### اجرای مستقیم

```bash
docker run -e APP_API_URL=your-server:8082 -p 3200:3200 raad_frontend
```

### اجرا با Docker Compose

```bash
docker-compose up -d
```

> نکته: فایل `.env-dev` باید پیش از اجرا تنظیم شده باشد.

**پورت‌ها:**
- `3100` — سرور توسعه (dev)
- `3200` — سرور preview (production build)

### Dockerfile خلاصه

```
Base Image : node:18-alpine
Build      : npm install --force && npm run build
Run        : npm run preview (port 3200)
```

---

## CI/CD Pipeline

پروژه از **Jenkins** برای اتوماسیون استقرار استفاده می‌کند. Pipeline شامل مراحل زیر است:

```
1. Clean Workspace
2. Checkout از GitLab (branch: dev)
3. Scan کد با SonarQube
4. Quality Gate (حداکثر ۱ دقیقه انتظار)
5. Build Docker Image
6. Scan Image با Trivy (بررسی آسیب‌پذیری HIGH/CRITICAL)
7. Push به Nexus Registry
```

ابزارها:
- **GitLab** — مخزن کد
- **SonarQube** — تحلیل کیفیت کد
- **Trivy** — اسکن آسیب‌پذیری image
- **Nexus** — Private Docker Registry

---

## تست

پروژه از **Jest** و **Testing Library** استفاده می‌کند.

```bash
# اجرای تمام تست‌ها
npm run test
```

فایل‌های تست در پوشه `src/tests/` قرار دارند. پیکربندی Jest در فایل `jest.config.ts` موجود است.

---

## چند نکته برای توسعه‌دهندگان

- **Lazy Loading**: تمام صفحات به‌صورت lazy load شده‌اند تا bundle اولیه سبک باشد.
- **مجوزها**: قبل از اضافه‌کردن route جدید، permission متناظر را در `Navigation.jsx` و `getIndexRouter*` توابع تعریف کنید.
- **زبان**: ترجمه‌ها در `src/resources/l10n/fa.json` و `en.json` قرار دارند.
- **نقشه**: ماژول‌های نقشه در `src/common/map/` هستند و هر یک وظیفه مشخصی دارند (markers، geofence، route، replay).
- **Redux DevTools**: در محیط development فعال است.
- **React Query DevTools**: با `VITE_REACT_QUERY_DEVTOOLS_ACTIVE=true` در `.env` فعال می‌شود.

---

## تغییرات

برای مشاهده تاریخچه تغییرات به فایل [CHANGELOG.md](./CHANGELOG.md) مراجعه کنید.

---

<div dir="rtl">

**پروژه داخلی — شرکت پی‌ان‌آر (PNR)**

</div>
