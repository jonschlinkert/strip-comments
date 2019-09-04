window.amino_cec_callback = function (tag, source, destination, body) {
    debug("///////////// cec_callback ////////////////////");
    debug(tag + " " + source + " " + destination + " " + body);
    debug("///////////// cec_callback ////////////////////");
};

const foo = {
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
};