import ModelAd from "../model/ad";
const _ = require('lodash');

export interface DiscountResult {
    cart: ModelAd[];
    currentTotal: number;
    resultModified: boolean;
}

export abstract class BaseDiscount {

    private discountType: string = null;

    constructor(discountType: string) {
        this.discountType = discountType;
    }

    get DiscountType() {
        return this.discountType;
    }

    abstract executeDiscount(cart: ModelAd[], previousTotal: number): DiscountResult;

    protected static groupTheCart(cart: ModelAd[]) {
        return _.groupBy(cart, (ad: ModelAd) => ad.Name);
    }

    protected static ungroupTheCart(grouppedCart) {
        return _.reduce(grouppedCart, function (result, value, key) {
            return _.concat(result, value);
        }, []);
    }
}