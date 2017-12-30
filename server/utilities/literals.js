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
    USER_ID: 'netId',
    USER_NAME: 'name',
    USER_EMAIL: 'email',

    // field names for table Profiles
    PROFILE_ID: 'profileId',
    PROFILE_YEAR: 'year',
    PROFILE_FACULTY: 'faculty',
    PROFILE_GENDER: 'gender',
    PROFILE_GENDER_SPECIFIC: 'genderIfOther',
    PROFILE_SELF_DESCRIPTION: 'selfDescription',

    // field names for table HousingGroups
    HOUSING_GROUP_ID: 'groupId',
    HOUSING_GROUP_SIZE: 'size',
    HOUSING_GROUP_SPOTSFILLED: 'spotsLeft',

    // field names for table HousingGroupProfile
    HOUSING_GROUP_PROFILE_ID: 'profileId',
    HOUSING_GROUP_PROFILE_DESCRIPTION: 'description',
    HOUSING_GROUP_PROFILE_GENDER: 'genderConstraints',
    HOUSING_GROUP_PROFILE_YEAR: 'yearConstraints',

    // field names for table HousingPreferences
    HOUSING_PREFERENCE_ID: 'preferenceId',
    HOUSING_PREFERENCE_HOUSETYPE: 'houseType',
    HOUSING_PREFERENCE_HOUSEMATEGENDER: 'housemateGender',
    HOUSING_PREFERENCE_HOUSEMATEFACULTY: 'housemateFaculty'
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

