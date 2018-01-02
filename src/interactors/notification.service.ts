/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as stringFormat from "string-format";
import { BaseService, Log } from "./base.service";
import { DEVICE_OS } from "../libs/constants";
import { DeviceRepository } from "../data";
import { FCMPush } from "../libs/fcm";
import { NotificationModel, DeviceModel, UserModel } from "../models";
import { Utils } from "../libs";
import { injectable, inject } from "inversify";

@injectable()
export class NotificationService extends BaseService<any, any> {
    constructor(private device: DeviceRepository, private fcm: FCMPush, @inject("Logger") log?: Log) {
        super(null, log);
    }
    /**
     *
     * @param message
     * @returns {Promise<void>}
     */
    public push(message: NotificationModel): Promise<boolean> {
        return Promise.resolve()
            .then(() => {
                if (message.iOSDevices != null && message.iOSDevices.length > 0) {
                    this.fcm.pushToiOS(message)
                        .catch(err => {
                            this.logger.error(err.message, err);
                        });
                }

                if (message.androidDevices != null && message.androidDevices.length > 0) {
                    this.fcm.pushToAndroid(message)
                        .catch(err => {
                            this.logger.error(err.message, err);
                        });
                }

                return true;
            })
            .catch((err) => {
                this.logger.error(err.message, err);
                return false;
            });
    }
    /**
     * Push notification to user
     *
     * @param userIds
     * @param message
     * @param type
     * @returns {Bluebird<boolean>}
     */
    public pushToUsers(userIds: string[] = [], message: NotificationModel, type?: string): Promise<boolean> {
        if (userIds.length === 0) {
            this.logger.info("Users are empty, nothing to push");
        }

        return Promise.each(userIds, (userId) => {
            return this.device.getDevicesByUserId(userId)
                .then(devices => {
                    if (devices != null && devices.length > 0) {
                        let allowPush: boolean = true;

                        if (allowPush) {
                            message.data.userId = userId;

                            this.pushToDevices(devices, message)
                                .catch(err => {
                                    this.logger.error(err.message, err);
                                });
                        }
                    }
                })
                .catch(err => {
                    this.logger.error(err.message, err);
                    return true;
                });
        })
            .then(() => {
                return true;
            });
    }

    /**
     * Push notification to device
     *
     * @param devices
     * @param message
     * @returns {Bluebird<boolean>}
     */
    public pushToDevices(devices: DeviceModel[] = [], message: NotificationModel): Promise<boolean> {
        if (devices.length === 0) {
            this.logger.info("Device list is empty, nothing to push");
            return Promise.resolve(true);
        }
        message.iOSDevices = [];
        message.androidDevices = [];
        for (let device of devices) {
            if (device.registrarId != null && device.registrarId !== "") {
                if (device.deviceOs.toLowerCase() === DEVICE_OS.iOS.toLowerCase()) {
                    message.iOSDevices.push(device.registrarId);
                } else if (device.deviceOs.toLowerCase() === DEVICE_OS.ANDROID.toLowerCase()) {
                    message.androidDevices.push(device.registrarId);
                }
            }
        }
        return this.push(message)
            .catch(err => {
                this.logger.error(err.message, err);
                return false;
            });
    }
}

export default NotificationService;
