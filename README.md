machine-uuid
--------

Get machine's hardware UUID.

## Install

npm install machine-uuid

## Basic example

    require("machine-uuid")(function(uuid) {
      console.log(uuid)
    })

## Another example 

You can set the location where you want the `.nodemid` file to be created if the module can't retrieve the serial number.

    require("machine-uuid")(function(uuid) {
      console.log(uuid)
    }, "/another/folder/")

This can example be useful in an [electron](https://github.com/electron/electron) applicatin when you compile your app in asar.

