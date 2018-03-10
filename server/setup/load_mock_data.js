'use strict';

const DatabaseManager = require('../database/database_manager');

module.exports = function () {
  return new Promise((resolve, reject) => {
    let dbm = new DatabaseManager();
    dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(user => {
      return user.updateInfo({
        selfDescription: "I'm a second year engineering student",
        year: 2,
        faculty: 'Engineering',
        gender: 'Male',
        houseType: 'House',
        co_ed: true,
        housemateQualities: 'Clean and quiet',
        rentMinimum: 400,
        rentMaximum: 700,
        sleep_Habits: 'Early_bird',
        pineappleOnPizza: true,
        hotDogIsSandwich: true
      }).then(() => {
        return dbm.createUser({netId: '12ab4', name: 'Second User', email: '12ab4@queensu.ca'});
      })
    }).then(user => {
      return user.updateInfo({
        selfDescription: "I'm a third year artsci student",
        year: 2,
        faculty: 'Arts and Science',
        gender: 'Female',
        houseType: 'Apartment',
        co_ed: false,
        housemateQualities: 'fun and good at cooking',
        rentMinimum: 500,
        rentMaximum: 800,
        sleep_Habits: 'Early_bird',
        pineappleOnPizza: false,
        hotDogIsSandwich: true
      });
    }).then(() => {
      return resolve('mock data loaded');
    }).catch(err => {
      return reject(err);
    })
  });
};