import axios from 'axios'
import type { UpdatePantry } from '@/@types/pantry'
import { RequestType } from '@/@types/request'

const pantryID = '93867265-4602-4abd-9f20-539314e679e7'
const baseURL = `https://getpantry.cloud/apiv1/pantry/${pantryID}`
const baseConfig = {
  method: RequestType.GET,
  maxBodyLength: Infinity,
  url: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
}

class PantryService {
  public async getDetails() {
    const config = {
      ...baseConfig,
    }
    return (await axios(config)).data
  }

  public async updateDetails(data: UpdatePantry) {
    const config = {
      ...baseConfig,
      method: RequestType.PUT,
      data,
    }
    return (await axios(config)).data
  }

  public async createOrReplaceBasket(basketName: string, data: string) {
    const config = {
      ...baseConfig,
      method: RequestType.POST,
      url: `${baseURL}/basket/${basketName}`,
      data,
    }

    return (await axios(config)).data
  }

  public async updateContents(basketName: string, data: string) {
    const config = {
      method: RequestType.PUT,
      maxBodyLength: Infinity,
      url: `${baseURL}/basket/${basketName}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    }

    return (await axios(config)).data
  }

  public async getContents(basketName: string) {
    const config = {
      ...baseConfig,
      url: `${baseURL}/basket/${basketName}`,
    }

    return (await axios(config)).data
  }

  public async deleteBasket(basketName: string) {
    const config = {
      ...baseConfig,
      method: RequestType.DELETE,
      url: `${baseURL}/basket/${basketName}`,
    }

    return (await axios(config)).data
  }
}

export default new PantryService()
