import * as express from "express";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { LANGUAGE_TABLE_SCHEMA } from "./../data/sql/schema";

export class LanguageModel extends BaseModel {
    @Json("name")
    @Bookshelf(LANGUAGE_TABLE_SCHEMA.FIELDS.NAME)
    public name: string = undefined;

    @Json("code")
    @Bookshelf(LANGUAGE_TABLE_SCHEMA.FIELDS.CODE)
    public code: string = undefined;

}
