import * as Schema from "../data/sql/schema";
import * as momentTz from "moment-timezone";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { JsonDate, BookshelfDate } from "./base.model";
import { SESSION_TABLE_SCHEMA } from "./../data/sql/schema";
import { SessionDto } from "../data/sql/models";
import { UserModel } from "./user.model";

export class SessionModel extends BaseModel {
    @Json("userId")
    @Bookshelf(SESSION_TABLE_SCHEMA.FIELDS.USER_ID)
    public userId: string = undefined;

    @Json("token")
    @Bookshelf(SESSION_TABLE_SCHEMA.FIELDS.TOKEN)
    public token: string = undefined;

    @Json("firebaseToken")
    public firebaseToken: string = undefined;

    @Json("roleId")
    public roleId: string = undefined;

    @Json({ name: "expire", converter: JsonDate })
    @Bookshelf({ name: SESSION_TABLE_SCHEMA.FIELDS.EXPIRE, converter: BookshelfDate })
    public expire: momentTz.Moment = undefined;

    @Json("hash")
    @Bookshelf(SESSION_TABLE_SCHEMA.FIELDS.HASH)
    public hash: string = undefined;

    @Json({ name: "user", clazz: UserModel, omitEmpty: true })
    @Bookshelf({ relation: "user", clazz: UserModel })
    public user: UserModel = undefined;


    public static empty(): SessionModel {
        let ret = new SessionModel();
        ret.userId = "";
        ret.expire = BaseModel.getDate(new Date());
        ret.hash = "";
        // ret.roleId = "";
        // ret.roleKeyword = "";
        ret.token = "";
        return ret;
    }

    public toResponse(): SessionModel {
        SessionModel.filters(this, ["isDeleted"]);
        return this;
    }

}
