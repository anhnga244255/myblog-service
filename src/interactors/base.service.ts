/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as _ from "lodash";
import { BaseModel, CollectionWrap, ExceptionModel } from "../models";
import { BaseRepository } from "../data";
import { ErrorCode, HttpStatus } from "../libs";
import { QueryBuilder } from "knex";
import { WithRelatedQuery } from "bookshelf";
import { injectable, unmanaged } from "inversify";

export interface Log {
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}
@injectable()
export class BaseService<M extends BaseModel, R extends BaseRepository<any, M>> {
    constructor( @unmanaged() protected repo?: R, @unmanaged() protected logger?: Log) {
        this.logger = logger || {
            error: (message: string, meta?: any): void => { },
            warn: (message: string, meta?: any): void => { },
            info: (message: string, meta?: any): void => { },
            debug: (message: string, meta?: any): void => { },
        };

        this.repo = repo || {} as R;
    }

    /**
     *
     * @param model
     * @param related
     * @param filters
     */
    public update(model: M, related = [], filters = []): Promise<any> {
        return this.detailById(model.id)
            .then(object => {
                if (!object || object.isDeleted) {
                    throw new ExceptionModel(
                        ErrorCode.RESOURCE.NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST,
                    );
                }
                return this.repo.update(model);
            });
    }

    /**
     *
     * @param model
     */
    public insert(model: M): Promise<any> {
        return this.repo.insert(model);
    }

    /**
     * @param model
     * @param related
     * @param filters
     */
    public insertGet(model: M, related: string[] = [], filters: string[] = []): Promise<M> {
        return this.repo.insertGet(model, related, filters);
    }

    /**
     * @param id
     */
    public forceDelete(id: string): Promise<boolean> {
        return this.repo.forceDelete(id);
    }

    /**
     *
     * @param id
     */
    public deleteLogic(id: string): Promise<M> {
        return this.repo.deleteLogic(id);
    }

    /**
     * @param id
     */
    public removeById(id: string): Promise<any> {
        return this.detailById(id)
            .then((object) => {
                return this.deleteLogic(object.id);
            })
            .then(object => {
                if (object) {
                    return true;
                }
                return false;
            });
    }
    /**
    * @param id
    * @param related
    * @param filters
    */
    public detailById(id: string, related = [], filters = []): Promise<M> {
        return this.findById(id, related, filters)
            .then(object => {
                if (object === null || object.isDeleted === true) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.NOT_FOUND,
                    ));
                }
                return object;
            });
    }

    /**
     *
     * @param id
     * @param related
     * @param filters
     */
    public findOne(id: string, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Promise<M> {
        return this.findById(id, related, filters);
    }

    /**
     *
     * @param id
     * @param related
     * @param filters
     */
    public findById(id: string, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Promise<M> {
        return this.repo.findById(id, related, filters);
    }



    /**
     *
     * @param model
     * @param related
     * @param filters
     */
    public make(model: M, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Promise<M> {
        return Promise.resolve()
            .then(() => {
                return this.repo.insert(model);
            })
            .then((object) => {
                return this.findOne(object.id, [], filters);
            });
    }

    /**
     *
     * @param id
     * @param related
     * @param filters
     */
    public delete(id: string, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Promise<string> {
        return this.repo.deleteLogic(id)
            .then(() => {
                return id;
            });
    }
}

export default BaseService;
