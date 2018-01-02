import { CategoryModel } from "./category.model";
import * as express from "express";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { ARTICLES_TABLE_SCHEMA } from "./../data/sql/schema";

export class ArticlesModel extends BaseModel {
    @Json("title")
    @Bookshelf(ARTICLES_TABLE_SCHEMA.FIELDS.TITLE)
    public title: string = undefined;

    @Json({ name: "category", clazz:CategoryModel, omitEmpty: true })
    @Bookshelf({ relation: "category", clazz: CategoryModel })
    public category: CategoryModel = undefined;
}
