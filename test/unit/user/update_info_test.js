const chai = require("chai"),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const lit = require('../../../server/utilities/literals');
const _ = require('underscore');

describe('User.updateInfo()', function () {
    let dbm = new DatabaseManager();
    before(function () {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'});
    });
    after(function () {
        return dbm.models_[lit.tables.USERS].findById('12ab3').then(user => {
            return user.destroy();
        });
    });
    it('should update basic user info without error', function () {
        return dbm.getUserById('12ab3').then(user => {
            return user.updateInfo({name: 'New User', email: 'test@gmail.com'});
        }).then(user => {
            user.instance_.get('name').should.equal('New User');
            user.instance_.get('email').should.equal('test@gmail.com');
        });
    });
    it('should update user profile and housing preferences without error', function () {
        return dbm.getUserById('12ab3').then(user => {
            return user.updateInfo({
                year: '1', faculty: 'Engineering', gender: 'Male',
                selfDescription: 'We are we are we are we are we are the engineers'
            });
        }).then(user => {
            return user.instance_.getProfile();
        }).then(profile => {
            profile.get('faculty').should.equal('Engineering');
            profile.get('gender').should.equal('Male');
            profile.get('selfDescription').should
                .equal('We are we are we are we are we are the engineers');
        });
    });
    it('should reject invalid field names', function () {
        return dbm.getUserById('12ab3').then(user => {
            return user.updateInfo({houseType: 'House', housemateGender: 'Female'});
        }).then(user => {
            return user.instance_.getProfile();
        }).then(profile => {
            return profile.getPreference();
        }).then(preference => {
            preference.get('houseType').should.equal('House');
            preference.get('housemateGender').should.equal('Female');
        });
    });
});