
module.exports['id'] = (test)->
  getid = require "../index"
  getid (id1)->
    getid (id2)->
      if not id1 then test.ok(false, "no id")
      console.log "UUID: ", id1
      test.equals( id1, id2, 'same')
      test.done()

