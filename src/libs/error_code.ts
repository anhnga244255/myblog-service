/**
 * Created by phuongho on 15/08/17.
 */
class Code {
    public readonly CODE;
    public readonly MESSAGE;

    constructor(code, message) {
        this.CODE = code;
        this.MESSAGE = message;
    }
}

export const ErrorCode = {
    UNKNOWN: {
        TYPE: "Unknown.",
        GENERIC: new Code(0, "Intern al Server Error."),
        NOT_IMPLEMENT: new Code(1, "Not Implement ExceptionModel"),
        UPGRADE_NEEDED: new Code(2, "Please update new version"),
        MAINTENANCE_PERIOD: new Code(3, "Maintenance period"),
        APOCALYPSE: new Code(13, "The world is end"),
    },
    RESOURCE: {
        TYPE: "Resource.",
        GENERIC: new Code(1000, "unknown Resource's Error."),
        INVALID_URL: new Code(1001, "invalid url."),
        NOT_FOUND: new Code(1002, "the item has been deleted"),
        DUPLICATE_RESOURCE: new Code(1003, "resource was already existed."),
        INVALID_REQUEST: new Code(1004, "invalid request."),
        EMPTY_EMAIL: new Code(1005, "email can't be empty."),
        INVALID_EMAIL_FORMAT: new Code(1006, "invalid email format."),
        INVALID_PASSWORD: new Code(1007, "password must be at least 6 characters."),
        EMAIL_IS_USED: new Code(1008, "email was used."),
        MISSING_REQUIRED_FIELDS: new Code(1010, "missing required fields."),
        INVALID_PARAMETER: new Code(1011, "invalid parameter."),
        PASSWORD_USE_BEFORE: new Code(1012, "you can't use a password you have used before."),
        INVALID_PHONE_NUMBER: new Code(1013, "the phone number format is incorrect"),
        INVALID_DATE_TYPE: new Code(1066, "invalid date type"),
        INVALID_COUNTRY_CODE: new Code(1067, "invalid code"),
        MAXIMUM_CREATE_PRENSENTAION: new Code(1068, "you've reached the maximum number of presentations associated with this your account."),
        MAXIMUM_CREATE_USER: new Code(1069, "you've reached the maximum number of users associated with this your account."),
        USER_CODE_NOT_FOUND: new Code(1070, "the code doest not exist."),
        CONTRACT_NOT_FOUND: new Code(1071, "the contract doest not exist."),
        INVALID_FILE_UPLOAD: new Code(1072, "invalid file upload."),
    },
    AUTHENTICATION: {
        TYPE: "Authentication.",
        GENERIC: new Code(1100, "unknown authentication's error."),
        VIOLATE_RFC6750: new Code(1101, "RFC6750 states the access_token MUST NOT be provided in more than one place in a single request."),
        TOKEN_NOT_FOUND: new Code(1102, "token not found."),
        INVALID_AUTHORIZATION_HEADER: new Code(1103, "invalid authorization header."),
        ACCOUNT_NOT_FOUND: new Code(1104, "account not found."),
        WRONG_USER_NAME_OR_PASSWORD: new Code(1105, "wrong user name or password."),
        WRONG_PASSWORD: new Code(1105, "you have entered the wrong password."),
        INVALID_TOKEN: new Code(1106, "invalid token."),
        TOKEN_EXPIRE: new Code(1107, "token expired."),
        NEED_ACCESS_CODE: new Code(1108, "access code is needed."),
        INVALID_CODE: new Code(1109, "invalid access code."),
        ALREADY_ACTIVE: new Code(1110, "account has already activated."),
        NEED_ACTIVE: new Code(1112, "account has not activated."),
        ALREADY_VERIFY_PHONE: new Code(1113, "your phone code already verified. Pls resend new pin code"),
        INVALID_VERIFY_PHONE_CODE: new Code(1114, "the verification code entered is invalid"),
        VERIFY_PHONE_CODE_EXPIRE: new Code(1115, "verify phone code expired."),
        LIMIT_QUOTA: new Code(1116, "you have reached the maximum number of verification limit"),
    },
    PRIVILEGE: {
        TYPE: "Privilege",
        GENERIC: new Code(1200, "unknown privilege's error."),
        NOT_ALLOW: new Code(1201, "you do not have permission to access."),
        NOT_ALLOW_CONDO_LESS: new Code(1202, "you do not have a condo to access."),
        SUPPORT_ONLY_FOR_RESIDENT_USER: new Code(1203, "you are currently registered as a non resident \nbooking of facilities is only available to condo residents \nplease contact your condo manager for more information \nthank you"),
        INVALID_VERSION: new Code(1204, "invalid version format"),
        VERSION_NOT_FOUND: new Code(1205, "version not found"),
        FORCE_UPDATE: new Code(1206, "need update version")
    },
    PAYMENT: {
        TYPE: "PAYMENT",
        GENERIC: new Code(1300, "unknown braintree's error."),
        TYPE_PAYMENT_INVALID: new Code(1301, "payment type invalid"),
        PAYMENT_INVALID: new Code(1302, "The payment invalid."),
        WRONG_BILLING_DETAIL: new Code(1303, "Invalid billing detail. Please booking again."),
        MISSING_CUSTOMER_ID: new Code(1304, "Missing customerId"),
        STRIPE_KEY_INVALID: new Code(1308, "Invalid Stripe key")
    },
    OPERATION: {
        TYPE: "OPEATION",
        GENERIC: new Code(1400, "Unknown error."),
        FIREBASE_DISABLE: new Code(1401, "Firebase was disable"),
        PAYMENT_DISABLE: new Code(1402, "Payment was disable"),
    }
};
export default ErrorCode;
