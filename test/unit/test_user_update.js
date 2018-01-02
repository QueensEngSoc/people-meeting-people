const expect = require('chai').expect;
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');
const User = require('../../server/database/user');

describe('updating user info', () => {
    let dbm = new DatabaseManager();
    before((done) => {
        dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(() => {
            done();
        }).catch(console.log);
    });
    it('should update basic user info without error', () => {
        return new Promise((resolve, reject) => {
            dbm.getUser('12ab3').then(result => {
                return result.updateInfo({name: 'Old User', email: 'test@gmail.com'});
            }).then((user) => {
                expect(user.instance_.get('name')).to.equal('Old User');
                expect(user.instance_.get('email')).to.equal('test@gmail.com');
                resolve();
            }).catch(reject);
        });
    });
    it('should add new profile to user without error', () => {
        return new Promise((resolve, reject) => {
            dbm.getUser('12ab3').then(result => {
                return result.updateInfo({
                    year: '1', faculty: 'Engineering', gender: 'Male',
                    selfDescription: 'We are we are we are we are we are the engineers'
                }).then(user => {
                    return user.instance_.getProfile();
                }).then(profile => {
                    expect(profile.get('faculty')).to.equal('Engineering');
                    expect(profile.get('gender')).to.equal('Male');
                    expect(profile.get('selfDescription')).to
                        .equal('We are we are we are we are we are the engineers');
                    resolve();
                }).catch(reject);
            });
        });
    });
    it('should update user profile without error', () => {
        return new Promise((resolve, reject) => {
            dbm.getUser('12ab3').then(result => {
                return result.updateInfo({
                    year: '2', faculty: 'Arts and Science', gender: 'Female'
                }).then(user => {
                    return user.instance_.getProfile();
                }).then(profile => {
                    expect(profile.get('year')).to.equal('2');
                    expect(profile.get('faculty')).to.equal('Arts and Science');
                    expect(profile.get('gender')).to.equal('Female');
                    resolve();
                }).catch(reject);
            });
        });
    });
    it('should update user housing preference without error', () => {
        return new Promise((resolve, reject) => {
            dbm.getUser('12ab3').then(result => {
                return result.updateInfo({houseType: 'House', housemateGender: 'Female'});
            }).then(user => {
                return user.instance_.getProfile();
            }).then(profile => {
                return profile.getPreference();
            }).then(preference => {
                expect(preference.get('houseType')).to.equal('House');
                expect(preference.get('housemateGender')).to.equal('Female');
                resolve();
            }).catch(reject);
        });
    });
    after((done) => {
        dbm.getUser('12ab3').then(result => {
            return result.destroy();
        }).then(() => {
            done();
        });
    });
});