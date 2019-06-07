import { BaseDiscount, DiscountResult, ParameterValidationResult } from "./base_discount";
import ModelAd from "../model/ad";
const Ajv = require('ajv');
const _ = require("lodash");

interface XForYDiscountParams {
    ad: string;
    xCount: number;
    yCount: number;
}

export default class XForYDiscount extends BaseDiscount {

    private ad: ModelAd = null;
    private xCount: number = null;
    private yCount: number = null;

    static NAME = "x_for_y";

    // Given Uniliver
    // When 3 (xCount) ads are available
    // charge for 2 (yCount)
    constructor(ad: ModelAd, xCount: number, yCount: number) {
        super(XForYDiscount.NAME);
        this.ad = ad;
        this.xCount = xCount;
        this.yCount = yCount;
    }

    static createFromParamsSchema(params: any) {
        let castedParam = params as XForYDiscountParams;

        let foundAd = ModelAd.findOneByName(castedParam.ad);
        if (_.isNull(foundAd)) {
            throw new Error("Ad type not found to create for");
        }

        return new XForYDiscount(
            foundAd,
            castedParam.xCount,
            castedParam.yCount
        );
    }

    static description(): object {
        return {
            name: XForYDiscount.NAME,
            parameters: {
                "ad": "The ad name to apply the rule on (if available)",
                "xCount": "Left hand side for X for Y",
                "yCount": "Right hand side for X for Y"
            },
            exampleText: "Given Uniliver, When 3 (xCount) ads are available, charge for 2 (yCount)"
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
                "xCount": {
                    "type": "integer"
                },
                "yCount": {
                    "type": "integer"
                }
            },
            "required": [
                "ad",
                "xCount",
                "yCount"
            ]
        };
    }

    static parameter_validation(parameters: object): ParameterValidationResult {
        var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        var validate = ajv.compile(XForYDiscount.parameters_schema());
        var valid = validate(parameters);
        if (!valid) {
            return BaseDiscount.raise_error(
                `Rule ${XForYDiscount.NAME} has a different schema, please verify using /rule endpoint`
            );
        }

        let castedParam = parameters as XForYDiscountParams;

        let foundAd = ModelAd.findOneByName(castedParam.ad);
        if (_.isNull(foundAd)) {
            return BaseDiscount.raise_error(
                `Ad ${castedParam.ad} is not available in the system`
            );
        }

        if (castedParam.xCount < castedParam.yCount) {
            return BaseDiscount.raise_error(
                `xCount supplied must be greater than yCount`
            );
        }

        if (castedParam.xCount <= 0 || castedParam.yCount <= 0) {
            return BaseDiscount.raise_error(
                `xCount and yCount must be positive integers`
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

        let formulatedResult: DiscountResult = {
            cart: null,
            currentTotal: previousTotal
        };

        let processed = false;

        // Check if the rule ad name exists
        if (_.has(groupedCart, this.ad.Name)) {
            // Check while the count is appropriate
            while (_.size(groupedCart[this.ad.Name]) >= this.xCount) {
                // Lets reduce the items and return the cart back with the new result
                groupedCart[this.ad.Name] = _.slice(groupedCart[this.ad.Name], this.xCount);
                formulatedResult.currentTotal += this.ad.Price * this.yCount;
            }

            formulatedResult.cart = BaseDiscount.ungroupTheCart(groupedCart);
            processed = true;
        }

        if (!processed) {
            formulatedResult.cart = cart;
        }

        return formulatedResult;
    }
}