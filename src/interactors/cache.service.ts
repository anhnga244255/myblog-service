import Redis from "../data/redis/redis";
import { BaseService, Log } from "./base.service";
import { injectable, inject } from "inversify";
@injectable()
export class CacheService extends BaseService<any, any> {

    constructor(@inject("Logger") log?: Log) {
        super(null, log);
    }

    /**
     * Create a unique key in redis
     * @param params array of string
     */
    private createKey(...params: string[]): string {
        return params.filter(val => val != null && val !== "").join(":");
    }

    public get(key: string): any {
        return Redis.getClient().getAsync(key);
    }

    public set(key: string, val: any, expire?: number): any {
        if (expire != null) {
            return Redis.getClient().setAsync(key, val, "EX", expire);
        }
        return Redis.getClient().setAsync(key, val);
    }
}

export default CacheService;
