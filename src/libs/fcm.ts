/**
 * Created by phuongho on 15/08/17.
 */
import * as FCM from "fcm-node";
import * as Promise from "bluebird";
import { logger as Logger } from "../libs";
import { NOTIFICATION_OPTIONS } from "../libs/constants";
import { NotificationModel } from "../models";

export class FCMPush {
    private opts: any = {};
    private fcm: FCM;

    constructor(opts: any) {
        this.opts = opts != null ? {...opts} : {};
        this.fcm = new FCM(this.opts.serverKey);
    }

    /**
     * Function push notification to iOS devices.
     * @param message
     * @returns {any}
     */
    public pushToiOS(message: NotificationModel): Promise<boolean> {
        if (message == null || this.fcm == null) {
            return Promise.resolve(true);
        }

        return Promise.resolve()
            .then(() => {
                let msg = {
                    registration_ids: message.iOSDevices,
                    content_available: message.contentAvailable,
                    priority: message.priority === NOTIFICATION_OPTIONS.PRIORITY.HIGH.VALUE ? NOTIFICATION_OPTIONS.PRIORITY.HIGH.IOS : NOTIFICATION_OPTIONS.PRIORITY.NORMAL.IOS,
                    notification: {
                        title: message.title,
                        body: message.body,
                        click_action: message.clickAction,
                        icon: message.icon,
                        badge: message.badge,
                        sound: message.sound,
                    },
                    time_to_live: message.expire,
                    data: message.data
                };

                this.fcm.send(msg, function (err, response) {
                    if (err) {
                        Logger.error("Sent to iOS devices: " + err, err);
                    } else {
                        Logger.info("Successfully sent to iOS devices with response: " + response, response);
                    }
                });

                return true;
            })
            .catch((err) => {
                Logger.error(err.message, err);
                return false;
            });
    }

    /**
     * Function push notification to Android devices.
     * @param message
     * @returns {any}
     */
    public pushToAndroid(message: NotificationModel): Promise<boolean> {
        if (message == null || this.fcm == null) {
            return Promise.resolve(true);
        }
        return Promise.resolve()
            .then(() => {
                let msg = {
                    registration_ids: message.androidDevices,
                    content_available: message.contentAvailable,
                    priority: message.priority === NOTIFICATION_OPTIONS.PRIORITY.HIGH.VALUE ? NOTIFICATION_OPTIONS.PRIORITY.HIGH.ANDROID : NOTIFICATION_OPTIONS.PRIORITY.NORMAL.ANDROID,
                    // notification: {
                    //     title: message.title,
                    //     body: message.body,
                    //     click_action: message.clickAction,
                    //     icon: message.icon,
                    //     badge: message.badge,
                    //     sound: message.sound,
                    // },
                    time_to_live: message.expire,
                    data: {
                        title: message.title,
                        body: message.body,
                        clickAction: message.clickAction,
                        fromFCM: message.data.fromFCM,
                        type: message.data.type,
                        itemId: message.data.itemId,
                        userId: message.data.userId
                    }
                };

                this.fcm.send(msg, function (err, response) {
                    if (err) {
                        Logger.error("Sent to Android devices: " + err, err);
                    } else {
                        Logger.info("Successfully sent to Android devices with response: " + response, response);
                    }
                });

                return true;
            })
            .catch((err) => {
                Logger.error(err.message, err);
                return false;
            });
    }
}

export default FCMPush;
