import ModelAd from "../model/ad";
const _ = require('lodash');

export interface DiscountResult {
    cart: Array<ModelAd>;
    currentTotal: number;
}

export abstract class BaseDiscount {

    private discountType: string = null;

    constructor(discountType: string) {
        this.discountType = discountType;
    }

    get DiscountType() {
        return this.discountType;
    }

    abstract executeDiscount(cart: Array<ModelAd>, previousTotal: number): DiscountResult;

    protected static groupTheCart(cart: Array<ModelAd>) {
        return _.groupBy(cart, (ad: ModelAd) => ad.Name);
    }

    protected static ungroupTheCart(grouppedCart) {
        return _.reduce(grouppedCart, function (result, value, key) {
            return _.concat(result, value);
        }, []);
    }
}