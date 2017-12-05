# Server-Side Setup
1. Download and install MySQL.
2. Add the following file to your '/server/config/' directory as 'config.js'

```
const modes = {
    'PRODUCTION': 0,
    'TESTING': 1,
    'DEVELOPMENT': 2
};

const currentMode = modes.DEVELOPMENT;

const dev_server_config = {
    'host': 'localhost',
    'port': 4000
};

const test_server_config = {
    'host': 'localhost',
    'port': 4000
};

const dev_db_config = {
    'host': 'localhost',
    'port': 3306,
    'username': YOUR_MYSQL_USERNAME_HERE,
    'password': YOUR_MYSQL_PASSWORD_HERE,
    'database': 'HousingConnect',
    'connectionLimit': 10
};

const test_db_config = {
    'host': 'localhost',
    'port': 3306,
    'username': YOUR_MYSQL_USERNAME_HERE,
    'password': YOUR_MYSQL_PASSWORD_HERE,
    'database': 'test',
    'connectionLimit': 10
};

const production_server_config = {};

const production_db_config = {};

let isInProduction = false;
switch (currentMode) {
    case modes.PRODUCTION:
        exports.server_config = production_server_config;
        exports.db_config = production_db_config;
        isInProduction = true;
        break;
    case modes.DEVELOPMENT:
        exports.server_config = dev_server_config;
        exports.db_config = dev_db_config;
        break;
    case modes.TESTING:
        exports.server_config = test_server_config;
        exports.db_config = test_db_config;
}

exports.isInProduction = isInProduction;
exports.server_config = isInProduction ? production_server_config : dev_server_config;
exports.db_config = isInProduction ? production_db_config : dev_db_config;
```
3. Make sure the Node.js on your device is up to date.
4. Make sure you have npm installed.
5. Navigate to the main directory where 'package.json' is located, and run `npm install`
6. With a MySQL instance running on your device, run 'setup.js' in '/server/'.
