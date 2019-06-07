import ModelAd from "../model/ad";
const _ = require('lodash');

export interface DiscountResult {
    cart: Array<ModelAd>;
    currentTotal: number;
}

export interface ParameterValidationResult {
    valid: boolean;
    validation_result: object;
}

export abstract class BaseDiscount {

    private discountType: string = null;
    static NAME = "base_discount";

    constructor(discountType: string) {
        this.discountType = discountType;
    }

    get DiscountType() {
        return this.discountType;
    }

    abstract executeDiscount(cart: Array<ModelAd>, previousTotal: number): DiscountResult;

    // Describes the discount rule
    static description(): object {
        return {};
    }

    static parameters_schema(): object {
        return {};
    }

    static raise_error(errorMsg): ParameterValidationResult {
        return {
            valid: false,
            validation_result: {
                message: errorMsg
            }
        };
    }

    static parameter_validation(parameters: object): ParameterValidationResult {
        return {
            valid: true,
            validation_result: {

            }
        };
    }

    protected static groupTheCart(cart: Array<ModelAd>) {
        return _.groupBy(cart, (ad: ModelAd) => ad.Name);
    }

    protected static ungroupTheCart(grouppedCart) {
        return _.reduce(grouppedCart, function (result, value, key) {
            return _.concat(result, value);
        }, []);
    }
}