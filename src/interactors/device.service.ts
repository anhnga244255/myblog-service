
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { DeviceModel } from "../models";
import { DeviceRepository } from "../data";
import { injectable, inject } from "inversify";
/**
 * Created by phuongho on 15/08/17.
 */
@injectable()
export class DeviceService extends BaseService<DeviceModel, DeviceRepository> {
    constructor(repo: DeviceRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }

    /**
     *
     * @param model
     * @param related
     * @param filters
     * @returns {any}
     */
    public create(model: DeviceModel, related = [], filters = []): Promise<DeviceModel> {
        if (model != null) {
            return this.repo.findByDeviceId(model.deviceId)
                .then(device => {
                    if (device != null) {
                        model.id = device.id;
                        return this.repo.update(model);
                    } else {
                        return this.repo.insert(model);
                    }
                })
                .then((object) => {
                    return this.repo.findOne(object.id, related, filters);
                });
        }
        return Promise.resolve(null);
    }

    /**
     *
     * @param userId
     * @param deviceId
     * @param ignoreDevices
     * @returns {any}
     */
    public deleteByUserId(userId: string, deviceId?: string, ignoreDevices?: string[]): Promise<any> {
        if (userId != null) {
            return this.repo.deleteByQuery(q => {
                q.where(Schema.DEVICE_TABLE_SCHEMA.FIELDS.USER_ID, userId);
                if (deviceId != null) {
                    q.where(Schema.DEVICE_TABLE_SCHEMA.FIELDS.DEVICE_ID, deviceId);
                }
                if (ignoreDevices != null && ignoreDevices.length > 0) {
                    q.whereNotIn(Schema.DEVICE_TABLE_SCHEMA.FIELDS.DEVICE_ID, ignoreDevices);
                }
            });
        }
        return Promise.resolve(null);
    }

    /**
     * Get devices by user id.
     * @returns {Promise<any>}
     * @param userId
     */
    public getDeviceByUserId(userId: string): Promise<DeviceModel> {
        return this.repo.findOneByQuery(q => {
            q.where(Schema.DEVICE_TABLE_SCHEMA.FIELDS.USER_ID, userId);
        }, ["user"]);
    }
}

export default DeviceService;
