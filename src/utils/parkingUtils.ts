import { CostPeriod, type IParkingCost } from '@/@types/parkingLot'

export class parkingUtils {
  public static calcEstimateCost(minutes: number, cost: IParkingCost) {
    const totalPeriod = Math.ceil(parkingUtils.calcPeriod(minutes, cost))
    const estimateCost = totalPeriod * cost.price
    return estimateCost
  }

  public static calcPeriod(minutes: number, cost: IParkingCost) {
    let totalPeriod = 1
    switch (cost.period) {
      case CostPeriod.Hour:
        totalPeriod = minutes / 60 / cost.per
        break
      case CostPeriod.Day:
        totalPeriod = minutes / 24 / 60 / cost.per
        break
      case CostPeriod.Week:
        totalPeriod = minutes / 7 / 24 / 60 / cost.per
        break
      case CostPeriod.Month:
        totalPeriod = minutes / 30 / 24 / 60 / cost.per
        break
      case CostPeriod.Year:
        totalPeriod = minutes / 365 / 24 / 60 / cost.per
        break
      default:
        break
    }
    return totalPeriod
  }
}
