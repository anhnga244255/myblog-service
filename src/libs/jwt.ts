/**
 * Created by phuongho on 15/08/17.
 */
import * as jwt from "jsonwebtoken";

export interface BearerObject {
    exp: number;
    iat: number;
    iss: string;
    aud: string;
    [key: string]: any;
}

export class JsonWebToken {
    public static readonly DEFAULT_ISSUER = "Ventuso LLC";
    public static readonly DEFAULT_CLIENT = "simulator";
    public static readonly DEFAULT_EXPIRE = 365 * 24 * 60 * 60 * 1000; // 1 year
    public static readonly DEFAULT_ALGORITHM = "HS512";
    private password: string;
    private issuer: string;
    private defaultExpireTime: number;
    private defaultClient: string;

    constructor(opts?: any) {
        opts = opts != null ? opts : {};
        this.password = opts.password != null && opts.password !== "" ? opts.password : JsonWebToken.DEFAULT_ISSUER;
        this.issuer = opts.issuer != null && opts.issuer !== "" ? opts.issuer : JsonWebToken.DEFAULT_ISSUER;
        this.defaultClient = opts.defaultClient != null && opts.defaultClient !== "" ? opts.defaultClient : JsonWebToken.DEFAULT_CLIENT;
        this.defaultExpireTime = opts.defaultExpireTime != null && opts.defaultExpireTime !== "" ? opts.defaultExpireTime : JsonWebToken.DEFAULT_EXPIRE; // 1 year
    }

    public encode(payload: object, expire: number = this.defaultExpireTime, client = this.defaultClient): string {
        if (payload != null) {
            let current = Date.now();
            let expiredTime = current + this.defaultExpireTime;
            return jwt.sign(
                // Payload part
                payload,
                this.password,
                {
                    // algorithm: this.DEFAULT_ALGORITHM,
                    expiresIn: expiredTime,
                    issuer: this.issuer,
                    audience: client,
                });
        }
        return null;
    }

    public decode(token: string): BearerObject {
        return jwt.decode(token, { complete: true }) as BearerObject;
    }

    public verify(token: string, client = this.defaultClient): any {
        return jwt.verify(token, this.password, {
            // algorithms: [this.DEFAULT_ALGORITHM],
            audience: client,
            issuer: this.issuer,
        });
    }
}

export default JsonWebToken;
