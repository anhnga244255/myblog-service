/**
 * Created by phuongho on 15/08/17.
 */
export const IS_FORCE = true;

/**
 * Define time-zone default
 */
export const TIME_ZONE = {
    TIME_ZONE_DEFAULT: "Asia/Singapore",
    TIME_ZONE_VN: "Asia/Ho_Chi_Minh",
    TIME_ZONE_UTC: "UTC",
};

export const EXTENDED_HEADER = {
    HEADER_TOTAL: "Total",
    HEADER_OFFSET: "Offset",
    HEADER_LIMIT: "Limit",
};

export const JWT_WEB_TOKEN = {
    DEFAULT_ISSUER: "vivis",
    DEFAULT_CLIENT: "simulator",
    DEFAULT_EXPIRE: 365 * 24 * 60 * 60 * 1000, // 1 year,
    RESET_PASSWORD_TIME_EXPIRED: 60 * 60 * 1000, // 60 minutes
    PIN_TIME_EXPIRED: 5 * 60 * 1000, // 60 minutes
};

export const HEADERS = {
    AUTHORIZATION: "authorization",
    USER_AGENT: "user-agent",
    DEVICE_ID: "device-id",
    REGISTRAR_ID: "registrar-id",
    DEVICE_OS: "device-os",
    DEVICE_NAME: "device-name",
    DEVICE_MODEL: "device-model",
    OS_VERSION: "os-version",
    APP_VERSION: "app-version",
    BUILD_VERSION: "build-version"
};

export const PLATFORM = {
    IOS: "iOS",
    ANDROID: "Android",
    WEB_PORTAL: "web-portal",
    WEB_RESIDENT: "web-resident"
};

export const DELETE_STATUS = {
    YES: true,
    NO: false,
};

export const PASSWORD_LENGTH = 6;

export const PROPERTIES = {
    MOBILE_USER_AGENT: "mobile",
    HEADER_TOTAL: "Total",
    HEADER_OFFSET: "Offset",
    HEADER_LIMIT: "Limit",
    COLUMN_TOTAL_ITEMS: "total"
};

export const ROLE = {
    SYSTEM_ADMIN: "system_admin",
    MANAGER: "manager",
    COMPANY_ADMIN: "company_admin",
    OPERATOR: "operator",
    PRESENTER: "presenter",
    USER: "user"
};

/**
 * TODO: Must be changed in the future.
 * All message will be defined and will be moved to another class in the future.
 */
