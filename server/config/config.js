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
    'username': 'root',
    'password': 'differential_equations',
    'database': 'HousingConnect',
    'connectionLimit': 10
};

const test_db_config = {
    'host': 'localhost',
    'port': 3306,
    'username': 'root',
    'password': 'differential_equations',
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