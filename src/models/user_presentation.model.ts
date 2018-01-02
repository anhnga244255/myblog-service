import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { PRIORITY } from "./../libs/scheduler";
import { PresentationModel } from "./presentation.model";
import { USER_PRESENTATION_TABLE_SCHEMA } from "./../data/sql/schema";
import { UserModel } from "./user.model";

export class UserPresentationModel extends BaseModel {
    @Json("userId")
    @Bookshelf(USER_PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID)
    public userId: string = undefined;

    @Json("presentationId")
    @Bookshelf(USER_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID)
    public presentationId: string = undefined;

    @Json({ name: "user", clazz: UserModel, omitEmpty: true })
    @Bookshelf({ relation: "user", clazz: UserModel })
    public user: UserModel = undefined;

    @Json({ name: "presentation", clazz: PresentationModel, omitEmpty: true })
    @Bookshelf({ relation: "presentation", clazz: PresentationModel })
    public package: PresentationModel = undefined;
}
