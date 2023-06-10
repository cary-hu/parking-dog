import { ParkingLotInfo } from './parkingLot'

export class ParkingInfo {
  public startTime: Date = new Date()
  public endTime: Date = new Date()
  public parkingLot: ParkingLotInfo = new ParkingLotInfo()
  public expectedCost = 0
  public actualCost = 0
}
