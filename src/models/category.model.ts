import * as express from "express";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { CATEGORY_TABLE_SCHEMA } from "./../data/sql/schema";

export class CategoryModel extends BaseModel {
    @Json("name")
    @Bookshelf(CATEGORY_TABLE_SCHEMA.FIELDS.NAME)
    public name: string = undefined;


}
