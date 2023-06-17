import * as turf from '@turf/turf'

export class MapUtils {
  public static _distance(pointA: Array<number>, pointB: Array<number>) {
    const from = turf.turfHelper.point(pointA)
    const to = turf.turfHelper.point(pointB)

    return turf.distance(from, to)
  }

  public static _transform(point: number[], distance = 100, direction = 35) {
    const poly = turf.polygon([[point, point, point, point]])
    const translatedPoly = turf.transformTranslate(poly, distance, direction)
    return translatedPoly.geometry.coordinates[0][0]
  }
}
