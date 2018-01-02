/**
 * Created by phuongho on 15/08/17.
 */
import * as _ from "lodash";
import { Json, Bookshelf } from "../libs/mapper";
import { NOTIFICATION_OPTIONS } from "../libs/constants";

export class NotificationModel {
    public iOSDevices: string[] = [];
    public androidDevices: string[] = [];

    public title: string = "";
    public icon: string = NOTIFICATION_OPTIONS.DEFAULT_ICON;
    public body: string = "";
    public clickAction: string = "";
    public contentAvailable: boolean = true;
    public sound: string = NOTIFICATION_OPTIONS.DEFAULT_SOUND;
    public expire: number = NOTIFICATION_OPTIONS.DEFAULT_EXPIRE;
    public priority: string = NOTIFICATION_OPTIONS.PRIORITY.HIGH.VALUE; // android->ios: high -> 10, normal -> 5
    public collapse: string = NOTIFICATION_OPTIONS.DEFAULT_COLLAPSE_KEY; // ios: collapseId, android: collapseKey

    // Android specifics
    public restrictedPackageName?: string;
    public delayWhileIdle: boolean = false;
    public dryRun: boolean = true;

    // iOS specifics
    public subtitle?: string;
    public badge: number = 1;

    // Your data
    public data: any = {
        fromFCM: true,
        type: -1,
        itemId: "",
        userId: ""
    };

    public static fromRequest(obj: any): NotificationModel {
        let message = new NotificationModel();

        if (obj.iOSDevices != null && _.isArray(obj.iOSDevices)) {
            obj.iOSDevices.forEach((dev) => {
                if (_.isString(dev)) {
                    message.iOSDevices.push(dev);
                }
            });
        }

        if (obj.androidDevices != null && _.isArray(obj.androidDevices)) {
            obj.androidDevices.forEach((dev) => {
                if (_.isString(dev)) {
                    message.androidDevices.push(dev);
                }
            });
        }

        message.title = obj.title != null && _.isString(obj.title) ? obj.title : NOTIFICATION_OPTIONS.DEFAULT_TITLE;
        message.icon = obj.icon != null && _.isString(obj.icon) ? obj.icon : NOTIFICATION_OPTIONS.DEFAULT_ICON;
        message.body = obj.body != null && _.isString(obj.body) ? obj.body : NOTIFICATION_OPTIONS.DEFAULT_MESSAGE;
        message.sound = obj.sound != null && _.isString(obj.sound) ? obj.sound : NOTIFICATION_OPTIONS.DEFAULT_SOUND;
        message.priority = obj.priority != null && _.isString(obj.priority) ? obj.priority : NOTIFICATION_OPTIONS.PRIORITY.HIGH.VALUE;
        message.collapse = obj.collapse != null && _.isString(obj.collapse) ? obj.collapse : NOTIFICATION_OPTIONS.DEFAULT_SOUND;

        let expire = _.parseInt(obj.expire);
        message.expire = isNaN(expire) ? NOTIFICATION_OPTIONS.DEFAULT_EXPIRE : expire;

        let badge = _.parseInt(obj.badge);
        message.badge = isNaN(badge) ? 1 : badge;

        if (obj.payload != null) {
            message.data = obj.data;
        }

        return message;
    }
}

export default NotificationModel;
