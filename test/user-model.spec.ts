import { expect, assert } from 'chai';
const fs = require('fs');
const path = require('path');
const randomstring = require("randomstring");
process.env.TEST_DB = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
});

const User = require("./../src/model/user").default;

describe('User model', function () {

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

    describe('Creates a user without saving', function () {
        let user = new User("Salman NE", "salman-ne", "pass1");
        it("should have correct name", function () {
            expect(user.Name).to.be.equal("Salman NE");
        });

        it("should have correct username", function () {
            expect(user.Username).to.be.equal("salman-ne");
        });

        it("should not persist the user", function () {
            expect(User.findOne("salman-ne", "pass1")).to.be.false;
        });
    });

    describe('Creates a user persisting it', function () {
        let user = new User("Salman", "salman", "pass1");
        user.save();

        it("should find the user from database", function () {
            let foundUser = User.findOne("salman", "pass1");
            expect(foundUser.Name).to.be.equal(user.Name);
            expect(foundUser.Username).to.be.equal(user.Username);
        });
    });
});