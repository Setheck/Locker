var fillock = require('../lib/fillock');

var LOCK_ID = "testLockUpdate.js";
var LOCK_FILE = "testLockUpdate.lock";

module.exports = {
    setUp: function(callback){
        fillock.getLock(LOCK_ID, LOCK_FILE);

        callback();
    },
    tearDown: function(callback){
        fillock.unLock(LOCK_ID, LOCK_FILE);

        callback();
    },
    updateLockTest: function(test){
        test.equal(fillock.updateLock(LOCK_ID, LOCK_FILE), true, "Couldn't Update Lock");

        test.done();
    },
    autoUpdateTest: function(test){
        test.done();//TODO:
    }
};
