import { Logger } from 'homebridge';
import axios from 'axios';
import { Agent } from 'https';

import { urlElement, AccessoryAddress, Device, deviceStatus } from './model';

export async function getDevices(url: urlElement, log: Logger) {
  const cmd = `https://${url.Username}:${url.Password}@${url.IPAddress}:${url.portNumber}/api/cac/objs`;
  log.debug(cmd);

  const devices: Device[] = [];

  log.debug('Trying to get devices list...');
  await axios.get(cmd, {
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  }).then((response) => {
    log.debug(response.data);
    log.info('Trying to filter devices...');
    response.data.forEach((device) => {
      const address: string[] = device.address.split('/');
      if (address.length === 3 && device.tags.length !== 0) {
        log.debug(device);
        devices.push(new Device(device.cbustagmap.group,
          new AccessoryAddress(Number(address[0]), Number(address[1]), Number(address[2])),
          Number(1 + address[0].padStart(3, '0') + address[1].padStart(3, '0') + address[2].padStart(3, '0')),
          device.tags[0], url));
      } else {
        return;
      }
    });
    log.info('Finishing filtering devices...');
  }).catch((error) => {
    log.error('Connection error when trying to get devices list: ', error);
  });

  return devices;
}

export async function getStatus(url: urlElement, accessory: AccessoryAddress, log: Logger) {
  const cmd = `https://${url.Username}:${url.Password}@${url.IPAddress}:${url.portNumber}/api/cac/objvalue/${accessory.na}%2F${accessory.aa}%2F${accessory.ga}`;
  log.debug(cmd);

  let status: deviceStatus = {
    ramprate: '0',
    target: '0',
  };

  log.debug(`Trying to get device status from ${accessory.na}:${accessory.aa}:${accessory.ga}`);
  await axios.get(cmd, {
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  }).then((response) => {
    log.debug(response.data);
    status = new deviceStatus(response.data.ramprate, response.data.target);
    return status;
  }).catch((error) => {
    log.error('Connection error when trying to get device status: ', error);
  });

  return status;
}

export async function setValue(url: urlElement, accessory: AccessoryAddress, command: deviceStatus, log: Logger) {
  const cmd = `https://${url.Username}:${url.Password}@${url.IPAddress}:${url.portNumber}/api/cac/objvalue/${accessory.na}%2F${accessory.aa}%2F${accessory.ga}`;
  log.debug(cmd);

  log.debug(`Trying to send command {ramprate: ${command.ramprate}, target: ${command.target}} to ${accessory.na}:${accessory.aa}:${accessory.ga}`);
  await axios({
    method: 'put',
    url: cmd,
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
    data: {
      ramprate: command.ramprate,
      target: command.target,
    },
  }).then((response) => {
    log.debug(response.data);
  }).catch((error) => {
    log.error('Connection error when trying to send command: ', error);
  });
}