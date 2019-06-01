const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

export default class Database {
    database;

    constructor(filename: string, defaults: object) {
        this.database = low(new FileSync(filename));
        this.database.defaults(defaults)
            .write();
    }

    get Instance() {
        return this.database;
    }
}