var fillock = require('../lib/fillock');

var LOCK_ID = "testLockUpdate.js";

module.exports = {
    setUp: function(callback){
        fillock.getLock(LOCK_ID);

        callback();
    },
    tearDown: function(callback){
        fillock.unLock(LOCK_ID);

        callback();
    },
    updateLockTest: function(test){
        test.equal(fillock.updateLock(LOCK_ID), true, "Couldn't Update Lock");

        test.done();
    },
    autoUpdateTest: function(test){
        test.done();//TODO:
    }
};
