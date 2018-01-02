/**
 * Created by phuongho on 15/08/17.
 */
import * as express from "express";
import { Json, Bookshelf } from "../libs/mapper";
import {BaseModel} from "./base.model";
import {UserModel} from "./user.model";

export class PaymentModel extends BaseModel {

}

export class CustomerPaymentModel extends BaseModel {
    @Json("name")
    public name: string = undefined;

    @Json("company")
    public company: string = undefined;

    @Json("email")
    public email: string = undefined;

    @Json("phone")
    public phone: string = undefined;

    @Json("fax")
    public fax: string = undefined;

    @Json("website")
    public website: string = undefined;
}

export class CardModel extends BaseModel {
    public cardholderName: string;
    public cardType: string;
    public cvv: string;
    public cardNumber: string;
    public isDefault: boolean;
    public expirationMonth: string;
    public expirationYear: string;
    public imageUrl: string;
    public last4: string; // "last4": "1111",
    public token: string;
    public maskedNumber: string; // "411111******1111"
    public expirationDate: string;


    public static fromBraintreeCreditCards(data: any): CardModel {
        let ret = new CardModel();

        ret.cardholderName = data.cardholderName;
        ret.cardType = data.cardType;
        ret.cvv = data.cvv;
        ret.cardNumber = data.cardNumber;
        ret.isDefault = data.default;
        ret.expirationMonth = data.expirationMonth;
        ret.expirationYear = data.expirationYear;
        ret.imageUrl = data.imageUrl;
        ret.last4 = data.last4;
        ret.maskedNumber = data.maskedNumber;
        ret.token = data.token;
        ret.expirationDate = data.expirationDate;

        return ret;
    }

    public static fromStripeCreditCards(data: any, cardDefaultId: string): CardModel {
        let ret = new CardModel();

        ret.cardholderName = data.name;
        ret.cardType = data.brand;
        ret.cvv = data.cvv;
        ret.expirationMonth = data.exp_month;
        ret.expirationYear = data.exp_year;
        ret.last4 = data.last4;
        ret.token = data.id;
        ret.isDefault = data.id === cardDefaultId ? true : false;
        ret.expirationDate = `${data.exp_month}/${data.exp_year}`;
        ret.maskedNumber = `************${data.last4}`;

        return ret;
    }
}


export default PaymentModel;
