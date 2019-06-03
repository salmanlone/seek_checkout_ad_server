import { BaseDiscount, DiscountResult } from "./base_discount";
import ModelAd from "../model/ad";
const _ = require('lodash');

export default class PriceDropDiscount extends BaseDiscount {

    private ad: ModelAd = null;
    private discountedPrice: number = null;
    private countOrMore: number = null;

    constructor(ad: ModelAd, discountedPrice: number, countOrMore: number = 0) {
        super("price_drop");
        this.ad = ad;
        this.discountedPrice = discountedPrice;
        this.countOrMore = countOrMore;
    }

    executeDiscount(cart: ModelAd[], previousTotal: number): DiscountResult {
        let groupedCart = BaseDiscount.groupTheCart(cart);

        // Check if the rule ad name exists
        if (_.has(groupedCart, this.ad.Name)) {
            // Check if the count is appropriate
            if (_.size(groupedCart[this.ad.Name]) >= this.countOrMore) {
                // Lets reduce the items and return the cart back with the new result
                let calcPrice = _.size(groupedCart[this.ad.Name]) * this.discountedPrice;
                delete groupedCart[this.ad.Name];

                // Lets ungroup the cart as it was
                let formulatedResult: DiscountResult = {
                    cart: BaseDiscount.ungroupTheCart(groupedCart),
                    currentTotal: previousTotal + calcPrice,
                    resultModified: true
                };
                return formulatedResult;
            }
        }

        return {
            cart: cart,
            currentTotal: previousTotal,
            resultModified: false
        };
    }
}