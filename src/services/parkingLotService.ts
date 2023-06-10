import { BasketPrefix } from '@/@types/constants'
import type { ParkingLotInfo } from '@/@types/parkingLot'
import PantryService from '@/services/pantry'

const PARKING_LOT_INFO_BASKET_NAME = `${BasketPrefix}_parking_lot_infos`

class ParkingLotService {
  public async ensureParkingLotBasket() {
    const pantryDetails = await PantryService.getDetails()
    if (!pantryDetails.baskets.find(x => x.name === PARKING_LOT_INFO_BASKET_NAME))
      PantryService.createOrReplaceBasket(PARKING_LOT_INFO_BASKET_NAME, JSON.stringify({}))
  }

  public async removeParkingLot(id: string) {
    const data = {} as any
    data[id] = null
    return await PantryService.updateContents(PARKING_LOT_INFO_BASKET_NAME, JSON.stringify(data))
  }

  public async addOrUpdateParkingLot(parkingLot: ParkingLotInfo) {
    const data = {} as any
    data[parkingLot.id] = parkingLot
    return await PantryService.updateContents(PARKING_LOT_INFO_BASKET_NAME, JSON.stringify(data))
  }

  public async getParkingLots() {
    const originData = await PantryService.getContents(PARKING_LOT_INFO_BASKET_NAME)
    const targetData = []
    for (const key in originData) {
      if (Object.prototype.hasOwnProperty.call(originData, key)) {
        const element = originData[key]
        if (element)
          targetData.push(element)
      }
    }
    return targetData
  }
}

export default new ParkingLotService()
