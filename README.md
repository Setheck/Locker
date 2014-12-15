Locker
======

Summary
-------
This is a home built locking tool designed to be able to lock outside of the node process.
It uses a lock file to determine how long a lock should persist.
The original use case was that I had a process that I wanted to ensure was only running once.
So I check the lock at startup and exit if it can't grab the lock.

Usage
-----


Author
------
Seth Thompson