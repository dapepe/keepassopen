KeePass Multi Open
==================

Purpose
-------

Opens multiple KeePass databases with one master password.


Download
--------

You can download the current release on [Dropbox](https://www.dropbox.com/sh/uub06ze62etfr9n/AAB1eJ11auSZbetFY40DonT_a?dl=0)


Building
--------

KeePass Open uses NodeJS and NW.js. To create your own build you will need to
download the current version von NW.js and extract it in `res/nwjs/win32` or
`res/nwjs/win64` depending on your version.

You will also need to install all node and bower dependencies through

    npm install
    bower install
    
After that, you can simply use Grunt to build the dev and release files.
In order to prepare the system, execute the following Grunt task first:

    grunt prepare
    
After that you can simply execute KeePass open trough `grunt run`.

Distribution files for windows are created through

    grunt release-win32
    grunt release-win64

This will also create an NSIS installer file in the `releases` dir.


Copyright
---------

Created by Peter Haider, developed with love in Munich @ ZeyOS, Inc.


License
-------

MIT License