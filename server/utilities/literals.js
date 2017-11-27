/**
 * @fileoverview literals for various fields
 */

const tableNames = {
    USERS: 'Users',
    PROFILES: 'Profiles',
    HOUSING_GROUPS: 'HousingGroups',
    HOUSING_PREFERENCES: 'HousingPreferences',
    HOUSING_APPLICATIONS: 'HousingApplications'
};

const fieldNames = {
    // field names for table Users
    USER_ID: 'netID',
    USER_NAME: 'name',
    USER_EMAIL: 'email',
    USER_PROFILE: 'profile',
    USER_HOUSING_GROUP: 'housingGroup',

    // field names for table Profiles
    PROFILE_ID: 'profileID',
    PROFILE_YEAR: 'year',
    PROFILE_FACULTY: 'faculty',
    PROFILE_GENDER: 'gender',
    PROFILE_GENDER_SPECIFIC: 'genderIfOther',
    PROFILE_SELF_DESCRIPTION: 'selfDescription',
    PROFILE_HOUSING_PREFERENCE: 'housingPreferences',

    // field names for table HousingGroups
    HOUSING_GROUP_ID: 'groupID',
    HOUSING_GROUP_SIZE: 'size',
    HOUSING_GROUP_SPOTSFILLED: 'spotsFilled',
    HOUSING_GROUP_FULL: 'full',
    HOUSING_GROUP_DESCRIPTION: 'description',

    // field names for table HousingPreferences
    HOUSING_PREFERENCE_ID: 'preferenceID',

    // field names for table HousingApplications
    HOUSING_APPLICATION_ID: 'applicationID',
    HOUSING_APPLICATION_USER: 'userID',
    HOUSING_APPLICATION_GROUP: 'groupID',
    HOUSING_APPLICATION_MESSAGE: 'message'
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

