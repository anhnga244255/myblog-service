import * as Schema from "../data/sql/schema";
import { BaseModel, JsonBookshelf, JsonString } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { PRESENTATION_TABLE_SCHEMA } from "./../data/sql/schema";
import { UserModel } from "./user.model";

export class PresentationModel extends BaseModel {
    @Json("userId")
    @Bookshelf(PRESENTATION_TABLE_SCHEMA.FIELDS.USER_ID)
    public userId: string = undefined;

    @Json("userCode")
    @Bookshelf(PRESENTATION_TABLE_SCHEMA.FIELDS.USER_CODE)
    public userCode: string = undefined;

    @Json("title")
    @Bookshelf(PRESENTATION_TABLE_SCHEMA.FIELDS.TITLE)
    public title: string = undefined;

    @Json("desc")
    @Bookshelf(PRESENTATION_TABLE_SCHEMA.FIELDS.DESCRIPTION)
    public desc: string = undefined;

    @Json("imageUrl")
    @Bookshelf(PRESENTATION_TABLE_SCHEMA.FIELDS.IMAGE_URL)
    public imageUrl: string = undefined;

    @Json("fileUrl")
    @Bookshelf(PRESENTATION_TABLE_SCHEMA.FIELDS.FILE_URL)
    public fileUrl: string = undefined;

    @Json("numberPage")
    @Bookshelf(PRESENTATION_TABLE_SCHEMA.FIELDS.NUMBER_PAGE)
    public numberPage: string = undefined;

    @Json({ name: "pageTiming"})
    @Bookshelf({ name: PRESENTATION_TABLE_SCHEMA.FIELDS.PAGE_TIMING, converter: JsonBookshelf })
    public pageTiming: string[] = undefined;

    @Json("language")
    @Bookshelf(PRESENTATION_TABLE_SCHEMA.FIELDS.LANGUAGE)
    public language: string = undefined;

    @Json("priority")
    @Bookshelf(PRESENTATION_TABLE_SCHEMA.FIELDS.PRIORITY)
    public priority: number = undefined;

    @Json({ name: "user", clazz: UserModel, omitEmpty: true })
    @Bookshelf({ relation: "user", clazz: UserModel })
    public user: UserModel = undefined;
}
