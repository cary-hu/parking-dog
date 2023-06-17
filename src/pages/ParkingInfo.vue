<script setup lang="ts">
import { ParkingInfo } from '@/@types/parkingInfo'
import type { ParkingLotInfo } from '@/@types/parkingLot'
import parkingLotService from '@/services/parkingLotService'
import parkingService from '@/services/parkingService'

const allParkingLots = ref<ParkingLotInfo[]>([])
const allParkingInfos = ref<ParkingInfo[]>([])
const message = useMessage()

async function onParking() {
  if (allParkingLots.value.length === 0)
    message.warning('There is no parking lot, add parking lot first')
  const newParkingInfo = new ParkingInfo()
  newParkingInfo.parkingLot = allParkingLots.value[0]
  await parkingService.addOrUpdateParkingInfo(newParkingInfo)
  await refreshAllParkingInfo()
}

async function initAllParkingLot() {
  const loadingMessage = message.loading('Loading parking lot info', {
    closable: false,
    duration: 0,
  })
  try {
    allParkingLots.value = await parkingLotService.getParkingLots()
    if (allParkingLots.value.length === 0) {
      loadingMessage.type = 'warning'
      loadingMessage.content = 'There is no parking lot, add parking lot first.'
    }
    else {
      loadingMessage.type = 'success'
      loadingMessage.content = 'Loading parking lot successful.'
    }

    setTimeout(() => {
      loadingMessage.destroy()
    }, 1000)
  }
  catch (error) {
    loadingMessage.closable = true
    loadingMessage.type = 'error'
    loadingMessage.content = 'Loading parking lot failed.'
  }
}
async function refreshAllParkingInfo() {
  const loadingMessage = message.loading('Loading parking info', {
    closable: false,
    duration: 0,
  })
  try {
    allParkingInfos.value = await parkingService.getParkingInfos()
    loadingMessage.type = 'success'
    loadingMessage.content = 'Loading parking info successful.'
    setTimeout(() => {
      loadingMessage.destroy()
    }, 1000)
  }
  catch (error) {
    loadingMessage.closable = true
    loadingMessage.type = 'error'
    loadingMessage.content = 'Loading parking ParkingInfo failed.'
  }
}
async function init() {
  await parkingService.ensureParkingInfoBasket()
  await initAllParkingLot()
  await refreshAllParkingInfo()
}
onMounted(() => {
  init()
})
</script>

<template>
  <v-btn-group>
    <v-btn @click="onParking">
      Parking
    </v-btn>
    <v-btn>
      Go
    </v-btn>
  </v-btn-group>
  <div>
    <ParkingInfoItem v-for="parkingInfo in allParkingInfos" :key="parkingInfo.id" :parking-info="parkingInfo" />
  </div>
</template>
