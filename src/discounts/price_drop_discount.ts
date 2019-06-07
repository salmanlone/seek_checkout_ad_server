import { BaseDiscount, DiscountResult, ParameterValidationResult } from "./base_discount";
import ModelAd from "../model/ad";
const Ajv = require('ajv');
const _ = require('lodash');

interface PriceDropDiscountParams {
    ad: string;
    discountedPrice: number;
    countOrMore: number;
}

export default class PriceDropDiscount extends BaseDiscount {

    private ad: ModelAd = null;
    private discountedPrice: number = null;
    private countOrMore: number = null;

    static NAME = "price_drop";

    constructor(ad: ModelAd, discountedPrice: number, countOrMore: number = 0) {
        super(PriceDropDiscount.NAME);
        this.ad = ad;
        this.discountedPrice = discountedPrice;
        this.countOrMore = countOrMore;
    }

    static createFromParamsSchema(params: any) {
        let castedParam = params as PriceDropDiscountParams;

        let foundAd = ModelAd.findOneByName(castedParam.ad);
        if (_.isNull(foundAd)) {
            throw new Error("Ad type not found to create for");
        }

        return new PriceDropDiscount(
            foundAd,
            castedParam.discountedPrice,
            castedParam.countOrMore
        );
    }

    static description(): object {
        return {
            name: PriceDropDiscount.NAME,
            parameters: {
                "ad": "The ad name to apply the rule on (if available)",
                "discountedPrice": "To apply the discounted price, instead of the real price",
                "countOrMore": "Limit on the number of supplied ad types (as in if ad type in cart is 4 or more)"
            }
        }
    }

    static parameters_schema(): object {
        return {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "ad": {
                    "type": "string"
                },
                "discountedPrice": {
                    "type": "number"
                },
                "countOrMore": {
                    "type": "integer"
                }
            },
            "required": [
                "ad",
                "discountedPrice",
                "countOrMore"
            ]
        };
    }

    static parameter_validation(parameters: object): ParameterValidationResult {
        var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        var validate = ajv.compile(PriceDropDiscount.parameters_schema());
        var valid = validate(parameters);
        if (!valid) {
            return BaseDiscount.raise_error(
                `Rule ${PriceDropDiscount.NAME} has a different schema, please verify using /rule endpoint`
            );
        }

        let castedParam = parameters as PriceDropDiscountParams;

        let foundAd = ModelAd.findOneByName(castedParam.ad);
        if (_.isNull(foundAd)) {
            return BaseDiscount.raise_error(
                `Ad ${castedParam.ad} is not available in the system`
            );
        }

        if (castedParam.countOrMore < 0) {
            return BaseDiscount.raise_error(
                `Cannot process the ad count that is below zero`
            );
        }

        return {
            valid: true,
            validation_result: {

            }
        };
    }

    executeDiscount(cart: Array<ModelAd>, previousTotal: number): DiscountResult {
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
                    currentTotal: previousTotal + calcPrice
                };
                return formulatedResult;
            }
        }

        return {
            cart: cart,
            currentTotal: previousTotal
        };
    }
}