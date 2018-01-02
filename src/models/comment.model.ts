import { ArticlesModel } from "./articles.model";
import * as express from "express";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { COMMENT_TABLE_SCHEMA } from "./../data/sql/schema";

export class CommentModel extends BaseModel {
    @Json("detail")
    @Bookshelf(COMMENT_TABLE_SCHEMA.FIELDS.DETAIL_COMMENT)
    public detail: string = undefined;

    @Json("name_fb")
    @Bookshelf(COMMENT_TABLE_SCHEMA.FIELDS.NAME_FB)
    public name_fb: string = undefined;

    @Json("articles_id")
    @Bookshelf(COMMENT_TABLE_SCHEMA.FIELDS.ARTICLES_ID)
    public articles: string = undefined;

    @Json({ name: "comment", clazz: ArticlesModel, omitEmpty: true })
    @Bookshelf({ relation: "article", clazz: ArticlesModel })
    public article: ArticlesModel = undefined;
}
