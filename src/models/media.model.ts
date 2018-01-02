/**
 * Created by phuongho on 15/08/17.
 */
import * as Schema from "../data/sql/schema";
import { BaseModel } from "./base.model";
import { Json, Bookshelf } from "../libs/mapper";
import { MEDIA_TABLE_SCHEMA } from "./../data/sql/schema";
import { MediaDto } from "../data/sql/models";

export class MediaModel extends BaseModel {
    @Json("path")
    @Bookshelf(MEDIA_TABLE_SCHEMA.FIELDS.PATH)
    public path: string = undefined;

    @Json("url")
    @Bookshelf(MEDIA_TABLE_SCHEMA.FIELDS.URL)
    public url: string = undefined;

    @Json("signature")
    public signature: string = undefined;

    public static toResponse(modal: MediaModel): any {
        let ret: any = {};
        if (modal != null) {
            if (BaseModel.hasValue(modal.id)) {
                ret.id = modal.id;
            }
            if (BaseModel.hasValue(modal.createdDate)) {
                ret.createdDate = modal.createdDate.toDate();
            }
            if (BaseModel.hasValue(modal.updatedDate)) {
                ret.updatedDate = modal.createdDate.toDate();
            }
            if (BaseModel.hasValue(modal.path)) {
                ret.path = modal.path;
            }
            if (BaseModel.hasValue(modal.url)) {
                ret.url = modal.url;
            }
            if (BaseModel.hasValue(modal.signature)) {
                ret.signature = modal.signature;
            }
        }
        return ret;
    }

    public static fromDataS3(data: any): MediaModel {
        if (data != null) {
            let model = new MediaModel();
            model.url = BaseModel.getString(data.Location);
            model.path = BaseModel.getString(data.Key);
            // modal.signature = BaseModel.getString(data.ETag);
            return model;
        }
        return null;
    }
}

export default MediaModel;
