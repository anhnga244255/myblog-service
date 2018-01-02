/**
 * Created by phuongho on 15/08/17.
 */
import { Config } from "./config";
import { ErrorCode as ERROR_CODE } from "./error_code";
import { ExceptionModel } from "../models";
import { FCMPush } from "./fcm";
import { FirebaseAdmin } from "./firebase";
import { HttpCode as HTTP_STATUS } from "./http_code";
import { I18N, Language } from "./languages";
import { JsonWebToken } from "./jwt";
import { Logger, Log } from "./logger";
import { Mailer } from "./mailer";
import { SMS, Response, LookupResponse } from "./sms";
import { Scheduler } from "./scheduler";
import { Stripe } from "./stripe";
import { Uploader } from "./uploader";

// Utils and classes
export * from "./mapper";
export * from "./moment_range";
export * from "./utils";
export { ErrorCode as ERROR_CODE } from "./error_code";
export { FCMPush } from "./fcm";
export { FirebaseAdmin } from "./firebase";
export { HttpCode as HTTP_STATUS } from "./http_code";
export { I18N, Language } from "./languages";
export { JsonWebToken, BearerObject } from "./jwt";
export { Logger } from "./logger";
export { Mailer } from "./mailer";
export { SMS, Response, LookupResponse } from "./sms";
export { Scheduler, PRIORITY } from "./scheduler";
export { Stripe } from "./stripe";
export { Uploader } from "./uploader";

// Constants
export const HttpStatus = HTTP_STATUS;
export const ErrorCode = ERROR_CODE;
export const LANGUAGE = Language;


// custom error handler
const smsErrorHandle = (error: { code: number, message: string, [key: string]: any }): ExceptionModel => {
    switch (error.code) {
        case 21211:
        case 21614:
            return new ExceptionModel(
                ErrorCode.RESOURCE.INVALID_PHONE_NUMBER.CODE,
                ErrorCode.RESOURCE.INVALID_PHONE_NUMBER.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST
            );
        default:
            return new ExceptionModel(
                ErrorCode.RESOURCE.GENERIC.CODE,
                ErrorCode.RESOURCE.GENERIC.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST
            );
    }
};

// singleton
export const i18n = new I18N();
export const jwt = new JsonWebToken();
export const config = Config.loadSetting();
export const logger = new Logger(config.log);
export const mailer = new Mailer(config.mailer, logger);
export const sms = new SMS(config.sms, null, smsErrorHandle);
export const firebase = new FirebaseAdmin(config.database ? config.database.firebase : {});
export const fcm = new FCMPush(config.fcm);
export const strip = new Stripe();
export const scheduler = new Scheduler(config.scheduler, logger);
export const uploader = new Uploader(config.storage);
