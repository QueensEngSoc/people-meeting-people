/**
 * @fileoverview literals for various fields
 */

const tableNames = {
    USERS: 'Users',
    PROFILES: 'Profiles',
    HOUSING_GROUPS: 'HousingGroups',
    HOUSING_PREFERENCES: 'HousingPreferences',
    HOUSING_GROUP_PROFILES: 'HousingGroupProfiles'
};

const fieldNames = {
    // field names for table Users
    USER: {
        ID: 'netId',
        NAME: 'name',
        EMAIL: 'email',
        PROFILE: 'profile',
    },

    // field names for table Profiles
    PROFILE: {
        ID: 'profileId',
        YEAR: 'year',
        FACULTY: 'faculty',
        GENDER: 'gender',
        GENDER_SPECIFIC: 'genderIfOther',
        SELF_DESCRIPTION: 'selfDescription',
    },

    // field names for table HousingGroups
    HOUSING_GROUP: {
        ID: 'groupId',
        SIZE: 'size',
        SPOTS_LEFT: 'spotsLeft',
    },

    // field names for table HousingGroupProfile
    HOUSING_GROUP_PROFILE: {
        ID: 'profileId',
        DESCRIPTION: 'description',
        GENDER: 'genderConstraints',
        YEAR: 'yearConstraints',
    },

    // field names for table HousingPreferences
    HOUSING_PREFERENCE: {
        ID: 'preferenceId',
        HOUSE_TYPE: 'houseType',
        HOUSEMATE_GENDER: 'housemateGender',
        HOUSEMATE_FACULTY: 'housemateFaculty'
    }
};

const literals = {
    // literals for table and field names
    tables: tableNames,
    fields: fieldNames,

    // miscellaneous information
    QUEENS_EMAIL: '@queensu.ca',

    // configuration literals
    DB_HOST: 'host',
    DB_PORT: 'port',
    DB_DATABASE: 'database',
    DB_USERNAME: 'username',
    DB_PASSWORD: 'password',
    DB_CONNECTION_LIMIT: 'connectionLimit'
};

module.exports = literals;

