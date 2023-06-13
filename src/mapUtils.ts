import { distance as _distance, point } from 'turf'

export class MapUtils {
  public static distance(pointA: Array<number>, pointB: Array<number>) {
    const from = point(pointA)
    const to = point(pointB)

    return _distance(from, to)
  }
}
