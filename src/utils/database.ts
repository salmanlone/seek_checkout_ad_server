import { LowdbSync } from "lowdb";

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const _ = require('lodash');

export default class Database {
    database: LowdbSync<null>;

    constructor(filename: string, defaults: object) {
        this.database = low(new FileSync(filename));
        this.database.defaults(defaults)
            .write();
    }

    get Instance() {
        return this.database;
    }
} 