export interface UserData {
  lineId?: string;
  name: string;
  rate: number;
}

export class UserEntity implements UserData {
  readonly lineId: string;
  readonly name: string;
  rate: number;

  constructor(lineId: string, name: string, rate = 1500) {
    this.lineId = lineId;
    this.name = name;
    this.rate = rate;
  }

  increaseRate() {
    this.rate += 50;
    return this;
  }

  decreaseRate() {
    this.rate -= 10;
    return this;
  }

  toObject() {
    return {
      lineId: this.lineId,
      name: this.name,
      rate: this.rate,
    }
  }
}
