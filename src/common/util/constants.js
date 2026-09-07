const batteryFullMinimalistic4 = () => import('../../resources/images/medias/batteryFullMinimalistic4Outline.svg');
const batteryFullMinimalistic3 = () => import('../../resources/images/medias/batteryFullMinimalistic3Outline.svg');
const batteryFullMinimalistic2 = () => import('../../resources/images/medias/batteryFullMinimalistic2Outline.svg');
const batteryFullMinimalistic1 = () => import('../../resources/images/medias/batteryFullMinimalistic1Outline.svg');
const batteryFullMinimalistic = () => import('../../resources/images/medias/batteryFullMinimalisticOutline.svg');
const gnssStatusOn = () => import('../../resources/images/medias/gnssStatusOn.svg');
const gnssStatusOnFix = () => import('../../resources/images/medias/gnssStatusOnFix.svg');
const gnssStatusOff = () => import('../../resources/images/medias/gnssStatusOff.svg');
const gnssStatusSleep = () => import('../../resources/images/medias/gnssStatusSleep.svg');
const gsmSignal1 = () => import('../../resources/images/medias/gsmSignal1.svg');
const gsmSignal2 = () => import('../../resources/images/medias/gsmSignal2.svg');
const gsmSignal3 = () => import('../../resources/images/medias/gsmSignal3.svg');
const gsmSignal4 = () => import('../../resources/images/medias/gsmSignal4.svg');
const gsmSignal5 = () => import('../../resources/images/medias/gsmSignal5.svg');
const gsmSignal6 = () => import('../../resources/images/medias/gsmSignal6.svg');

export const preoids = [
  {value: '1', label: 'امروز'},
  {value: '2', label: 'دیروز'},
  {value: '3', label: 'هفته جاری'},
  {value: '4', label: 'هفته قبلی'},
  {value: '5', label: 'ماه جاری'},
  {value: '6', label: 'ماه قبلی'},
  {value: '7', label: 'سفارشی'},
]

export const eventTypes = [
  {
    'value': 'allEvents',
    'label': 'همه رویداد ها',
  },
  {
    'value': 'commandResult',
    'label': 'نتیجه ارسال دستور',
  },
  {
    'value': 'deviceOnline',
    'label': 'وضعیت آنلاین',
  },
  {
    'value': 'deviceUnknown',
    'label': 'وضعیت نامعلوم',
  },
  {
    'value': 'deviceOffline',
    'label': 'وضعیت آفلاین',
  },
  {
    'value': 'deviceInactive',
    'label': 'دستگاه غیرفعال',
  },
  {
    'value': 'queuedCommandSent',
    'label': 'Queued command sent',
  },
  {
    'value': 'deviceMoving',
    'label': 'حرکت دستگاه',
  },
  {
    'value': 'deviceStopped',
    'label': 'دستگاه متوقف شد',
  },
  {
    'value': 'deviceOverspeed',
    'label': 'سرعت از حد مجاز فراتر رفت',
  },
  {
    'value': 'slopeOfArm',
    'label': 'شیب از حد مجاز فراتر رفت',
  },
  {
    'value': 'deviceFuelDrop',
    'label': 'افت سوخت',
  },
  {
    'value': 'deviceFuelIncrease',
    'label': 'افزایش سوخت',
  },
  {
    'value': 'geofenceEnter',
    'label': 'ورود محدوده جغرافیایی',
  },
  {
    'value': 'geofenceExit',
    'label': 'خروج محدوده جغرافیایی',
  },
  {
    'value': 'alarm',
    'label': 'هشدار',
  },
  {
    'value': 'ignitionOn',
    'label': 'سویچ روشن',
  },
  {
    'value': 'ignitionOff',
    'label': 'سوئیچ خاموش',
  },
  {
    'value': 'digitalInput',
    'label': 'digital input',
  },
  {
    'value': 'digitalOutput',
    'label': 'digital output',
  },
  {
    'value': 'maintenance',
    'label': 'نیاز به تعمیر',
  },
  {
    'value': 'textMessage',
    'label': 'پیامک دریافت شد',
  },
  {
    'value': 'driverChanged',
    'label': 'تعویض راننده',
  },
  {
    'value': 'media',
    'label': 'مدیا',
  },
]

