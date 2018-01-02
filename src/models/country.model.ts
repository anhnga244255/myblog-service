import * as express from "express";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";

export class CountryModel extends BaseModel {
    @Json("name")
    public name: string = undefined;

    @Json("code")
    public code: string = undefined;

}
