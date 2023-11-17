import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { nac_shacPlatform } from './platform';
import { setValue, getStatus } from './nac_shac';

export class Blind {
  private service: Service;

  private status = {
    ramprate: '0',
    target: '0',
  };

  private increasing = false;
  private decreasing = true;

  constructor(
    private readonly platform: nac_shacPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Clipsal')
      .setCharacteristic(this.platform.Characteristic.Model, 'Blind')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, `${this.accessory.context.device.id}`);

    this.service = this.accessory.getService(this.platform.Service.WindowCovering) || this.accessory.addService(this.platform.Service.WindowCovering);

    this.service.getCharacteristic(this.platform.Characteristic.CurrentPosition)
      .onGet(this.handleCurrentPositionGet.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.PositionState)
      .onGet(this.handlePositionStateGet.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.TargetPosition)
      .onGet(this.handleTargetPositionGet.bind(this))
      .onSet(this.handleTargetPositionSet.bind(this));
  }

  async handleCurrentPositionGet(): Promise<CharacteristicValue> {
    this.status = await getStatus(this.accessory.context.device.url, this.accessory.context.device.address, this.platform.log);

    return (Math.round(Number(this.status.target)*(100/255)));
  }

  async handlePositionStateGet(): Promise<CharacteristicValue> {
    if (this.increasing) {
      return this.platform.Characteristic.PositionState.INCREASING;
    } else if (this.decreasing) {
      return this.platform.Characteristic.PositionState.DECREASING;
    } else {
      return this.platform.Characteristic.PositionState.STOPPED;
    }
  }

  async handleTargetPositionSet(value: CharacteristicValue) {
    if (Number(value) > Math.round(Number(this.status.target)*(100/255))) {
      this.increasing = true;
      this.decreasing = false;
    } else if (Number(value) < Math.round(Number(this.status.target)*(100/255))) {
      this.increasing = false;
      this.decreasing = true;
    }

    this.status.target = (Math.round(Number(value)*(255/100))).toString();

    await setValue(this.accessory.context.device.url, this.accessory.context.device.address, this.status, this.platform.log);

    this.increasing = false;
    this.decreasing = false;
  }

  async handleTargetPositionGet(): Promise<CharacteristicValue> {
    return (Math.round(Number(this.status.target)*(100/255)));
  }
}