/**
 * @fileoverview tables for the database and column settings in Sequelize format
 */

const Sequelize = require('sequelize');
const lit = require('../utilities/literals');

const tables = {
  '1': {
    table_name: 'Users',
    fields: {
      'netId': {
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
          is: /^[a-zA-Z -.]+$/i
        }
      },
      'email': {
        type: Sequelize.STRING,
        unique: true,
        validate: {
          isEmail: true
        }
      }
    },
    associations: (models) => {
      let thisModel = models[lit.tables.USERS];
      thisModel.hasOne(models[lit.tables.PROFILES],
        {as: 'profile', foreignKey: 'userId', onDelete: 'cascade'});
      thisModel.belongsTo(models[lit.tables.HOUSING_GROUPS],
        {as: 'housingGroup', foreignKey: 'housingGroupId'});
    }
  },
  '2': {
    table_name: 'Profiles',
    fields: {
      'profileId': {
        type: Sequelize.MEDIUMINT.UNSIGNED,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      'year': {
        type: Sequelize.ENUM,
        values: ['1', '2', '3', '4', '5', 'Grad']
      },
      'faculty': {
        type: Sequelize.ENUM,
        values: ['Engineering', 'Arts and Science', 'Law', 'Education', 'Business',
          'Health', 'Policy Studies']
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
      'sleepHabits': {
        type: Sequelize.ENUM,
        values: ['Early_bird', 'Night_owl']
      },
      'pineappleOnPizza': {
        type: Sequelize.BOOLEAN
      },
      'hotDogIsSandwich': {
        type: Sequelize.BOOLEAN
      }
    },
    associations: (models) => {
      let thisModel = models[lit.tables.PROFILES];
      thisModel.hasOne(models[lit.tables.HOUSING_PREFERENCES],
        {as: 'preference', foreignKey: 'profileId', onDelete: 'cascade'});
    }
  },
  '3': {
    table_name: 'HousingPreferences',
    fields: {
      'preferenceId': {
        type: Sequelize.MEDIUMINT.UNSIGNED,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      'houseType': {
        type: Sequelize.ENUM,
        values: ['House', 'Apartment']
      },
      'co_ed': {
        type: Sequelize.BOOLEAN
      },
      'housemateQualities': {
        type: Sequelize.TEXT
      },
      'rentMinimum': {
        type: Sequelize.MEDIUMINT
      },
      'rentMaximum': {
        type: Sequelize.MEDIUMINT
      }
    }
  },
  '4': {
    table_name: 'HousingGroups',
    fields: {
      'groupId': {
        type: Sequelize.MEDIUMINT.UNSIGNED,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      'size': {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false
      },
      'spotsLeft': {
        type: Sequelize.TINYINT.UNSIGNED,
        defaultValue: 1,
      }
    },
    associations: (models) => {
      let thisModel = models[lit.tables.HOUSING_GROUPS];
      thisModel.hasMany(models[lit.tables.USERS], {as: 'Members', foreignKey: 'housingGroupId'});
      thisModel.belongsTo(models[lit.tables.USERS], {as: 'Initiator', constraints: false});
      thisModel.hasOne(models[lit.tables.HOUSING_GROUP_PROFILES],
        {as: 'groupProfile', foreignKey: 'housingGroupId', onDelete: 'cascade'});
    }
  },
  '5': {
    table_name: 'HousingGroupProfiles',
    fields: {
      'profileId': {
        type: Sequelize.MEDIUMINT.UNSIGNED,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      'description': {
        type: Sequelize.TEXT
      },
      'co_ed': {
        type: Sequelize.BOOLEAN
      },
      'yearConstraint': {
        type: Sequelize.ENUM,
        values: ['Second', 'None']
      }
    }
  }
};

module.exports = tables;