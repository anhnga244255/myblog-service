import * as Schema from "../data/sql/schema";
import * as express from "express";
import * as momentTz from "moment-timezone";
import { APPLICATION_TABLE_SCHEMA } from "./../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { PLATFORM } from "./../libs/constants";

export class ApplicationModel extends BaseModel {
    @Json("platform")
    @Bookshelf(APPLICATION_TABLE_SCHEMA.FIELDS.PLATFORM)
    public platform: string = undefined;

    @Json("version")
    @Bookshelf(APPLICATION_TABLE_SCHEMA.FIELDS.VERSION)
    public version: number = undefined;

    @Json("isLatest")
    @Bookshelf(APPLICATION_TABLE_SCHEMA.FIELDS.IS_LATEST)
    public isLatest: boolean = undefined;

    @Json("forceUpdate")
    @Bookshelf(APPLICATION_TABLE_SCHEMA.FIELDS.FORCE_UPDATE)
    public forceUpdate: boolean = undefined;
}

export default ApplicationModel;