export const chartTypes = [
  {
    'label': 'عرض جغرافيايى',
    'value': 'latitude',
  },
  {
    'label': 'طول جغرافيايى',
    'value': 'longitude',
  },
  {
    'label': 'سرعت',
    'value': 'speed',
  },
  {
    'label': 'ارتفاع',
    'value': 'altitude',
  },
  {
    'label': 'HDOP',
    'value': 'hdop',
  },
  {
    'label': 'PDOP',
    'value': 'pdop',
  },
  {
    'label': 'باطری',
    'value': 'battery',
  },
  {
    'label': 'مسافت',
    'value': 'distance',
  },
  {
    'label': 'کل مسافت',
    'value': 'totalDistance',
  },
  {
    'label': 'کارکرد',
    'value': 'ignitions',
  },
  {
    'value': 'priority',
  },
  {
    'value': 'io237',
  },
  {
    'value': 'io53',
  },
  {
    'value': 'io200',
  },
  {
    'value': 'io161',
  },
  {
    'value': 'io252',
  },
  {
    'value': 'io69',
  },
  {
    'value': 'io113',
  },
  {
    'value': 'io9',
  },
]

export const UNPLUG = {
  0: 'فعال',
  1: 'قطع شده',
}

export const NETWORK_TYPE = {
  0: '3G',
  1: '2G',
  2: '4G',
  3: 'LTE CAT M1',
  4: 'LTE CAT NB1',
  99: 'Unknown',
}

export const GNSS_STATUS = {
  0: gnssStatusOff,
  1: gnssStatusOnFix,
  2: gnssStatusOn,
  3: gnssStatusSleep,
}

export const GSM_SIGNAL = {
  0: gsmSignal1,
  1: gsmSignal2,
  2: gsmSignal3,
  3: gsmSignal4,
  4: gsmSignal5,
  5: gsmSignal6,
}

export const BATTERY_MODE = {
  0: batteryFullMinimalistic1,
  1: batteryFullMinimalistic2,
  2: batteryFullMinimalistic3,
  3: batteryFullMinimalistic4,
  4: batteryFullMinimalistic,
}

export const SLEEP_MODE = {
  0: 'نرمال',
  1: 'بلادرنگ',
  2: 'کم مصرف',
}

export const STATUS_DEVICE = {
  'online': 'online',
  'offline': 'offline',
  'unknown': '',
}

export const SD_STATUS = {
  0: 'not present',
  1: 'present',
}

export const TOWING = {
  0: 'steady',
  1: 'towing',
}

export const JAMMING = {
  0: 'stop',
  1: 'start',
}

export const GNSS_SOURSE = {
  0: '',
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  9: '',
  10: '',
  11: '',
  12: '',
  13: '',
  14: '',
  15: '',
}

export const ACTIVE_GSM_OPERATOR = {
  0: 'ناشناخته',
  1: 'همراه اول',
  2: 'ایرانسل',
  3: 'رایتل',
}

