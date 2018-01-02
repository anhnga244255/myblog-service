/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as StripeSDK from "stripe";
import * as _ from "lodash";
import { CURRENCY } from "./constants";
import { CardModel, ExceptionModel } from "../models";
import { ErrorCode, HttpStatus } from "./";

interface GatewayPayment {
    merchantId: string;
    publicKey: string;
    privateKey: string;
}

export class Stripe {
    private gatewayConfig: GatewayPayment;
    private gateway;

    constructor(_gatewayConfig?: GatewayPayment) {
        this.gatewayConfig = _gatewayConfig;

        let defaultConf = {
            publicKey: "pk_test_x5QbX1gpGO1MlUpP02IVBRYr",
            privateKey: "sk_test_0CA93NZpcc0j61MTOXNpty2C"
        };

        this.gatewayConfig = _.defaultsDeep(_gatewayConfig, defaultConf) as GatewayPayment;
        this.gateway = StripeSDK(this.gatewayConfig.privateKey);
    }

    public createCustomer(cardToken?: string): Promise<any> {
        let data = {};
        if (cardToken) {
            data["source"] = cardToken;
        }
        return new Promise((resolve, reject) => {
            this.gateway.customers.create(data, (err, customer) => {
                if (err) {
                    reject(this.handleError(err));
                } else {
                    resolve(customer.id);
                }
            });
        });
    }

    public findCustomer(customerId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.gateway.customers.retrieve(customerId, (err, result) => {
                if (err) {
                    reject(this.handleError(err));
                } else {
                    resolve(result);
                }
            });
        });
    }

    public createCard(customerId: string, cardToken: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.gateway.customers.createSource(customerId, {
                source: cardToken
            }, (err, result) => {
                if (err) {
                    reject(this.handleError(err));
                } else {
                    resolve(CardModel.fromStripeCreditCards(result, result.id));
                }
            });
        });
    }

    public updateCardDefault(customerId: string, cardId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.gateway.customers.update(customerId, {
                default_source: cardId
            }, (err, result) => {
                if (err) {
                    reject(this.handleError(err));
                } else {
                    resolve(result);
                }
            });
        });
    }

    public deleteCard(customerId: string, cardId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.gateway.customers.deleteCard(customerId, cardId, (err, result) => {
                if (err) {
                    reject(this.handleError(err));
                } else {
                    resolve(true);
                }
            });
        });
    }

    public createTransaction(customerId: string, amount: number, currency: string = CURRENCY.SINGAPORE): Promise<any> {
        return new Promise((resolve, reject) => {
            if (currency === CURRENCY.SINGAPORE) {
                amount = amount * 100;
            }
            this.gateway.charges.create({
                amount: amount,
                currency: currency,
                customer: customerId
            }, (err, result) => {
                if (err) {
                    reject(this.handleError(err));
                } else {
                    resolve(result.id);
                }
            });
        });

    }

    private handleError(err) {
        let error = err;
        // switch (err.type) {
        //     case "StripeAuthenticationError":
        //          error = new ExceptionModel(
        //             ErrorCode.PAYMENT.STRIPE_KEY_INVALID.CODE,
        //             ErrorCode.PAYMENT.STRIPE_KEY_INVALID.MESSAGE,
        //             false,
        //             HttpStatus.BAD_REQUEST
        //         );
        //         break;
        // }
        return error;
    }
}

export default Stripe;
