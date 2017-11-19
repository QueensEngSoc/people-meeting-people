const config = require('../config/config').db;
const Sequelize = require('sequelize');

class DatabaseManager {
    constructor(){
        this.connection = new Sequelize(config.database, config.username, config.password, {
            host: config.host,
            port: config.port,
            pool: {
                max: config.connectionLimit
            },
            dialect: 'mysql',
            operatorsAliases: false
        });
        let tables = require('../config/default_tables');
        let thisManager = this;
        let con = this.connection;
        Object.keys(tables).forEach(function (key) {
            let table = tables[key];
            thisManager[table.table_name] = con.define(table.table_name, table.fields);
        })
    }
    sync() {
        this.connection.sync().then(function (result) {
            console.log('database schema updated successfully!')
        });
    }
}

module.exports = new DatabaseManager();