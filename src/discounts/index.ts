import { BaseDiscount, DiscountResult } from "./base_discount";
import ModelAd from "../model/ad";
const _ = require('lodash');

class Discounts {
    private discounts: BaseDiscount[];

    constructor(discounts: BaseDiscount[]) {
        this.discounts = discounts;
    }

    apply(cart: ModelAd[]): DiscountResult {
        let formulatedResult: DiscountResult = {
            cart: cart,
            currentTotal: 0,
            resultModified: false
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