var locker = require('../lib/Locker'),
    fs = require('fs');

var LOCK_ID = "testLocker.js";

exports.basicLockTest = function(test){
    test.equal(locker.getLock(LOCK_ID), true, "Couldn't Get Lock");

    test.equal(locker.updateLock(LOCK_ID), true, "Couldn't Update Lock");

    test.equal(locker.unLock(LOCK_ID), true, "Couldn't Unlock");

    test.done();
};

exports.autoUpdateLockTest = function(test){
    test.equal(locker.getLock(LOCK_ID), true, "Couldn't get lock for autoUpdateLockTest");

    locker.startAutoUpdate(2000, LOCK_ID);

    setTimeout(function(){
            test.equal(locker.hasLock(LOCK_ID), true, "Auto Update of lock failed for autoUpdateLockTest");

            test.equal(locker.unLock(LOCK_ID), true, "Couldn't Unlock for autoUpdateLockTest");

            test.done();
        }, 3000);
};

exports.lockFileTest = function(test){
    var LOCK_FILE = ".testLockFile";

    test.equal(locker.getLock(LOCK_ID, LOCK_FILE), true, "Couldn't Get Lock");

    var lockFile = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf-8'));
    test.equal(lockFile.uuid, LOCK_ID, "LOCK Id does not match.");

    test.ok(parseInt(lockFile.updated), "Lock file Updated value invalid.");

    test.equal(locker.unLock(LOCK_ID, LOCK_FILE), true, "Couldn't Unlock");

    test.done();
};

/*
exports.driftChangeTest = function(test){
    var drift = 10;

    locker.setDrift(drift);

    locker.getLock(LOCK_ID);

    setTimeout(function(){
        test.equal(locker.hasLock(LOCK_ID), false, "Drift change failed");

        test.done();
    }, drift*4);
};
*/


//console.log("Updating Lock: " + locker.updateLock());

