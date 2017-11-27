/**
 * @fileoverview tables and their columns
 */

const Sequelize = require('sequelize');

const tables = {
    '1': {
        table_name: 'HousingPreferences',
        fields: {
            'preferenceID': {
                type: Sequelize.MEDIUMINT.UNSIGNED,
                allowNull: true,
                primaryKey: true,
                autoIncrement: true
            }
        }
    },
    '2': {
        table_name: 'Profiles',
        fields: {
            'profileID': {
                type: Sequelize.MEDIUMINT.UNSIGNED,
                allowNull: true,
                primaryKey: true,
                autoIncrement: true
            },
            'year': {
                type: Sequelize.ENUM,
                values: ['1', '2', '3', '4', '5', 'Grad'],
                allowNull: false
            },
            'faculty': {
                type: Sequelize.ENUM,
                values: ['Engineering', 'Arts and Science', 'Law', 'Education', 'Business',
                    'Health', 'Policy Studies'],
                allowNull: false
            },
            'gender': {
                type: Sequelize.ENUM,
                values: ['Male', 'Female', 'Other']
            },
            'genderIfOther': {
                type: Sequelize.STRING
            },
            'selfDescription': {
                type: Sequelize.TEXT
            },
            'housingPreference': {
                type: Sequelize.MEDIUMINT.UNSIGNED,
                references: {
                    model: 'HousingPreferences',
                    key: 'preferenceID'
                }
            }
        }
    },
    '3': {
        table_name: 'HousingGroups',
        fields: {
            'groupID': {
                type: Sequelize.MEDIUMINT.UNSIGNED,
                allowNull: true,
                primaryKey: true,
                autoIncrement: true
            },
            'size': {
                type: Sequelize.TINYINT.UNSIGNED,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            'spotsFilled': {
                type: Sequelize.TINYINT.UNSIGNED,
                defaultValue: 1
            },
            'full': {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            'description': {
                type: Sequelize.TEXT
            }
        }
    },
    '4': {
        table_name: 'Users',
        fields: {
            'netID': {
                type: Sequelize.STRING(10),
                allowNull: false,
                primaryKey: true,
                validate: {
                    isAlphanumeric: true
                }
            },
            'name': {
                type: Sequelize.STRING(80),
                allowNull: false,
                validate: {
                    is: /^[a-zA-Z ]+$/i
                }
            },
            'email': {
                type: Sequelize.STRING,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            'profile': {
                type: Sequelize.MEDIUMINT.UNSIGNED,
                references: {
                    model: 'Profiles',
                    key: 'profileID'
                }
            },
            'housingGroup': {
                type: Sequelize.MEDIUMINT.UNSIGNED,
                references: {
                    model: 'HousingGroups',
                    key: 'groupID'
                }
            }
        }
    },
    '5': {
        table_name: 'HousingApplications',
        fields: {
            'applicationID': {
                type: Sequelize.MEDIUMINT.UNSIGNED,
                allowNull: true,
                primaryKey: true,
                autoIncrement: true
            },
            'userID': {
                type: Sequelize.STRING(10),
                references: {
                    model: 'Users',
                    key: 'netID'
                }
            },
            'groupID': {
                type: Sequelize.MEDIUMINT.UNSIGNED,
                references: {
                    model: 'HousingGroups',
                    key: 'groupID'
                }
            },
            'message': {
                type: Sequelize.TEXT
            }
        }
    }
};

module.exports = tables;