export const ACCESSIBILITIES_BY_NAME = {
  "Accessibility-read": {
    id: null,
    name: "Accessibility-read",
    enable: false,
    title: ""
  },
  "Accessibility-persist": {
    id: null,
    name: "Accessibility-persist",
    enable: false,
    title: ""
  },
  "Accessibility-update": {
    id: null,
    name: "Accessibility-update",
    enable: false,
    title: ""
  },
  "Accessibility-delete": {
    id: null,
    name: "Accessibility-delete",
    enable: false,
    title: ""
  },
  "AccessibilityRoleRelation-read": {
    id: null,
    name: "AccessibilityRoleRelation-read",
    enable: false,
    title: ""
  },
  "AccessibilityRoleRelation-persist": {
    id: null,
    name: "AccessibilityRoleRelation-persist",
    enable: false,
    title: ""
  },
  "AccessibilityRoleRelation-update": {
    id: null,
    name: "AccessibilityRoleRelation-update",
    enable: false,
    title: ""
  },
  "AccessibilityRoleRelation-delete": {
    id: null,
    name: "AccessibilityRoleRelation-delete",
    enable: false,
    title: ""
  },
  "AccessLevel-read": {
    id: null,
    name: "AccessLevel-read",
    enable: false,
    title: ""
  },
  "AccessLevel-persist": {
    id: null,
    name: "AccessLevel-persist",
    enable: false,
    title: ""
  },
  "AccessLevel-update": {
    id: null,
    name: "AccessLevel-update",
    enable: false,
    title: ""
  },
  "AccessLevel-delete": {
    id: null,
    name: "AccessLevel-delete",
    enable: false,
    title: ""
  },
  "Attribute-read": {
    id: null,
    name: "Attribute-read",
    enable: false,
    title: ""
  },
  "Attribute-persist": {
    id: null,
    name: "Attribute-persist",
    enable: false,
    title: ""
  },
  "Attribute-update": {
    id: null,
    name: "Attribute-update",
    enable: false,
    title: ""
  },
  "Attribute-delete": {
    id: null,
    name: "Attribute-delete",
    enable: false,
    title: ""
  },
  "Calendar-read": {
    id: null,
    name: "Calendar-read",
    enable: false,
    title: ""
  },
  "Calendar-persist": {
    id: null,
    name: "Calendar-persist",
    enable: false,
    title: ""
  },
  "Calendar-update": {
    id: null,
    name: "Calendar-update",
    enable: false,
    title: ""
  },
  "Calendar-delete": {
    id: null,
    name: "Calendar-delete",
    enable: false,
    title: ""
  },
  "Command-read": {
    id: null,
    name: "Command-read",
    enable: false,
    title: ""
  },
  "Command-persist": {
    id: null,
    name: "Command-persist",
    enable: false,
    title: ""
  },
  "Command-update": {
    id: null,
    name: "Command-update",
    enable: false,
    title: ""
  },
  "Command-delete": {
    id: null,
    name: "Command-delete",
    enable: false,
    title: ""
  },
  "Device-read": {
    id: null,
    name: "Device-read",
    enable: true,
    title: "نمایش دستگاه ها",
    category: "device",
    categoryTitle: "دستگاه ها"
  },
  "Device-persist": {
    id: null,
    name: "Device-persist",
    enable: true,
    title: "ایجاد دستگاه",
    category: "device",
    categoryTitle: "دستگاه ها"
  },
  "Device-update": {
    id: null,
    name: "Device-update",
    enable: true,
    title: "ویرایش دستگاه",
    category: "device",
    categoryTitle: "دستگاه ها"
  },
  "Device-delete": {
    id: null,
    name: "Device-delete",
    enable: true,
    title: "حذف دستگاه",
    category: "device",
    categoryTitle: "دستگاه ها"
  },
  "Driver-read": {
    id: null,
    name: "Driver-read",
    enable: true,
    title: "نمایش راننده ها",
    category: "driver",
    categoryTitle: "راننده ها"
  },
  "Driver-persist": {
    id: null,
    name: "Driver-persist",
    enable: true,
    title: "ایجاد راننده",
    category: "driver",
    categoryTitle: "راننده ها"
  },
  "Driver-update": {
    id: null,
    name: "Driver-update",
    enable: true,
    title: "ویرایش راننده",
    category: "driver",
    categoryTitle: "راننده ها"
  },
  "Driver-delete": {
    id: null,
    name: "Driver-delete",
    enable: true,
    title: "حذف راننده",
    category: "driver",
    categoryTitle: "راننده ها"
  },
  "Event-read": {
    id: null,
    name: "Event-read",
    enable: true,
    title: "نمایش اعلان ها",
    category: "event",
    categoryTitle: "اعلان ها"
  },
  "Event-persist": {
    id: null,
    name: "Event-persist",
    enable: true,
    title: "ایجاد اعلان",
    category: "event",
    categoryTitle: "اعلان ها"
  },
  "Event-update": {
    id: null,
    name: "Event-update",
    enable: true,
    title: "ویرایش اعلان",
    category: "event",
    categoryTitle: "اعلان ها"
  },
  "Event-delete": {
    id: null,
    name: "Event-delete",
    enable: true,
    title: "حذف اعلان",
    category: "event",
    categoryTitle: "اعلان ها"
  },
  "Geofence-read": {
    id: null,
    name: "Geofence-read",
    enable: true,
    title: "نمایش حصارهای جغرافیایی",
    category: "geofence",
    categoryTitle: "حصارهای جغرافیایی"
  },
  "Geofence-persist": {
    id: null,
    name: "Geofence-persist",
    enable: true,
    title: "ایجاد حصار جغرافیایی",
    category: "geofence",
    categoryTitle: "حصارهای جغرافیایی"
  },
  "Geofence-update": {
    id: null,
    name: "Geofence-update",
    enable: true,
    title: "حذف حصار جغرافیایی",
    category: "geofence",
    categoryTitle: "حصارهای جغرافیایی"
  },
  "Geofence-delete": {
    id: null,
    name: "Geofence-delete",
    enable: true,
    title: "ویرایش حصار جغرافیایی",
    category: "geofence",
    categoryTitle: "حصارهای جغرافیایی"
  },
  "Group-read": {
    id: null,
    name: "Group-read",
    enable: false,
    title: ""
  },
  "Group-persist": {
    id: null,
    name: "Group-persist",
    enable: false,
    title: ""
  },
  "Group-update": {
    id: null,
    name: "Group-update",
    enable: false,
    title: ""
  },
  "Group-delete": {
    id: null,
    name: "Group-delete",
    enable: false,
    title: ""
  },
  "Maintenance-read": {
    id: null,
    name: "Maintenance-read",
    enable: true,
    title: "نمایش تعمیر و نگهداری",
    category: "maintenance",
    categoryTitle: "تعمیر و نگهداری"
  },
  "Maintenance-persist": {
    id: null,
    name: "Maintenance-persist",
    enable: true,
    title: "ایجاد تعمیر و نگهداری",
    category: "maintenance",
    categoryTitle: "تعمیر و نگهداری"
  },
  "Maintenance-update": {
    id: null,
    name: "Maintenance-update",
    enable: true,
    title: "ویرایش تعمیر و نگهداری",
    category: "maintenance",
    categoryTitle: "تعمیر و نگهداری"
  },
  "Maintenance-delete": {
    id: null,
    name: "Maintenance-delete",
    enable: true,
    title: "حذف تعمیر و نگهداری",
    category: "maintenance",
    categoryTitle: "تعمیر و نگهداری"
  },
  "Notification-read": {
    id: null,
    name: "Notification-read",
    enable: false,
    title: ""
  },
  "Notification-persist": {
    id: null,
    name: "Notification-persist",
    enable: false,
    title: ""
  },
  "Notification-update": {
    id: null,
    name: "Notification-update",
    enable: false,
    title: ""
  },
  "Notification-delete": {
    id: null,
    name: "Notification-delete",
    enable: false,
    title: ""
  },
  "OpenApi-read": {
    id: null,
    name: "OpenApi-read",
    enable: false,
    title: ""
  },
  "OpenApi-persist": {
    id: null,
    name: "OpenApi-persist",
    enable: false,
    title: ""
  },
  "OpenApi-update": {
    id: null,
    name: "OpenApi-update",
    enable: false,
    title: ""
  },
  "OpenApi-delete": {
    id: null,
    name: "OpenApi-delete",
    enable: false,
    title: ""
  },
  "Order-read": {
    id: null,
    name: "Order-read",
    enable: false,
    title: ""
  },
  "Order-persist": {
    id: null,
    name: "Order-persist",
    enable: false,
    title: ""
  },
  "Order-update": {
    id: null,
    name: "Order-update",
    enable: false,
    title: ""
  },
  "Order-delete": {
    id: null,
    name: "Order-delete",
    enable: false,
    title: ""
  },
  "Password-read": {
    id: null,
    name: "Password-read",
    enable: false,
    title: ""
  },
  "Password-persist": {
    id: null,
    name: "Password-persist",
    enable: false,
    title: ""
  },
  "Password-delete": {
    id: null,
    name: "Password-delete",
    enable: false,
    title: ""
  },
  "Permissions-read": {
    id: null,
    name: "Permissions-read",
    enable: false,
    title: ""
  },
  "Permissions-persist": {
    id: null,
    name: "Permissions-persist",
    enable: false,
    title: ""
  },
  "Permissions-update": {
    id: null,
    name: "Permissions-update",
    enable: false,
    title: ""
  },
  "Permissions-delete": {
    id: null,
    name: "Permissions-delete",
    enable: false,
    title: ""
  },
  "Position-read": {
    id: null,
    name: "Position-read",
    enable: false,
    title: ""
  },
  "Position-persist": {
    id: null,
    name: "Position-persist",
    enable: false,
    title: ""
  },
  "Position-update": {
    id: null,
    name: "Position-update",
    enable: false,
    title: ""
  },
  "Position-delete": {
    id: null,
    name: "Position-delete",
    enable: false,
    title: ""
  },
  "Report-read": {
    id: null,
    name: "Report-read",
    enable: false,
    title: ""
  },
  "Report-persist": {
    id: null,
    name: "Report-persist",
    enable: false,
    title: ""
  },
  "Report-update": {
    id: null,
    name: "Report-update",
    enable: false,
    title: ""
  },
  "Report-delete": {
    id: null,
    name: "Report-delete",
    enable: false,
    title: ""
  },
  "Role-read": {
    id: null,
    name: "Role-read",
    enable: true,
    title: "نمایش نقش ها",
    category: "role",
    categoryTitle: "نقش ها"
  },
  "Role-persist": {
    id: null,
    name: "Role-persist",
    enable: true,
    title: "ایجاد نقش",
    category: "role",
    categoryTitle: "نقش ها"
  },
  "Role-update": {
    id: null,
    name: "Role-update",
    enable: true,
    title: "ویرایش نقش",
    category: "role",
    categoryTitle: "نقش ها"
  },
  "Role-delete": {
    id: null,
    name: "Role-delete",
    enable: true,
    title: "حذف نقش",
    category: "role",
    categoryTitle: "نقش ها"
  },
  "Server-read": {
    id: null,
    name: "Server-read",
    enable: false,
    title: ""
  },
  "Server-persist": {
    id: null,
    name: "Server-persist",
    enable: false,
    title: ""
  },
  "Server-update": {
    id: null,
    name: "Server-update",
    enable: false,
    title: ""
  },
  "Server-delete": {
    id: null,
    name: "Server-delete",
    enable: false,
    title: ""
  },
  "Session-read": {
    id: null,
    name: "Session-read",
    enable: false,
    title: ""
  },
  "Session-persist": {
    id: null,
    name: "Session-persist",
    enable: false,
    title: ""
  },
  "Session-update": {
    id: null,
    name: "Session-update",
    enable: false,
    title: ""
  },
  "Session-delete": {
    id: null,
    name: "Session-delete",
    enable: false,
    title: ""
  },
  "Statistics-read": {
    id: null,
    name: "Statistics-read",
    enable: false,
    title: ""
  },
  "Statistics-persist": {
    id: null,
    name: "Statistics-persist",
    enable: false,
    title: ""
  },
  "Statistics-update": {
    id: null,
    name: "Statistics-update",
    enable: false,
    title: ""
  },
  "Statistics-delete": {
    id: null,
    name: "Statistics-delete",
    enable: false,
    title: ""
  },
  "User-read": {
    id: null,
    name: "User-read",
    enable: true,
    title: "نمایش کاربران",
    category: "user",
    categoryTitle: "کاربران"
  },
  "User-persist": {
    id: null,
    name: "User-persist",
    enable: true,
    title: "ایجاد کاربر",
    category: "user",
    categoryTitle: "کاربران"
  },
  "User-update": {
    id: null,
    name: "User-update",
    enable: true,
    title: "ویرایش  کاربر و تنظیمات اصلی",
    category: "user",
    categoryTitle: "کاربران"
  },
  "User-delete": {
    id: null,
    name: "User-delete",
    enable: true,
    title: "حذف کاربر",
    category: "user",
    categoryTitle: "کاربران"
  },
  "Password-update": {
    id: null,
    name: "Password-update",
    enable: true,
    title: "تغییر رمز کاربر",
    category: "user",
    categoryTitle: "کاربران"
  },
  "getSummary": {
    id: null,
    name: "getSummary",
    enable: false,
    title: "",
    category: "",
    categoryTitle: ""
  },
  "getSummaryExcel": {
    id: null,
    name: "getSummaryExcel",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getTrips": {
    id: null,
    name: "getTrips",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getTripsExcel": {
    id: null,
    name: "getTripsExcel",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getStops": {
    id: null,
    name: "getStops",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getStopsExcel": {
    id: null,
    name: "getStopsExcel",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "lambda$getStopsExcel$7": {
    id: null,
    name: "lambda$getStopsExcel$7",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "lambda$getTripsExcel$6": {
    id: null,
    name: "lambda$getTripsExcel$6",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "lambda$getSummaryExcel$5": {
    id: null,
    name: "lambda$getSummaryExcel$5",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "lambda$getEventsExcel$4": {
    id: null,
    name: "lambda$getEventsExcel$4",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "lambda$getStopTime$3": {
    id: null,
    name: "lambda$getStopTime$3",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "lambda$getStopTime$2": {
    id: null,
    name: "lambda$getStopTime$2",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "lambda$getRouteExcel$1": {
    id: null,
    name: "lambda$getRouteExcel$1",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "lambda$executeReport$0": {
    id: null,
    name: "lambda$executeReport$0",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "executeReport": {
    id: null,
    name: "executeReport",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getCombined": {
    id: null,
    name: "getCombined",
    enable: true,
    title: "گزارش مسیر‌ها",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getRoute": {
    id: null,
    name: "getRoute",
    enable: true,
    title: "گزارش تجمیعی",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getRouteExcel": {
    id: null,
    name: "getRouteExcel",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getIgnitionOn": {
    id: null,
    name: "getIgnitionOn",
    enable: true,
    title: "گزارش توقف‌ها",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getIgnitionDiagram": {
    id: null,
    name: "getIgnitionDiagram",
    enable: true,
    title: "گزارش نمودار",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getStopTime": {
    id: null,
    name: "getStopTime",
    enable: true,
    title: "گزارش بازپخش",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getEvents": {
    id: null,
    name: "getEvents",
    enable: true,
    title: "گزارش اعلان‌ها",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getEventsExcel": {
    id: null,
    name: "getEventsExcel",
    enable: false,
    title: "",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "get": {
    id: null,
    name: "get",
    enable: false,
    title: "گزارش تجمیعی",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getLoginHistory": {
    id: null,
    name: "getLoginHistory",
    enable: false,
    title: "گزارش ورود کاربر",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getHeatCombined": {
    id: null,
    name: "getHeatCombined",
    enable: true,
    title: "گزارش حرارتی",
    category: "report",
    categoryTitle: "گزارش ها"
  },
  "getChartRoute": {
    id: null,
    name: "getChartRoute",
    enable: false,
    title: "",
    category: "",
    categoryTitle: ""
  },
  "Imeis-read": {
    id: null,
    name: "Imeis-read",
    enable: false,
    title: "نمایش شناسه ها",
    category: "imei",
    categoryTitle: "شناسه ها"
  },
  "Imeis-persist": {
    id: null,
    name: "Imeis-persist",
    enable: false,
    title: "ایجاد شناسه",
    category: "imei",
    categoryTitle: "شناسه ها"
  },
  "Imeis-update": {
    id: null,
    name: "Imeis-update",
    enable: false,
    title: "ویرایش شناسه",
    category: "imei",
    categoryTitle: "شناسه ها"
  },
  "Imeis-delete": {
    id: null,
    name: "Imeis-delete",
    enable: false,
    title: "حذف شناسه",
    category: "imei",
    categoryTitle: "شناسه ها"
  },
  "Imei-read": {
    id: null,
    name: "Imei-read",
    enable: true,
    title: "نمایش شناسه ها",
    category: "imei",
    categoryTitle: "شناسه ها"
  },
  "Imei-persist": {
    id: null,
    name: "Imei-persist",
    enable: true,
    title: "ایجاد شناسه",
    category: "imei",
    categoryTitle: "شناسه ها"
  },
  "Imei-update": {
    id: null,
    name: "Imei-update",
    enable: true,
    title: "ویرایش شناسه",
    category: "imei",
    categoryTitle: "شناسه ها"
  },
  "Imei-delete": {
    id: null,
    name: "Imei-delete",
    enable: true,
    title: "حذف شناسه",
    category: "imei",
    categoryTitle: "شناسه ها"
  }
};

export const NETWORK_RESPONSE = {
  'responseSuccessAPI': 'عملیات با موفقیت انجام شد',
  'responseErrorAPI': 'امکان ارائه سرویس وجود ندارد',
  'responseWarningAPI': 'خطا در فراخوانی سرویس',
  'responseConnectAPI': 'اتصال اینترنت برقرار نیست',
  'responseConnectSocket': 'اتصال با سوکت قطع است',
  'responsePreWaitingAPI': 'لطفا صبر کنید',
}
