import * as Bluebird from "bluebird";
import * as Knex from "knex";
import * as _ from "lodash";
import { BaseDto } from "./sql/models";
import { BaseModel, CollectionWrap, ExceptionModel } from "../models";
import { BookshelfMapper } from "./../libs/mapper/bookshelf.mapper";
import { ErrorCode, HttpStatus } from "../libs";
import { QueryBuilder } from "knex";
import { WithRelatedQuery, ModelBase } from "bookshelf";

export interface Log {
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
}

// export interface Repository<M> {
//     update(model: M): Promise<any>;
//     insert(model: M): Promise<any>;
//     insertGet(insertGet: M, related: string[], filters: string[]): Promise<M>;
//     forceDelete(id: String): Promise<boolean>;
// }
import { injectable, unmanaged } from "inversify";

@injectable()
export class BaseRepository<T extends BaseDto<T>, X extends BaseModel> {
    constructor( @unmanaged() protected dto: { new (attributes?: any, isNew?: boolean): T },
        @unmanaged() protected model: { new (): X },
        protected logger?: Log) {

        this.logger = logger || {
            error: (message: string, meta?: any): void => { },
            warn: (message: string, meta?: any): void => { },
            info: (message: string, meta?: any): void => { },
            debug: (message: string, meta?: any): void => { },
        };
    }
    /**
     *
     * @param model
     */

