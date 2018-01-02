import * as Schema from "../schema";
import { BaseDto } from "./base.dto";
import { Database } from "../connection";

export class UserDto extends BaseDto<UserDto> {
    get tableName(): string {
        return Schema.USER_TABLE_SCHEMA.TABLE_NAME;
    }
    public role(): any {
        return this.belongsTo(Schema.ROLE_TABLE_SCHEMA.TABLE_NAME, Schema.USER_TABLE_SCHEMA.FIELDS.ROLE_ID);
    }
    public account(): any {
        return this.hasMany(UserDto, Schema.USER_TABLE_SCHEMA.FIELDS.PARENT_ID).query(q => {
            q.where(`${Schema.USER_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
        });
    }
    public tag(): any {
        return this.hasMany(Schema.TAG_TABLE_SCHEMA.TABLE_NAME, Schema.TAG_TABLE_SCHEMA.FIELDS.USER_ID).query(q => {
            q.where(`${Schema.TAG_TABLE_SCHEMA.TABLE_NAME}.${Schema.TAG_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
        });
    }
    public userTag(): any {
        return this.hasMany(Schema.USER_TAG_TABLE_SCHEMA.TABLE_NAME).query(q => {
            q.where(`${Schema.USER_TAG_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_TAG_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
        });
    }
    public userPackage(): any {
        return this.hasMany(Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME).query(q => {
            q.where(`${Schema.USER_PACKAGE_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PACKAGE_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
        });
    }
    public presentation(): any {
        return this.hasMany(Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME, Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID).query(q => {
            q.where(`${Schema.PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.PRESENTATION_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
        });
    }
    public userPresentation(): any {
        return this.hasMany(Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME).query(q => {
            q.where(`${Schema.USER_PRESENTATION_TABLE_SCHEMA.TABLE_NAME}.${Schema.USER_PRESENTATION_TABLE_SCHEMA.FIELDS.IS_DELETED}`, false);
        });
    }
}

export default UserDto;
Database.bookshelf()["model"](Schema.USER_TABLE_SCHEMA.TABLE_NAME, UserDto);
