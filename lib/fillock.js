var fs = require('fs'),
    uuid = require('uuid');

/**
 * Homegrown locking utility, because all the ones that exist suck.
 *  That doesn't mean this one doesn't suck... just sucks less.
 */

function Fillock() {
    var that = this;

    var DEBUG = false;

    //These should be constants.
    var File_Encoding = 'utf-8';
    var File_Default = '.lock';
    var Timeout_Default = 10000; //10 Seconds

    var CurrentState = {
            autoRunning: false,
            timeout: 0,
            drift: 15000,
            autoUpdateProcess: 0,
            UUID: null,
            FILENAME: null
        };

    /**
     * Set the allowed time drift in Millis, this is 15 sec by default.
     *  returns boolean for success. (though it shouldn't ever fail.
     * @param m
     * @returns {boolean}
     */
    this.setDrift = function(m){
        if (typeof(m) === 'number'){
            CurrentState.drift = m;
            return true;
        }
        return false;
    };

    /**
     * Delete your lockfile, you must supply the key to this file. You must be able to access the file (key matches, or timedrift past).
     * @param uuid
     * @param filename
     */
    this.unLock = function(uuid, filename){
        uuid = getUUID(uuid);
        filename = getFileName(filename);

        that.stopAutoUpdate();

        if (fs.existsSync(filename)){
            try {
                var rawFileData = fs.readFileSync(filename, File_Encoding);

                var fileData = JSON.parse(rawFileData);
                logDebugConsole(fileData);

                if (fileData.uuid === uuid || fileData.updated + CurrentState.drift < now()) {
                    fs.unlinkSync(filename);
                }

                return true;
            }catch(e){
                throw new Error(e);
            }
        }

        return false;
    };

    /**
     * Create a new lock, supply a uuid and a filename.
     * @param uuid - This should be a key to identify who owns the lock.
     * @param filename - Since this is a filebased lock, this is the actual lockfile.
     * @returns {boolean} - true: Lock acquired, false: failure.
     */
    this.getLock = function(uuid, filename){
        uuid = getUUID(uuid);
        filename = getFileName(filename);

        if (!fs.existsSync(filename)) {
            var newLockData = { "uuid": uuid, "updated": now() };
            logDebugConsole(newLockData);

            fs.writeFileSync(filename, JSON.stringify(newLockData), File_Encoding);

            return true;

        }else {
            //If we can't create a new lock, lets try to grab the old one based on the drift.
            return that.updateLock(uuid, filename);
        }
    };

    /**
     * Update your lock, keep it within the timedrift to ensure it stays yours.
     * @param uuid
     * @param filename
     * @returns {boolean}
     */
    this.updateLock = function(uuid, filename){
        uuid = getUUID(uuid);
        filename = getFileName(filename);

        if (that.getLock(uuid, filename)) {
            return true;
        }else{

            var rawFileData = fs.readFileSync(filename, File_Encoding);

            var lockData = JSON.parse(rawFileData);
            logDebugConsole(lockData);

            if (lockData.uuid === uuid || lockData.updated + CurrentState.drift < now()){
                lockData.updated = now();

                fs.writeFileSync(filename, JSON.stringify(lockData), File_Encoding);

                return true;
            }
        }

        return false;
    };

    /**
     * Check if we have the lock without making any updates.
     * @param uuid
     * @param filename
     * @returns {boolean}
     */
    this.hasLock = function(uuid, filename){
        uuid = getUUID(uuid);
        filename = getFileName(filename);

        try{
            var rawFileData = fs.readFileSync(filename, File_Encoding);

            var lockData = JSON.parse(rawFileData);
            logDebugConsole(lockData);

            return (lockData.uuid === uuid && lockData.updated + CurrentState.drift > now());

        }catch(e){
            throw new Error(e);

        }
    };

    /**
     * Turn on autoUpdating of lock, *Note* this will only work if there is no blocking in place.
     * @param timeout
     * @param uuid
     * @param filename
     */
    this.startAutoUpdate = function(timeout, uuid, filename){
        uuid = getUUID(uuid);
        filename = getFileName(filename);

        if (!timeout || typeof(timeout) !== 'number') {
            timeout = CurrentState.timeout || Timeout_Default;
        }

        CurrentState.timeout = timeout;
        CurrentState.autoRunning = true;
        autoUpdate(timeout, uuid, filename);
    };

    /**
     * Turn off autoUpdating.
     */
    this.stopAutoUpdate = function(){
        CurrentState.autoRunning = false;

        if (CurrentState.autoUpdateProcess) {
            clearInterval(CurrentState.autoUpdateProcess);
        }
    };

    /**
     * Turn on debug messaging.
     * @param debug
     */
    this.debug = function(debug){
        if (debug)
            DEBUG = debug;
    };

    //Private Functions
    var logDebugConsole = function(msg) {
        if (DEBUG && console) {
            console.log(msg);
        }
    };

    var autoUpdate = function(timeout, uuid, filename){
        uuid = getUUID(uuid);
        filename = getFileName(filename);

        if (CurrentState.autoRunning) {
            logDebugConsole("Firing Automatic Update");
            if (that.updateLock(uuid, filename)) {
                CurrentState.autoUpdateProcess = setTimeout(function () {
                    autoUpdate(timeout, uuid, filename);
                }, timeout);
            } else {
                CurrentState.autoRunning = false;
            }
        }
    };

    var now = function() { return new Date().getTime(); };

    var getUUID = function(id){
        if (typeof(id) === 'string' && id.length > 0) {
            CurrentState.UUID = id;
            return id;
        }

        if (CurrentState.UUID) {
            return CurrentState.UUID;
        }

        CurrentState.UUID = uuid.v1();

        return CurrentState.UUID;
    };

    var getFileName = function(file){
        if (typeof(file) === 'string' && file.length > 0) {
            CurrentState.FILENAME = file;
            return file;
        }

        if (CurrentState.FILENAME) {
            return CurrentState.FILENAME;
        }

        CurrentState.FILENAME = File_Default;

        return CurrentState.FILENAME;
    };
}


module.exports = exports = new Fillock();