    public update(model: X): Bluebird<T> {
        if (model == null && model.id != null && model.id !== "") {
            return Bluebird.reject(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }
        let data = BookshelfMapper.serialize(model);

        return new this.dto({ id: data.id }).save(data, {
            patch: true
        });
    }

    /**
     *
     * @param model
     */
    public insert(model: X): Bluebird<T> {
        if (model == null) {
            return Bluebird.resolve(null);
        }
        let data = BookshelfMapper.serialize(model);
        return new this.dto().save(data);
    }

    /**
     * Function insert and convert to model object with related and filters.
     *
     * @param model
     * @param related
     * @param filters
     * @returns {Bluebird<U>}
     */
    public insertGet(model: X, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X> {
        return this.insert(model)
            .then(result => {
                return this.findById(result.id, related, filters);
            });
    }
    /**
     *
     * @param id
     */

    public forceDelete(id: string): Bluebird<boolean> {
        if (id == null) {
            return Bluebird.resolve(false);
        }
        return new this.dto({ id: id }).destroy()
            .then(() => {
                return true;
            })
            .catch(err => {
                this.logger.error(err.message, err);
                return false;
            });
    }

    /**
     *
     * @param id
     */
    public deleteLogic(id: string): Bluebird<T> {
        if (id == null || id.length === 0) {
            return Bluebird.reject(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST
            ));
        }

        return this.findById(id)
            .then((object) => {
                if (!object) {
                    throw new ExceptionModel(
                        ErrorCode.RESOURCE.NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST
                    );
                }
                return new this.dto({ id: id }).save({ is_deleted: 1 }, { patch: true });
            });
    }

    /**
     *
     * @param callback
     * @returns {BlueBird<any>}
     */
    public deleteByQuery(callback: (qb: QueryBuilder) => void): Bluebird<any[]> {
        return new this.dto().query(callback).destroy();
    }

    /**
     *
     * @returns {BlueBird<any>}
     */
    public truncate(): any {
        return new this.dto().query().truncate();
    }

    /**
     *
     * @param callback
     * @returns {BlueBird<any>}
     */
    public updateByQuery(callback: (qb: QueryBuilder) => void, model: any): Bluebird<T> {
        return new this.dto({}, false).query(callback).save(model, {
            method: "update",
            patch: true,
            require: false
        });
    }

    /**
     *
     * @param ids
     * @param related
     * @param filters
     */

    public findAll(ids: string[], related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X[]> {
        if (ids == null || ids.length === 0) {
            return Bluebird.resolve([]);
        }
        let dto = new this.dto();
        return dto.query((q): void => {
            q.whereIn(dto.idAttribute, ids);
            q.where(dto.isDelete, false);
        })
            .fetchAll({ withRelated: related })
            .then((objects) => {
                let ret: X[] = [];
                if (objects != null && objects.models != null && _.isArray(objects.models)) {
                    objects.models.forEach(object => {
                        let model = BookshelfMapper.deserialize(this.model, object);
                        BaseModel.filters(model, filters);
                        if (model != null) {
                            ret.push(model);
                        }
                    });
                }
                return ret;
            });
    }

    /**
     *
     * @param ids
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public findAllByPage(ids: string[] = [], offset: number = 0, limit: number = 50, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<CollectionWrap<X>> {
        let ret = new CollectionWrap<X>();

        let dto = new this.dto();
        return dto.query((q): void => {
            if (ids.length > 0) {
                q.whereIn(dto.idAttribute, ids);
            }
            q.where(dto.isDelete, false);
        }).fetchPage({ limit: limit, offset: 0, withRelated: related })
            .then((rows) => {
                if (rows != null && rows.models != null && _.isArray(rows.models)) {
                    rows.models.forEach((dtoObject: T) => {
                        let item = BookshelfMapper.deserialize(this.model, dtoObject);
                        BaseModel.filters(item, filters);
                        ret.data.push(item);
                    });
                    if (rows.pagination != null) {
                        ret.total = rows.pagination.rowCount;
                    }
                }
                return ret;
            })
            .catch((err: Error) => {
                return ret;
            });
    }

    /**
     *
     * @param id
     * @param related
     * @param filters
     */

    public findOne(id: string, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X> {
        let ret: X = null;
        if (id == null || id === "") {
            return Bluebird.resolve(ret);
        }

        return this.findById(id, related, filters);
    }

    /**
     *
     * @param id
     * @param related
     * @param filters
     */
    public findById(id: string, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X> {
        let ret: X = null;
        if (id == null || id === "") {
            return Bluebird.resolve(ret);
        }
        return new this.dto().where({ id: id }).fetch({ withRelated: related })
            .then((object) => {
                if (object) {
                    let temp = BookshelfMapper.deserialize(this.model, object);
                    BaseModel.filters(temp, filters);
                    return temp;
                }
                return null;
            });
    }

    /**
     *
     * @param callback
     */
    public countByQuery(callback: (qb: QueryBuilder) => void): Bluebird<number> {
        if (callback == null) {
            return Bluebird.resolve(0);
        }
        return new this.dto().query(callback).count()
            .then((total) => {
                return Number(total);
            });
    }
    /**
     *
     * @param callback
     * @param related
     * @param filters
     */
    public findByQuery(callback: (qb: QueryBuilder) => void, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X[]> {
        return new this.dto().query(callback).fetchAll({ withRelated: related })
            .then(items => {
                let ret: X[] = [];
                if (items != null && _.isArray(items.models))
                    items.models.forEach(item => {
                        let temp = BookshelfMapper.deserialize(this.model, item);
                        BaseModel.filters(temp, filters);
                        if (temp != null) {
                            ret.push(temp);
                        }
                    });
                return ret;
            })
            .catch(err => {
                this.logger.error(err.message, err);
                return [];
            });
    }

    /**
     *
     * @param callback
     * @param related
     * @param filters
     */
    public findOneByQuery(callback: (qb: QueryBuilder) => void, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X> {
        return new this.dto().query(callback).fetch({ withRelated: related })
            .then(item => {
                if (item != null) {
                    let data = BookshelfMapper.deserialize(this.model, item);
                    BaseModel.filters(data, filters);
                    return data;
                }
                return null;
            });
    }

    public countAndQuery(countQuery: (qb: QueryBuilder) => void, findQuery: (qb: QueryBuilder) => void, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<CollectionWrap<X>> {
        let ret = new CollectionWrap<X>();
        return this.countByQuery(countQuery)
            .then((total) => {
                ret.total = total;
                return this.findByQuery(findQuery, related, filters);
            })
            .then((objects) => {
                ret.data = objects;
                return ret;
            });
    }
    /**
     *
     * @param query
     */
    public raw(query: string): Knex.Raw {
        return BaseDto.knex().raw(query);
    }

    /**
     *
     * @param query
     */
    public rawQuery(query: string) {
        return BaseDto.knex().raw(query).then(result => {
            return result.rows;
        });
    }

    /**
     *
     * @param callback
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public queryByPage(callback: (qb: QueryBuilder) => void, offset: number = 0, limit: number = 50, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<CollectionWrap<X>> {
        let ret = new CollectionWrap<X>();
        if (callback == null) {
            return Bluebird.resolve(ret);
        }

        let dto = new this.dto();
        return dto.query(callback).fetchPage({ limit: limit, offset: offset, withRelated: related })
            .then((rows) => {
                if (rows != null && rows.models != null && _.isArray(rows.models)) {
                    rows.models.forEach((dtoObject: T) => {
                        let item = BookshelfMapper.deserialize(this.model, dtoObject);
                        BaseModel.filters(item, filters);
                        ret.data.push(item);
                    });
                    if (rows.pagination != null) {
                        ret.total = rows.pagination.rowCount;
                    }
                }
                return ret;
            })
            .catch((err: Error) => {
                this.logger.error(err.message, err);
                return ret;
            });
    }
    /**
     *
     * @param callback
     * @param related
     * @param filters
     */
    public query(callback: (qb: QueryBuilder) => void, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X[]> {
        let ret = [];
        if (callback == null) {
            return Bluebird.resolve(ret);
        }

        let dto = new this.dto();
        return dto.query(callback).fetchAll()
            .then((rows) => {
                if (rows != null && rows.models != null && _.isArray(rows.models)) {
                    rows.models.forEach((dtoObject: T) => {
                        let item = BookshelfMapper.deserialize(this.model, dtoObject);
                        BaseModel.filters(item, filters);
                        ret.push(item);
                    });
                }
                return ret;
            })
            .catch((err: Error) => {
                return ret;
            });
    }

    /**
     *
     * @param options {conditions: String|Object; orderBy: String|Object; groupBy: String}
     * @param related
     * @param filters
     */
    public findOneByAtribute(options: any, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<X> {
        return Bluebird.resolve()
            .then(() => {
                let query = () => {
                    return (q): void => {
                        if (options.conditions) {
                            if (_.isObject(options.conditions)) {
                                _.forOwn(options.conditions, (value, attribute) => {
                                    if(value != null) {
                                        q.where(attribute, value);
                                    }
                                });
                            }
                            if (_.isString(options.conditions)) {
                                q.whereRaw(options.conditions);
                            }
                        }
                        if (options.orderBy) {
                            if (_.isObject(options.orderBy)) {
                                _.forOwn(options.orderBy, (value, attribute) => {
                                    q.orderBy(attribute, value);
                                });
                            }
                            if (_.isString(options.conditions)) {
                                q.orderByRaw(options.orderBy);
                            }
                        }
                        if (options.groupBy) {
                            q.groupByRaw(options.groupBy);
                        }
                    };
                };
                return this.findOneByQuery(query(), related, filters);
            });
    }
    /**
     *
     * @param options {conditions: String|Object; orderBy: String|Object; groupBy: String}
     * @param related
     * @param filters
     */

    public findAllByAtribute(options: any, offset?: number, limit?: number, related: (string | WithRelatedQuery)[] = [], filters: string[] = []): Bluebird<CollectionWrap<X>> {
        return Bluebird.resolve()
            .then(() => {
                let query = () => {
                    return (q): void => {
                        if (options.conditions) {
                            if (_.isObject(options.conditions)) {
                                _.forOwn(options.conditions, (value, attribute) => {
                                    q.where(attribute, value);
                                });
                            }
                            if (_.isString(options.conditions)) {
                                q.whereRaw(options.conditions);
                            }
                        }
                        if (options.orderBy) {
                            if (_.isObject(options.orderBy)) {
                                _.forOwn(options.orderBy, (value, attribute) => {
                                    q.orderBy(attribute, value);
                                });
                            }
                            if (_.isString(options.conditions)) {
                                q.orderByRaw(options.orderBy);
                            }
                        }
                        if (options.groupBy) {
                            q.groupByRaw(options.groupBy);
                        }
                    };
                };
                return this.queryByPage(query(), offset, limit, related, filters);
            });
    }
}

export default BaseRepository;
