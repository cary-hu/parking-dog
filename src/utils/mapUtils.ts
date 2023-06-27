import * as turf from '@turf/turf'

export class MapUtils {
  public static _distance(pointA: Array<number>, pointB: Array<number>): number {
    const from = turf.point(pointA)
    const to = turf.point(pointB)

    return turf.distance(from, to)
  }

  public static _transform(point: number[], distance = 100, direction = 35) {
    const poly = turf.polygon([[point, point, point, point]])
    const translatedPoly = turf.transformTranslate(poly, distance, direction)
    return translatedPoly.geometry.coordinates[0][0]
  }

  public static getAMapNavigationURI(end: [number, number], endName: string) {
    const start: [number, number] = [0, 0]
    const startName = '我的位置'
    navigator.geolocation.getCurrentPosition((pos) => {
      start[0] = pos.coords.longitude
      start[1] = pos.coords.latitude
    }, null, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    })
    return `https://uri.amap.com/navigation?from=${start[0]},${start[1]},${startName}&to=${end[0]},${end[1]},${endName}&mode=car&policy=0&callnative=1`
  }
}
