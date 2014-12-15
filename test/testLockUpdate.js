var locker = require('../lib/Locker'),
    fs = require('fs');

var LOCK_ID = "testLockUpdate.js";

module.exports = {
    setUp: function(callback){
        locker.getLock(LOCK_ID);

        callback();
    },
    tearDown: function(callback){
        locker.unLock(LOCK_ID);

        callback();
    },
    updateLockTest: function(test){
        test.equal(locker.updateLock(LOCK_ID), true, "Couldn't Update Lock");

        test.done();
    },
    autoUpdateTest: function(test){
        test.done();//TODO:
    }
};
