import { expect } from 'chai';

const Dicsounts = require("../src/discounts/index").default;
const PriceDropDiscount = require("../src/discounts/price_drop_discount").default;
const XForYDiscount = require("../src/discounts/x_for_y_discount").default;

const ModelAd = require("../src/model/ad").default;

// Some Ads
const classicAd = new ModelAd("classic", 269.99, "dollar");
const standoutAd = new ModelAd("standout", 322.99, "dollar");
const premiumAd = new ModelAd("premium", 394.99, "dollar");

describe('Discount mechanism', function () {
    it('checks the case for Unilever', function () {

        let discounts = new Dicsounts([
            new XForYDiscount(
                classicAd, 3, 2
            )
        ]);

        let result = discounts.apply(
            [
                classicAd,
                classicAd,
                classicAd,
                premiumAd
            ]
        );
        expect(result.currentTotal).to.be.eq(934.97);
    });

    it('checks the case for Apple', function () {

        let discounts = new Dicsounts([
            new PriceDropDiscount(
                standoutAd,
                299.99
            )
        ]);

        let result = discounts.apply(
            [
                standoutAd,
                standoutAd,
                standoutAd,
                premiumAd
            ]
        );

        expect(result.currentTotal).to.be.eq(1294.96);
    });

    it('checks the case for Nike', function () {

        let discounts = new Dicsounts([
            new PriceDropDiscount(
                premiumAd,
                379.99,
                4
            )
        ]);

        let result = discounts.apply(
            [
                premiumAd,
                premiumAd,
                premiumAd,
                premiumAd
            ]
        );

        expect(result.currentTotal).to.be.eq(1519.96);
    });

    it('checks the case for Default', function () {

        let discounts = new Dicsounts([]);

        let result = discounts.apply(
            [
                classicAd,
                standoutAd,
                premiumAd
            ]
        );

        expect(result.currentTotal).to.be.eq(987.97);
    });

    it('checks the case for Ford', function () {

        let discounts = new Dicsounts([
            new XForYDiscount(
                classicAd, 5, 4
            ),
            new PriceDropDiscount(
                standoutAd,
                309.99
            ),
            new PriceDropDiscount(
                premiumAd,
                389.99,
                3
            ),
        ]);

        let result = discounts.apply(
            [
                // 1079.96
                classicAd,
                classicAd,
                classicAd,
                classicAd,
                classicAd,
                // 619.98
                standoutAd,
                standoutAd,
                // 1169.97
                premiumAd,
                premiumAd,
                premiumAd
            ]
        );

        expect(result.currentTotal).to.be.eq(2869.91);
    });
});