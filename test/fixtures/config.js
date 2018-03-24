module.exports = {
  "config": {
    "properties": {
      "device_id": {
        "type": "string",
        "title": "Device ID",
        "label": {
          "$ref": "/rpcs/device_ids#thermostats/*/{name}"
        },
        "oneOf": [{
          "$ref": "/rpcs/device_ids#thermostats/*/{device_id}"
        }]
      }
    },
    "required": ["device_id"],
    "disposition": ["device_id"]
  }
}