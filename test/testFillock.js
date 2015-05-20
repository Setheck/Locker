var fillock = require('../lib/fillock'),
    fs = require('fs');

var LOCK_ID = "testFillock.js";
//fillock.debug(true);

exports.basicLockTest = function(test){
    test.equal(fillock.getLock(LOCK_ID), true, "Couldn't Get Lock");

    test.equal(fillock.updateLock(LOCK_ID), true, "Couldn't Update Lock");

    test.equal(fillock.unLock(LOCK_ID), true, "Couldn't Unlock");

    test.done();
};

exports.basicDefaultsLockTest = function(test){
    test.equal(fillock.getLock(), true, "Couldn't Get Lock");

    test.equal(fillock.updateLock(), true, "Couldn't Update Lock");

    test.equal(fillock.unLock(), true, "Couldn't Unlock");

    test.done();
};

exports.multiLockTest = function(test) {
    var lockA_ID = "A";
    var lockA_File = "A.lock";

    var lockB_ID = "B";
    var lockB_File = "B.lock";

    fillock.getLock(lockA_ID, lockA_File);

    fillock.getLock(lockB_ID, lockB_File);

    test.equal(fillock.hasLock(lockA_ID, lockA_File), true, "Lock A failed");
    test.equal(fillock.hasLock(lockB_ID, lockB_File), true, "Lock B failed");

    fillock.unLock(lockA_ID, lockA_File);
    fillock.unLock(lockB_ID, lockB_File);

    test.done();
};

exports.autoUpdateLockTest = function(test){
    test.equal(fillock.getLock(LOCK_ID), true, "Couldn't get lock for autoUpdateLockTest");

    fillock.startAutoUpdate(2000, LOCK_ID);
    fillock.setDrift(1500);

    setTimeout(function(){
            test.equal(fillock.hasLock(LOCK_ID), true, "Auto Update of lock failed for autoUpdateLockTest");

            test.equal(fillock.unLock(LOCK_ID), true, "Couldn't Unlock for autoUpdateLockTest");

            test.done();
        }, 3000);
};

exports.lockFileTest = function(test){
    var LOCK_FILE = "lockfile.lock";

    test.equal(fillock.getLock(LOCK_ID, LOCK_FILE), true, "Couldn't Get Lock");

    var lockFile = JSON.parse(fs.readFileSync(LOCK_FILE, 'utf-8'));
    test.equal(lockFile.uuid, LOCK_ID, "LOCK Id does not match.");

    test.ok(parseInt(lockFile.updated), "Lock file Updated value invalid.");

    test.equal(fillock.unLock(LOCK_ID, LOCK_FILE), true, "Couldn't Unlock");

    test.done();
};

exports.driftChangeTest = function(test){
    var drift = 10;

    fillock.setDrift(drift);

    fillock.getLock(LOCK_ID);

    setTimeout(function(){
        test.equal(fillock.hasLock(LOCK_ID), false, "Drift change failed");

        test.equal(fillock.unLock(LOCK_ID), true, "Couldn't Unlock");

        test.done();
    }, drift*4);
};

exports.lockExpireTest = function(test){
    var LOCK_FILE = "lockExpireTest.lock";
    var LOCK_ID_ONE = "ONE";
    var LOCK_ID_TWO = "TWO";
    var drift = 10;

    fillock.setDrift(drift);

    test.equal(fillock.getLock(LOCK_ID_ONE, LOCK_FILE), true, "Couldn't Get Lock");

    setTimeout(function(){
        test.equal(fillock.getLock(LOCK_ID_TWO, LOCK_FILE), true, "Failed to replace lock");

        test.equal(fillock.unLock(LOCK_ID_TWO), true, "Couldn't Unlock");

        test.done();
    }, drift * 4);
};

exports.lockExpireFailure = function(test){
    var LOCK_FILE = "lockExpireTest.lock";
    var LOCK_ID_ONE = "ONE";
    var LOCK_ID_TWO = "TWO";
    var drift = 10;

    fillock.setDrift(drift);

    test.equal(fillock.getLock(LOCK_ID_ONE, LOCK_FILE), true, "Couldn't Get Lock");

    test.equal(fillock.getLock(LOCK_ID_TWO, LOCK_FILE), false, "Got Unintended Lock");

    test.equal(fillock.unLock(LOCK_ID_ONE), true, "Couldn't Unlock");

    test.done();
};


//console.log("Updating Lock: " + fillock.updateLock());

