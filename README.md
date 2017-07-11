machine-uuid
--------

Get machine's hardware UUID on supported platform.  If all else fails, then persist a randomly generated uuid in file
$homedir/.nodemid

## Install

npm install machine-uuid

## Basic example

    require("machine-uuid")(function(uuid) {
      console.log(uuid)
    })


