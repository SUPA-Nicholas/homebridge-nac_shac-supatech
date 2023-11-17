Homebridge NAC/SHAC Plugin
================

Homebridge NAC/SHAC Plugin is a plug-in for [Homebridge](https://github.com/homebridge/homebridge)
that adds support for the original Clipsal C-Bus NAC/SHAC.

Support following device types:
Relay
Dimmer
Blind

IMPORTANT
---------

This plug-in is a simple working version and not ready for a large scale CBUS network at the moment.

If you want to try this plug-in, you should run it in a child bridge to avoid slowing down the performance for your main bridge.

NAC/SHAC Setup
--------------

The plug-in is recognising the device type by looking at the keywords for each device.

Supporting keywords:
Relay
Dimmer
Blind

Installation
------------

You can install the plug-in using `npm`:

`sudo npm install -g homebridge-nac_shac-supatech`

Configuration
-------------

*homebridge-nac_shac-supatech* is added as a `platform` in your config.json:

```JSON
"platforms": [
  {
  "platform": "homebridge-nac_shac-supatech",
  "name": "NAC/SHAC",
  "wiserAddress": "1.2.3.4",
  "wiserUsername": "admin",
  "wiserPassword": "yourpassword",
  "wiserPort": "443",
}
]
```