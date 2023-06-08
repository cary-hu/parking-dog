import { v4 as uuidv4 } from 'uuid'

export interface ILocation {
  lat: number
  lng: number
}

export enum CostPeriod {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export interface IParkingCost {
  price: number
  per: number
  period: CostPeriod
}

export class ParkingLotInfo {
  public id: string = uuidv4()
  public name = ''
  public location: ILocation = {
    lat: 0,
    lng: 0,
  }

  public cost: IParkingCost = {
    period: CostPeriod.Hour,
    price: 5,
    per: 8,
  }
}

export class ParkingInfo {
  public startTime: Date = new Date()
  public endTime: Date = new Date()
  public parkingLot: ParkingLotInfo = new ParkingLotInfo()
  public expectedCost = 0
  public actualCost = 0
}
