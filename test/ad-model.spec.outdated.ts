import { expect, assert } from 'chai';
const fs = require('fs');
const path = require('path');
const randomstring = require("randomstring");
process.env.TEST_DB = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
});

const Ad = require("./../src/model/ad").default;

describe('Ad model', function () {

    beforeEach(function (done) {
        fs.unlink(
            path.join(__dirname, '..', process.env.TEST_DB),
            () => done()
        );
    });

    afterEach(function (done) {
        fs.unlink(
            path.join(__dirname, '..', process.env.TEST_DB),
            () => done()
        );
    });

    describe('Creates a ad without saving', function () {
        let ad = new Ad("classic", "Classic Ad", "239.99");
        it("should have correct name", function () {
            expect(ad.Name).to.be.equal("Classic Ad");
        });

        it("should have correct price", function () {
            expect(ad.price).to.be.equal("239.99");
        });

        // it("should not persist the user", function () {
        //     expect(ad.findOne("classic")).to.be.null;
        // });
    });

    // describe('Creates a ad persisting it', function () {
    //     let ad = new Ad("classic", "Classic Ad", "239.99");
    //     ad.save();

    //     it("should find the ad from database", function () {
    //         let foundAd = ad.findOne("classic");
    //         expect(foundAd.Name).to.be.equal(ad.Name);
    //         expect(foundAd.Username).to.be.equal(ad.Username);
    //     });
    // });
});