
const {exec} = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const UUID = require('uuid');
let uuid;

const uuidRegex = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;

let defaultUuidFolder = os.homedir();

module.exports = function(cb) {
  if (cb === undefined) {
    return new Promise((resolve, reject)=>{
      machineUuid(resolve);
    })
  } 
  else machineUuid(cb);
}

function machineUuid(cb) {
  if (uuid) { return setImmediate(() => cb(uuid)); }
  const platFormSpecific = {
    'darwin': osxUuid,
    'win32': winUuid,
    'win64': winUuid,
    'linux': linuxUuid
  };
  const platformGetUuid = platFormSpecific[os.platform()];
  if (platformGetUuid) {
    return platformGetUuid(function(err, id) {
      if (err) {
        return defaultUuid(cb);
      } else {
        return cb(uuid = id);
      }
    });
  } else {
    return defaultUuid(cb);
  }
};

var linuxUuid = function(cb) {
  try {
    
    uuid = fs.readFile("/var/lib/dbus/machine-id", function(err, content) {
      if (content) {  // clean, add - and remove whitespace
        uuid = content.toString().replace(/\s+/, '');
        if ((!/-/.test(uuid)) && (uuid.length > 20)) {
          uuid = uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20);
        }
      }

      return cb(err, content ? uuid : undefined);
    });
  } catch (e) {
    return defaultUuid(cb);
  }
};

var osxUuid = cb =>
  exec("ioreg -rd1 -c IOPlatformExpertDevice", function(err, stdout, stderr) {
    if (err) { return cb(err); }
    for (let line of Array.from(stdout.split("\n"))) {
      if (/IOPlatformUUID/.test(line) && uuidRegex.test(line)) {
        return cb(null, uuidRegex.exec(line)[0]);
      }
    }
    return cb(new Error("No match"));
  })
;

var winUuid = cb =>
  exec("wmic CsProduct Get UUID", function(err, stdout, stderr) {
    if (err) { return cb(err); }
    for (let line of Array.from(stdout.split("\n"))) {
      if (uuidRegex.test(line)) {
        return cb(null, uuidRegex.exec(line)[0]);
      }
    }
    return cb(new Error("No match"));
  })
;

var defaultUuid = function(cb) {
  const f = path.resolve(defaultUuidFolder, '.nodemid');
  if (fs.existsSync(f)) {
    return cb(fs.readFileSync(f).toString());
  } else {
    const id = UUID.v1();
    fs.writeFileSync(f, id);
    return cb(id);
  }
};

