export class urlElement {
  constructor(
        public readonly IPAddress: string,
        public readonly portNumber: number,
        public readonly Username: string,
        public readonly Password: string,
  ) {}
}

export class AccessoryAddress {
  constructor(
        public readonly na: number,
        public readonly aa: number,
        public readonly ga: number,
  ) {}
}

export class Device {
  constructor(
        public name: string,
        public address: AccessoryAddress,
        public id: number,
        public type: string,
        public url: urlElement,
  ) {}
}

export class deviceStatus {
  constructor(
        public ramprate: string,
        public target: string,
  ) {}
}