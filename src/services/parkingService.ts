import { BasketPrefix } from '@/@types/constants'
import type { ParkingInfo } from '@/@types/parkingInfo'
import PantryService from '@/services/pantry'

const PARKING_INFO_BASKET_NAME = `${BasketPrefix}_parking_infos`
class ParkingService {
  public async ensureParkingInfoBasket() {
    const pantryDetails = await PantryService.getDetails()
    if (!pantryDetails.baskets.find(x => x.name === PARKING_INFO_BASKET_NAME))
      PantryService.createOrReplaceBasket(PARKING_INFO_BASKET_NAME, JSON.stringify({}))
  }

  public async addOrUpdateParkingInfo(parkingInfo: ParkingInfo): Promise<ParkingInfo> {
    const data = {} as any
    data[parkingInfo.id] = parkingInfo
    return await PantryService.updateContents(PARKING_INFO_BASKET_NAME, JSON.stringify(data))
  }

  public async getParkingInfo(parkingId: string): Promise<ParkingInfo | undefined> {
    const allParkingInfos = this.getParkingInfos()
    return (await allParkingInfos).find(x => x.id === parkingId)
  }

  public async getParkingInfos(): Promise<ParkingInfo[]> {
    return await PantryService.getBasketContentAsArray(PARKING_INFO_BASKET_NAME)
  }
}

export default new ParkingService()
