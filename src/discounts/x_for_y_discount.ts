import { BaseDiscount, DiscountResult } from "./base_discount";
import ModelAd from "../model/ad";
const _ = require("lodash");

export default class XForYDiscount extends BaseDiscount {

    private ad: ModelAd = null;
    private xCount: number = null;
    private yCount: number = null;

    // Given Uniliver
    // When 3 (xCount) ads are available
    // charge for 2 (yCount)
    constructor(ad: ModelAd, xCount: number, yCount: number) {
        super("x_for_y");
        this.ad = ad;
        this.xCount = xCount;
        this.yCount = yCount;
    }

    executeDiscount(cart: ModelAd[], previousTotal: number): DiscountResult {
        let groupedCart = BaseDiscount.groupTheCart(cart);

        let formulatedResult: DiscountResult = {
            cart: null,
            currentTotal: previousTotal,
            resultModified: false
        };

        // Check if the rule ad name exists
        if (_.has(groupedCart, this.ad.Name)) {
            // Check while the count is appropriate
            while (_.size(groupedCart[this.ad.Name]) >= this.xCount) {
                // Lets reduce the items and return the cart back with the new result
                groupedCart[this.ad.Name] =  _.slice(groupedCart[this.ad.Name], 0, this.xCount);
                formulatedResult.currentTotal += this.ad.Price * this.yCount;
                formulatedResult.resultModified = true;
            }
        }

        if (!formulatedResult.resultModified) {
            formulatedResult.cart = cart;
        }

        return formulatedResult;
    }
}