import * as turfHelper from '@turf/helpers'
import distance from '@turf/distance'

export class MapUtils {
  public static _distance(pointA: Array<number>, pointB: Array<number>) {
    const from = turfHelper.point(pointA)
    const to = turfHelper.point(pointB)

    return distance(from, to)
  }
}
