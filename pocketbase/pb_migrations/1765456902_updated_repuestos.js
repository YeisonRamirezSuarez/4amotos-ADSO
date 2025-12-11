/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_590519246")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number380223906",
    "max": null,
    "min": null,
    "name": "precio",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_590519246")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number380223906",
    "max": null,
    "min": null,
    "name": "precio",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
