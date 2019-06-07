import { BaseDiscount, DiscountResult } from "./base_discount";
import ModelAd from "../model/ad";
const _ = require('lodash');

import PriceDropDiscount from "./price_drop_discount";
import XforYDiscount from "./x_for_y_discount";

export const Rules = [
    PriceDropDiscount,
    XforYDiscount
];

export default class Discounts {
    private discounts: Array<BaseDiscount>;

    constructor(discounts: Array<BaseDiscount>) {
        this.discounts = discounts;
    }

    apply(cart: Array<ModelAd>): DiscountResult {
        let formulatedResult: DiscountResult = {
            cart: cart,
            currentTotal: 0,
        };
        
        let discount: BaseDiscount;
        for (discount of this.discounts)
        {
            formulatedResult = discount.executeDiscount(formulatedResult.cart, formulatedResult.currentTotal);
        }

        // Reduce till all the ads are gone from the cart
        while (_.size(formulatedResult.cart) > 0)
        {
            formulatedResult.currentTotal += formulatedResult.cart[0].Price;
            formulatedResult.cart = _.slice(formulatedResult.cart, 1);
        }

        return formulatedResult;
    }
}