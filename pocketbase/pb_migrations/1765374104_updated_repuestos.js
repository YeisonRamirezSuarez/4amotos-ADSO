/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_590519246")

  // remove field
  collection.fields.removeById("relation1309676077")

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2687480828",
    "hidden": false,
    "id": "relation1598354026",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "categoria2",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_590519246")

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation1309676077",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "categoria",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("relation1598354026")

  return app.save(collection)
})
