/**
 * @fileoverview logging utilities, logs to console during testing and
 * to a log file if in production
 * @author Michael Albinson
 * @modifier astral.cai@queensu.ca (Astral Cai)
 *
 * Adapted from:
 *  https://github.com/essdev-team/forum/blob/master/server/util/log.js
 *  Written by Michael Albinson 11/19/16
 */

"use strict";

const fs = require('fs');
const path = require('path');
const config = require('../config/config');

const isInProduction = config.isInProduction;
const log = isInProduction ? writeToFile : console.log;

exports.log = function (logString) {
    let currentTime = getTime();
    let logThis = currentTime + ": " + logString;
    log(logThis);
};

exports.warn = function(logString) {
    let currentTime = getTime();
    let logThis = currentTime + " WARNING: " + logString;
    log(logThis);
};

exports.error = function(logString) {
    let currentTime = getTime();
    let logThis = currentTime + " ERROR: " + logString;
    log(logThis);
};

exports.severe = function(logString) {
    let currentTime = getTime();
    let logThis = currentTime + " ERROR: **SYSTEM SEVERE** " + logString;
    log(logThis);
};

exports.info = function(logString) {
    let currentTime = getTime();
    let logThis = currentTime + " INFO: " + logString;
    log(logThis);
};

function writeToFile(logString) {
    let currentDate = new Date().toISOString();
    currentDate = currentDate.slice(0, currentDate.indexOf('T'));

    let logFileName = "logs/" + currentDate + ".txt";
    let logFilePath = path.join(__dirname, '..', logFileName);

    openFile(logFilePath, 'a').then((res) => {
        return writeFile(logString, res);
    }).then((res) => {
        fs.close(res, (err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
}

function openFile(filePath, mode) {
    return new Promise((resolve, reject) => {
        fs.open(filePath, mode, (err, fd) => {
            if (err) reject(err);
            else resolve(fd);
        });
    });
}

function writeFile(logString, fd) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fd, logString, (err) => {
            if (err) reject(err);
            else resolve(fd);
        });
    });
}

function getTime() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
}