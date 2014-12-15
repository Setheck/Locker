var locker = require('../lib/Locker');

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


//console.log("Updating Lock: " + locker.updateLock());

