import { AUTH_CODE } from "./../../middlewares/authentication";
/**
 * Created by phuongho on 15/08/17.
 */

export const HEALTH_TABLE_SCHEMA = {
    TABLE_NAME: "health",
    FIELDS: {
        ID: "id"
    }
};

export const APPLICATION_TABLE_SCHEMA = {
    TABLE_NAME: "application",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        PLATFORM: "platform",
        VERSION: "version",
        IS_LATEST: "is_latest",
        FORCE_UPDATE: "force_update"
    }
};

export const SESSION_TABLE_SCHEMA = {
    TABLE_NAME: "sessions",
    FIELDS: {
        ID: "id",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED: "is_deleted",
        USER_ID: "user_id",
        TOKEN: "token",
        EXPIRE: "expire",
        HASH: "hash"
    },
};

export const ROLE_TABLE_SCHEMA = {
    TABLE_NAME: "roles",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        NAME: "name",
        KEYWORD: "keyword",
        DESCRIPTION: "description"
    },
};

export const DEVICE_TABLE_SCHEMA = {
    TABLE_NAME: "devices",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        DEVICE_ID: "device_id",
        REGISTRAR_ID: "registrar_id",
        DEVICE_OS: "device_os",
        DEVICE_MODEL: "device_model",
        DEVICE_NAME: "device_name",
        OS_VERSION: "os_version",
        APP_VERSION: "app_version",
        BUILD_VERSION: "build_version",
        IS_SANDBOX: "is_sandbox"
    },
};

export const USER_TABLE_SCHEMA = {
    TABLE_NAME: "users",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        FIRST_NAME: "first_name",
        LAST_NAME: "last_name",
        PHONE_NUMBER: "phone_number",
        EMAIL: "email",
        PASSWORD: "password",
        ROLE_ID: "role_id",
        AVATAR_URL: "avatar_url",
        PARENT_ID: "parent_id",
        COMPANY: "company",
        ADDRESS: "address",
        COUNTRY: "country",
        STATE: "state",
        PROVINCE: "province",
        TAG: "tag",
        LANGUAGE: "language",
    },
};

export const MEDIA_TABLE_SCHEMA = {
    TABLE_NAME: "media",
    FIELDS: {
        ID: "id",
        IS_ENABLE: "is_enable",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        PATH: "path",
        URL: "url",
        HASH: "hash",
    },
};

export const TAG_TABLE_SCHEMA = {
    TABLE_NAME: "tags",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        NAME: "name",
        DESCRIPTION: "description"
    },
};

export const USER_TAG_TABLE_SCHEMA = {
    TABLE_NAME: "user_tags",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        TAG_ID: "tag_id"
    },
};

export const PACKAGE_TABLE_SCHEMA = {
    TABLE_NAME: "packages",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        NAME: "name",
        DESCRIPTION: "description",
        NUMBER_ACCOUNT: "number_account",
        NUMBER_FILE: "number_file",
        PRICE: "price",
        PRIORITY: "priority"
    },
};

export const USER_PACKAGE_TABLE_SCHEMA = {
    TABLE_NAME: "user_packages",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        PACKAGE_ID: "package_id",
        NUMBER_ACCOUNT: "number_account",
        NUMBER_FILE: "number_file",
        PRICE: "price"
    },
};

export const PRESENTATION_TABLE_SCHEMA = {
    TABLE_NAME: "presentation",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        IS_ENABLE: "is_enable",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        USER_CODE: "user_code",
        TITLE: "title",
        DESCRIPTION: "description",
        IMAGE_URL: "image_url",
        NUMBER_PAGE: "number_page",
        PAGE_TIMING: "page_timing",
        FILE_URL: "file_url",
        LANGUAGE: "language",
        PRIORITY: "priority"
    },
};

export const ASSIGN_PRESENTATION_TABLE_SCHEMA = {
    TABLE_NAME: "assign_presentation",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        PRESENTATION_ID: "presentation_id",
        COUNTRY: "country",
        STATE: "state",
        PROVINCE: "province",
        TAG: "tags",
        USER: "users"
    },
};

export const USER_PRESENTATION_TABLE_SCHEMA = {
    TABLE_NAME: "user_presentation",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        PRESENTATION_ID: "presentation_id"
    },
};

export const PRESENTATION_REPORT_TABLE_SCHEMA = {
    TABLE_NAME: "presentation_report",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        PRESENTATION_ID: "presentation_id",
        START_DATE: "start_date",
        END_DATE: "end_date",
        PAGE_TIMING: "page_timing",
        LATITUDE: "latitude",
        LONGITUDE: "longitude",
        NOTE: "note",
        AUDIO_URL: "audio_url",
        RATE: "rate",
    }
};

export const USER_CODE_TABLE_SCHEMA = {
    TABLE_NAME: "user_codes",
    FIELDS: {
        ID: "id",
        IS_DELETED: "is_deleted",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        USER_ID: "user_id",
        NAME: "name",
        CODE: "code",
        IS_USED: "is_used"
    },
};

export const SETTING_TABLE_SCHEMA = {
    TABLE_NAME: "settings",
    FIELDS: {
        ID: "id",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_ENABLE: "is_enable",
        IS_DELETED: "is_deleted",
        KEYWORD: "key",
        VALUE: "value",
        DESC: "description",
    },
};

export const LANGUAGE_TABLE_SCHEMA = {
    TABLE_NAME: "languages",
    FIELDS: {
        ID: "id",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED: "is_deleted",
        NAME: "name",
        CODE: "code",
        PRIORITY: "priority",
    },
};
// create by Anh Nga 31-10-2017
export const CATEGORY_TABLE_SCHEMA = {
    TABLE_NAME: "category",
    FIELDS: {
        ID: "id",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED: "is_deleted",
        NAME: "name",

    },
};

export const ARTICLES_TABLE_SCHEMA = {
    TABLE_NAME: "articles",
    FIELDS: {
        ID: "id",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED: "is_deleted",
        TITLE: "title",
        CATEGORY_ID: "category_id",
        AUTH: "auth",
        SOURCE: "source",
        ARTICLES_ID: "articles_id"
    },
};

export const COMMENT_TABLE_SCHEMA = {
    TABLE_NAME: "comment",
    FIELDS: {
        ID: "id",
        CREATED_DATE: "created_date",
        UPDATED_DATE: "updated_date",
        IS_DELETED: "is_deleted",
        NAME_FB: "name_fb",
        ARTICLES_ID: "articles_id",
        DETAIL_COMMENT: "detail",
    },
};
