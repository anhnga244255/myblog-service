import * as Schema from "../data/sql/schema";
import { ASSIGN_PRESENTATION_TABLE_SCHEMA } from "./../data/sql/schema";
import { BaseModel, JsonBookshelf, JsonString } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { UserModel } from "./user.model";

export class AssignPresentationModel extends BaseModel {
    @Json("presentationId")
    @Bookshelf(ASSIGN_PRESENTATION_TABLE_SCHEMA.FIELDS.PRESENTATION_ID)
    public presentationId: string = undefined;

    @Json("country")
    @Bookshelf(ASSIGN_PRESENTATION_TABLE_SCHEMA.FIELDS.COUNTRY)
    public country: string = undefined;

    @Json("state")
    @Bookshelf(ASSIGN_PRESENTATION_TABLE_SCHEMA.FIELDS.STATE)
    public state: string = undefined;

    @Json("province")
    @Bookshelf(ASSIGN_PRESENTATION_TABLE_SCHEMA.FIELDS.PROVINCE)
    public province: string = undefined;

    @Json({ name: "tags" })
    @Bookshelf({ name: ASSIGN_PRESENTATION_TABLE_SCHEMA.FIELDS.TAG, converter: JsonBookshelf  })
    public tags: string[] = undefined;

    @Json({ name: "users" })
    @Bookshelf({ name: ASSIGN_PRESENTATION_TABLE_SCHEMA.FIELDS.USER, converter: JsonBookshelf  })
    public users: string[] = undefined;
}
