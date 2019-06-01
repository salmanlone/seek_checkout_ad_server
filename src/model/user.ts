import Database from "../utils/database";
const _ = require('lodash');

class UserDb {
    static instance = null;

    constructor() {
        if (!UserDb.instance) {

            const dbDef: Database = new Database(
                process.env.TEST_DB || 'users.json',
                { users: [] }
            );

            UserDb.instance = dbDef.Instance;
        }
    }

    get Instance() {
        return UserDb.instance;
    }
}

export default class User {

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
        let foundUser = User.db.get('users')
            .find({ username: this.username })
            .value();

        if (_.isEmpty(foundUser)) {
            User.db.get('users')
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
        let foundUser = User.db.get('users')
            .find({ username: username, password: password })
            .value();

        if (!_.isEmpty(foundUser)) {
            return new User(foundUser.name, foundUser.username, foundUser.password);
        }

        return false;
    }
}