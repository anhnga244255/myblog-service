import { BaseModel } from "./base.model";
import { DEVICE_OS } from "./../libs/constants";
import { DEVICE_TABLE_SCHEMA } from "./../data/sql/schema";
import { DeviceDto, UserDto } from "../data/sql/models";
import { HEADERS, JWT_WEB_TOKEN } from "../libs/constants";
import { Json, Bookshelf } from "../libs/mapper";
import { UserModel } from "./user.model";

export class DeviceModel extends BaseModel {
    @Json("userId")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.USER_ID)
    public userId: string = undefined;

    @Json("userAgent")
    public userAgent: string = undefined;

    @Json("deviceId")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.DEVICE_ID)
    public deviceId: string = undefined;

    @Json("registrarId")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.REGISTRAR_ID)
    public registrarId: string = undefined;

    @Json("deviceOs")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.DEVICE_OS)
    public deviceOs: string = undefined;

    @Json("deviceName")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.DEVICE_NAME)
    public deviceName: string = undefined;

    @Json("deviceModel")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.DEVICE_MODEL)
    public deviceModel: string = undefined;

    @Json("osVersion")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.OS_VERSION)
    public osVersion: string = undefined;

    @Json("appVersion")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.APP_VERSION)
    public appVersion: string = undefined;

    @Json("buildVersion")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.BUILD_VERSION)
    public buildVersion: string = undefined;

    @Json("isSandBox")
    @Bookshelf(DEVICE_TABLE_SCHEMA.FIELDS.IS_SANDBOX)
    public isSandBox: boolean = undefined;

    @Json({ name: "user", clazz: UserModel, omitEmpty: true })
    @Bookshelf({ relation: "user", clazz: UserModel })
    public user: UserModel = undefined;

    /**
     * Parse to DeviceModel from header request.
    * @param data
    * @param userId
    * @returns {DeviceModel}
    */
    public static fromRequest(data: any, userId: string): DeviceModel {
        let model = new DeviceModel();

        model.userId = userId;
        model.userAgent = BaseModel.getString(data[HEADERS.USER_AGENT]);
        model.deviceId = BaseModel.getString(data[HEADERS.DEVICE_ID], JWT_WEB_TOKEN.DEFAULT_CLIENT);
        model.registrarId = BaseModel.getString(data[HEADERS.REGISTRAR_ID]);
        model.deviceOs = BaseModel.getString(data[HEADERS.DEVICE_OS]);
        model.deviceName = BaseModel.getString(data[HEADERS.DEVICE_NAME]);
        model.deviceModel = BaseModel.getString(data[HEADERS.DEVICE_MODEL]);
        model.osVersion = BaseModel.getString(data[HEADERS.OS_VERSION]);
        model.appVersion = BaseModel.getString(data[HEADERS.APP_VERSION]);
        model.buildVersion = BaseModel.getString(data[HEADERS.BUILD_VERSION]);

        return model;
    }
}

export default DeviceModel;
