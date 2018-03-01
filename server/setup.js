/**
 * @fileoverview setup code for the server
 * @author astral.cai@queensu.ca (Astral Cai)
 */

"use strict";

const dbsetup = require('./setup/db_setup');
const log = require('./utilities/log');

setup().then(() => {
  log.log("setup completed!");
}).catch((err) => {
  log.error(err);
});

function setup() {
  return new Promise((resolve, reject) => {
    dbsetup().then(res => {
      log.log(res);
      return load_data();
    }).then(res => {
      log.log(res);
    }).catch(reject);
  });
}