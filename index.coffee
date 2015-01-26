
{exec}  = require("child_process")
os      = require("os")
crypto  = require('crypto')

uuid      = undefined

uuidRegex = /\w{8}\-\w{4}\-\w{4}\-\w{4}\-\w{11}/

module.exports = (cb)->

  if uuid then return setImmediate ()->cb(uuid)
  platFormSpecific = {
    'darwin' : osxUuid,
    'win32'  : winUuid,
    'win64'  : winUuid,
    'linux'  : linuxUuid
  }
  platformGetUuid = platFormSpecific[os.platform()]
  if platformGetUuid
    platformGetUuid (err, id)->
      if (err)
        defaultUuid cb
      else
        cb(uuid = id)
  else
    defaultUuid cb

linuxUuid = (cb)->
  try
    fs = require("fs")
    uuid = fs.readFile "/var/lib/dbus/machine-id", (err, content)->
      cb(err, if content then content.toString())
  catch e
    defaultUuid cb

osxUuid = (cb)->
  exec "ioreg -rd1 -c IOPlatformExpertDevice", (err, stdout, stderr)->
    if err then return cb(err)
    for line in stdout.split("\n") when /IOPlatformUUID/.test(line) and uuidRegex.test(line)
      return cb(null, uuidRegex.exec(line)[0])
    cb(new Error("No match"))

winUuid = (cb)->
  exec "wmic CsProduct Get UUID", (err, stdout, stderr)->
    if err then return cb(err)
    for line in stdout.split("\n") when uuidRegex.test(line)
      return cb(null, uuidRegex.exec(line)[0])
    cb(new Error("No match"))

defaultUuid = (cb)->
  path = require "path"
  fs = require "fs"
  f = path.resolve(__dirname, '.nodemid')
  if fs.existsSync(f)
    cb(fs.readFileSync(f).toString())
  else
    id = require('node-uuid').v1()
    fs.writeFileSync(f, id);
    cb(id)

