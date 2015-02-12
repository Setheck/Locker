Fillock
======

Summary
-------
This is a home built locking tool designed to be able to lock outside of the node process.
It uses a lock file to determine how long a lock should persist.
The original use case was that I had a process that I wanted to ensure was only running once.
So I check the lock at startup and exit if it can't grab the lock.

Usage
-----
To use Fillock, there are two main components to keeping track of a lock.
First, a file name which will be used as a location to create a file to be used as the lock itself.
Second, an id is used to determine if this process has the current lock.

This is a very simple paradigm, the example is that you have 4 applications, if A & B are dependent on the same resources
and C & D are also dependent on the same resources (but different resources from A & B) you would think of the lock file as
the designator for the resource, and the id as the designator for the process. In this example you could use
Lock Files ".ResAB" and ".ResCD" and the process letter as the id.
In this manner when A locks ".ResAB", B would be unavailable to lock, but C or D would still be able to get the lock on ".ResCD"

Get a lock
```
/*
 Attempt to get a lock
    id - ID of current process
    lock_file - lock file for specific resources.
    Returns Boolean of whether the lock was acquired.
*/
fillock.getLock(id, lock_file);
```

Update a lock
```
/*
 Attempt to update a lock. *Note this will try to get a lock if one doesn't already exist.
    id - ID of current process
    lock_file - lock file for specific resources.
    Returns Boolean of whether the lock was updated successfully.
*/
fillock.updateLock(id, lock_file);
```

Release a lock
```
/*
 Attempt to release the current lock.
    id - ID of current process
    lock_file - lock file for specific resources.
    Returns Boolean of whether the lock was released successfully.
*/
fillock.unLock(id, lock_file);
```

Start Auto Updating
```
/*
 Turn on Auto Updating, attempt to update the lock at the given timeout automatically.
    timeout - Integer Milliseconds as the update interval
    id - ID of current process
    lock_file - lock file for specific resources.
*/
fillock.startAutoUpdate(timeout, id, lock_file);
```

Stop Auto Updating
```
/*
 Turn off auto updating.
*/
fillock.stopAutoUpdate();
```

Check for Existing Lock
```
/*
 Check if the lock exists for the current process. *Note this will not update or do any modification of the lock.
    id - ID of current process
    lock_file - lock file for specific resources.
    Returns Boolean of whether this process has a lock or not.
*/
fillock.hasLock(id, lock_file);
```

Author
------
Seth Thompson

Change Log
----------
v0.0.1 - First Commit - 12/15/2014
v0.0.2 - Rename to fillock for publish to npm - 02/12/2015