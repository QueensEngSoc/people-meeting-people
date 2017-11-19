const Sequelize = require('sequelize');

const tables = {
    '1': {
        table_name: 'housingPreferences',
        fields: {
            preferenceID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        }
    },
    '2': {
        table_name: 'profiles',
        fields: {
            profileID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            year: {
                type: Sequelize.INTEGER
            },
            faculty: {
                type: Sequelize.ENUM('Engineering', 'Arts and Science', 'Law', 'Education', 'Business',
                    'Grad', 'Health', 'Policy Studies')
            },
            sex: {
                type: Sequelize.ENUM('Male', 'Female')
            },
            description: {
                type: Sequelize.TEXT
            },
            housingPreference: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'housingPreferences',
                    key: 'preferenceID'
                }
            }
        }
    },
    '3': {
        table_name: 'housingGroups',
        fields: {
            groupID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            size: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            spotsFilled: {
                type: Sequelize.INTEGER,
                defaultValue: 1
            },
            filled: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            description: {
                type: Sequelize.TEXT
            }
        }
    },
    '4': {
        table_name: 'studyGroups',
        fields: {
            groupID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            size: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            spotsFilled: {
                type: Sequelize.INTEGER,
                defaultValue: 1
            },
            filled: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            description: {
                type: Sequelize.TEXT
            }
        }
    },
    '5': {
        table_name: 'users',
        fields: {
            netID: {
                type: Sequelize.STRING(10),
                allowNull: false,
                primaryKey: true,
                validate: {
                    isAlphanumeric: true
                }
            },
            name: {
                type: Sequelize.STRING(70),
                allowNull: false,
                validate: {
                    is: /^[a-zA-Z ]+$/i
                }
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            profile: {
                type: Sequelize.INTEGER,
                unique: true,
                references: {
                    model: 'profiles',
                    key: 'profileID'
                }
            },
            housingGroup: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'housingGroups',
                    key: 'groupID'
                }
            },
            studyGroup: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'studyGroups',
                    key: 'groupID'
                }
            }
        }
    },
    '6': {
        table_name: 'userStudyGroupRelations',
        fields: {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userID: {
                type: Sequelize.STRING(10),
                references: {
                    model: 'users',
                    key: 'netID'
                },
                allowNull: false
            },
            studyGroupID: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'studyGroups',
                    key: 'groupID'
                },
                allowNull: false
            },
            relation: {
                type: Sequelize.ENUM('interested', 'applied')
            }
        }
    }
};

module.exports = tables;