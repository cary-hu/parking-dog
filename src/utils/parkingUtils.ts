import { CostPeriod, type IParkingCost } from '@/@types/parkingLot'

export class parkingUtils {
  public static calcEstimateCost(minutes: number, cost: IParkingCost) {
    let totalPeriod = 1
    switch (cost.period) {
      case CostPeriod.Hour:
        totalPeriod = Math.ceil(minutes / 60 / cost.per)
        break
      case CostPeriod.Day:
        totalPeriod = Math.ceil(minutes / 24 / 60 / cost.per)
        break
      case CostPeriod.Week:
        totalPeriod = Math.ceil(minutes / 7 / 24 / 60 / cost.per)
        break
      case CostPeriod.Month:
        totalPeriod = Math.ceil(minutes / 30 / 24 / 60 / cost.per)
        break
      case CostPeriod.Year:
        totalPeriod = Math.ceil(minutes / 365 / 24 / 60 / cost.per)
        break
      default:
        break
    }
    const estimateCost = totalPeriod * cost.price
    return estimateCost
  }
}