export const MESSAGE_INFO = {
    MI_TITLE_MESSAGE: "message",
    MI_CREATE_SUCCESSFUL: "create successful.",
    MI_CREATE_UNSUCCESSFUL: "create unsuccessful.",
    MI_UPDATE_SUCCESSFUL: "update successful.",
    MI_UPDATE_UNSUCCESSFUL: "update unsuccessful.",
    MI_DELETE_SUCCESSFUL: "delete successful.",
    MI_DELETE_UNSUCCESSFUL: "delete unsuccessful.",
    MI_IMPORT_SUCCESSFUL: "import successful.",
    MI_EXPORT_SUCCESSFUL: "export successful.",
    MI_UPLOAD_SUCCESSFUL: "upload successful.",
    MI_SENT_SUCCESSFUL: "sent successful.",
    MI_CHANGE_PW_SUCCESSFUL: "change password successful.",
    MI_SEND_PIN_SUCCESSFUL: "send pin successful.",
    MI_SEND_PIN_UN_SUCCESSFUL: "send pin unsuccessful.",
    MI_PHONE_INVALID: "phone number invalid",
    MI_APPLY_PIN_SUCCESSFUL: "apply pin successful.",
    MI_RESET_PIN_SUCCESSFUL: "reset pin successful.",
    MI_SEND_MAIL_CONTACT_US_SUCCESSFUL: "send contact us successful.",
    MI_APPLY_VERIFY_PHONE_CODE_SUCCESSFUL: "verify phone successful.",
    MI_RESET_VERIFY_PHONE_CODE_SUCCESSFUL: "reset verify phone code successful.",
    MI_ASSIGN_USER_SUCCESSFUL: "assign user successful.",
    MI_RESET_PASSWORD_EXPIRED: "your reset token was expired.",
    MI_CHECK_EMAIL_FOR_NEW_PASSWORD: "check your email for new password.",
    MI_CHECK_PHONE_FOR_GET_VERIFY_CODE: "check your phone to get verify code.",
    MI_RESET_PASSWORD_TOKEN_INVALID: "your token is invalid.",
    MI_CREATE_ORDER_SUCCESSFUL: "your order has created successful.",
    MI_RESET_PASSWORD_SUCCESSFUL: "we will send an email to your primary email user_address that you can use to reset your password.",
    MI_SMS_SEND_ACCESS_CODE: "your vivis verification code is:",
    MI_SMS_RESEND_ACCESS_CODE: "your vivis new verification code is:",
    MI_SMS_SEND_VERIFY_PHONE_CODE: "your verify phone code is:",
    MI_SMS_RESEND_VERIFY_PHONE_CODE: "your new verify phone code is:",
    MI_CREATE_PAYMENT_SUCCESSFUL: "your payment has been completed",
    MI_REJECT_SUCCESSFUL: "reject request unit successful.",
    MI_REJECT_UN_SUCCESSFUL: "reject request unit unsuccessful.",
    MI_CANCEL_UNIT_SUCCESSFUL: "cancel unit successful.",
    MI_CANCEL_UNIT_UN_SUCCESSFUL: "cancel unit unsuccessful.",
    MI_BULK: (totalSuccess, totalFail, failIndex?): string => {
        if (failIndex) {
            return `${totalSuccess} success. ${totalFail} fail at line ${failIndex}`;
        }
        return `${totalSuccess} success. ${totalFail} fail`;
    },
    MI_REMARK_HAS_MASTER: (roleId): string => {
        return `Unit has existing master ${roleId}`;
    },
    MI_LIKE_SUCCESSFUL: "like successful.",
    MI_UNLIKE_SUCCESSFUL: "unlike successful.",
};

export const NOTIFICATION_OPTIONS = {
    DEFAULT_TITLE: "Attention",
    DEFAULT_MESSAGE: "You have new message",
    DEFAULT_COLLAPSE_KEY: "default",
    DEFAULT_ICON: "ic_launcher",
    DEFAULT_EXPIRE: 2419200, // 4 weeks
    DEFAULT_SOUND: "default",
    PRIORITY: {
        HIGH: {
            VALUE: "high",
            ANDROID: "high",
            IOS: 10,
        },
        NORMAL: {
            VALUE: "normal",
            ANDROID: "normal",
            IOS: 5,
        },
    }
};

export const DEVICE_OS = {
    iOS: "iOS",
    ANDROID: "Android"
};

/**
 * firebase - online status: channel or online or offline.
 */
export const FIREBASE_ONLINE_STATUS = {
    ONLINE: "online",
    OFFLINE: "offline"
};

export const EMAIL_TEMPLATE = {
    RESET_PASSWORD: "1h_reset_password",
    NEW_PASSWORD: "1k_new_password",
    SEND_CUSTOM_EMAIL: "send_custom_email"
};

export const CURRENCY = {
    SINGAPORE: "sgd"
};

export const MOMENT_DATE_FORMAT = {
    YYYY_MM_DD: "YYYY-MM-DD",
    DD_MMM_YY: "DD MMM YY",
    DD_MMM_YY_H_m: "DD MMM YY HH:mm",
    MM_DD_YYYY: "MM-DD-YYYY",
    DD_MM_YYYY: "DD-MM-YYYY",
    YYYY_MM_DD_H_m: "YYYY-MM-DD HH:mm",
    MM_DD_YYYY_H_m: "MM-DD-YYYY HH:m",
    DD_MM_YYYY_H_m: "DD-MM-YYYY HH:mm",
    DD_MMMM_YYYY_hh_mm_A: "DD MMMM YYYY, hh:mm A",
    HH_MM: "HH:mm",
    HH_MM_A: "hh:mm a",
    SEND_MAIL_FULL_DATE: "dddd, DD MMM YYYY",
    MMM_YY: "MMM YY",
    SEND_MAIL_FULL_DATE_TIME: "hh:mm a, dddd, DD MMM YYYY"
};