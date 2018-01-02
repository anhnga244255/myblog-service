/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseRepository, Log } from "./base.repository";
import { DeviceDto } from "./sql/models";
import { DeviceModel } from "../models";
import { injectable, inject } from "inversify";

@injectable()
export class DeviceRepository extends BaseRepository<DeviceDto, DeviceModel> {
    constructor( @inject("Logger") log?: Log) {
        super(DeviceDto, DeviceModel, log);
    }

    public findByUserId(userId: string, related = [], filters = []): Promise<DeviceModel> {
        return this.findOneByQuery(q => {
            q.where(Schema.DEVICE_TABLE_SCHEMA.FIELDS.USER_ID, userId);
        }, related, filters);
    }

    public findByDeviceId(deviceId: string, related = [], filters = []): Promise<DeviceModel> {
        return this.findOneByQuery(q => {
            q.where(Schema.DEVICE_TABLE_SCHEMA.FIELDS.DEVICE_ID, deviceId);
        }, related, filters);
    }

    public getDevicesByUserId(userId: string): Promise<DeviceModel[]> {
        if (userId == null || userId === "") {
            return Promise.resolve([]);
        }
        return this.findByQuery(q => {
            q.where(Schema.DEVICE_TABLE_SCHEMA.FIELDS.USER_ID, userId);
        }, ["user"]);
    }
}
export default DeviceRepository;
