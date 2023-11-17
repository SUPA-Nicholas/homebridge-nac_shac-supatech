import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { nac_shacPlatform } from './platform';
import { setValue, getStatus } from './nac_shac';

export class Dimmer {
  private service: Service;

  private status = {
    ramprate: '0',
    target: '0',
  };

  constructor(
    private readonly platform: nac_shacPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Clipsal')
      .setCharacteristic(this.platform.Characteristic.Model, 'Dimmer')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, `${this.accessory.context.device.id}`);

    this.service = this.accessory.getService(this.platform.Service.Lightbulb) || this.accessory.addService(this.platform.Service.Lightbulb);

    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setOn.bind(this))
      .onGet(this.getOn.bind(this));

    this.service.getCharacteristic(this.platform.Characteristic.Brightness)
      .onSet(this.setBrightness.bind(this))
      .onGet(this.getBrightness.bind(this));
  }

  async setOn(value: CharacteristicValue) {
    this.status.target = (Math.round(Number(value)*(255/100))).toString();

    setValue(this.accessory.context.device.url, this.accessory.context.device.address, this.status, this.platform.log);
  }

  async getOn(): Promise<CharacteristicValue> {
    this.status = await getStatus(this.accessory.context.device.url, this.accessory.context.device.address, this.platform.log);

    return (Number(this.status.target) > 0);
  }

  async setBrightness(value: CharacteristicValue) {
    this.status.target = (Math.round(Number(value)*(255/100))).toString();

    await setValue(this.accessory.context.device.url, this.accessory.context.device.address, this.status, this.platform.log);
  }

  async getBrightness(): Promise<CharacteristicValue> {
    this.status = await getStatus(this.accessory.context.device.url, this.accessory.context.device.address, this.platform.log);

    return (Math.round(Number(this.status.target)*(100/255)));
  }
}