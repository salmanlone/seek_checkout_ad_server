import UserDb from '../utils/user_db';
const _ = require('lodash');

/**
 * @swagger
 * definition:
 *   user:
 *     properties:
 *       name:
 *         type: string
 *       username:
 *         type: string
 */

/**
 * @swagger
 * definition:
 *   customer_create_tupple:
 *     properties:
 *       username:
 *         type: string
 *       name:
 *         type: string
 *       password:
 *         type: string
 */
export default class ModelUser {

    private static db = new UserDb().Instance;
    private name: string;
    private username: string;
    private password: string;

    constructor(name: string, username: string, password: string) {
        this.name = name;
        this.username = username;
        this.password = password;
    }

    get Username() {
        return this.username;
    }

    get Name() {
        return this.name;
    }

    save() {
        let foundUser = ModelUser.db.get('users')
            .find({ username: this.username })
            .value();

        if (_.isEmpty(foundUser)) {
            ModelUser.db.get('users')
                .push({
                    username: this.username,
                    name: this.name,
                    password: this.password
                })
                .write();
            return true;
        }

        throw new Error("User already exists, try logging in instead?");
    }

    static findOne(username, password) {
        let foundUser = ModelUser.db.get('users')
            .find({ username: username, password: password })
            .value();

        if (!_.isEmpty(foundUser)) {
            return new ModelUser(foundUser.name, foundUser.username, foundUser.password);
        }

        return null;
    }
}