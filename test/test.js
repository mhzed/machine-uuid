const machineUuid = require( "..")

let uuid;
module.exports['id'] = function(test) {
  return machineUuid(id1 =>
    machineUuid(function(id2) {
      if (!id1) { test.ok(false, "no id"); }
      uuid = id1
      test.equals(id1, id2, 'same');
      return test.done();
    })
  );
};

module.exports['id.promise'] = function(test) {
  machineUuid().then((id)=>{
    test.equals(id, uuid, 'same');
    test.done();
  })
}