import * as UUID from "uuid";
import { Database } from "../connection";
export class BaseDto<T> extends Database.bookshelf().Model<any> {

    public static knex() {
        return Database.bookshelf().knex;
    }

    public static register(name: string, model: any): void {
        Database.bookshelf()["model"](model);
    }

    private static generateUuid(model: any): void {
        if (model.isNew()) {
            model.set(model.idAttribute, UUID.v4());
        }
    }

    constructor(attributes?: any, isNew?: boolean) {
        super(attributes);
        if (isNew != null) {
            this.isNew = () => {
                return isNew;
            };
        }
    }

    // noinspection JSMethodCanBeStatic
    get idAttribute(): string {
        return "id";
    }

    get isDelete(): string {
        return "is_deleted";
    }

    get hasTimestamps(): string[] {
        return ["created_date", "updated_date"];
    }

    public initialize(): void {
        this.on("saving", BaseDto.generateUuid);
    }
}
