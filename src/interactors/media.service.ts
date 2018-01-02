/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, MediaModel } from "../models";
import { MediaRepository } from "../data";
import { injectable, inject } from "inversify";

@injectable()
export class MediaService extends BaseService<MediaModel, MediaRepository> {
    constructor(repo: MediaRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }

    findByHash(hash: string): Promise<CollectionWrap<MediaModel>> {
        let ret = new CollectionWrap<MediaModel>();
        if (hash == null || hash === "") {
            Promise.resolve(ret);
        }
        return Promise.resolve()
            .then(() => {
                return this.repo.findByQuery(q => {
                    q.where(Schema.MEDIA_TABLE_SCHEMA.FIELDS.HASH, hash);
                });
            })
            .then((objects) => {
                ret.total = objects.length;
                ret.data = objects;
                return ret;
            });
    }
}

export default MediaService;
