<script setup lang="ts">
import { ParkingInfo } from '@/@types/parkingInfo'
import type { ParkingLotInfo } from '@/@types/parkingLot'
import parkingLotService from '@/services/parkingLotService'
import parkingService from '@/services/parkingService'

const allParkingLots = ref<ParkingLotInfo[]>([])
const allParkingInfos = ref<ParkingInfo[]>([])
const message = useMessage()

const addParkingInfoDialog = ref(false)
const addParkingInfoForm = ref()
const addParkingInfo = ref<ParkingInfo>(new ParkingInfo())

async function onParking() {
  if (allParkingLots.value.length === 0) {
    message.warning('There is no parking lot, add parking lot first')
    return
  }
  if (allParkingInfos.value[0] && allParkingInfos.value[0].startTime === allParkingInfos.value[0].endTime) {
    message.warning('The last parking is not exit')
    return
  }
  addParkingInfo.value = new ParkingInfo()
  addParkingInfo.value.parkingLot = allParkingLots.value[0]
  addParkingInfoDialog.value = true
}

async function parkingMyDog() {
  const newParkingInfo = addParkingInfo.value
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
const isStillParking = computed(() => {
  const latestParkingInfo = allParkingInfos.value[0]
  if (!latestParkingInfo)
    return false

  return latestParkingInfo.startTime === latestParkingInfo.endTime
})
async function onItemUpdated() {
  await refreshAllParkingInfo()
}
onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <div flex justify-center w-full py-4>
      <v-btn v-if="!isStillParking" border rounded="xl" size="x-large" @click="onParking">
        <i class="fa-solid fa-square-parking" />
      </v-btn>
    </div>
    <ul>
      <li v-for="parkingInfo in allParkingInfos" :key="parkingInfo.id">
        <ParkingInfoItem :parking-info="parkingInfo" @on-item-updated="onItemUpdated" />
      </li>
    </ul>
    <v-dialog
      v-model="addParkingInfoDialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="addParkingInfoDialog = false"
          >
            <i class="fa-solid fa-xmark" />
          </v-btn>
          <v-toolbar-title>Parking My Dog</v-toolbar-title>
        </v-toolbar>
        <v-form ref="addParkingInfoForm">
          <v-combobox
            v-model="addParkingInfo.parkingLot"
            :items="allParkingLots"
            item-title="name"
            item-value="id"
            :hint="`${addParkingInfo?.parkingLot?.cost?.price} Yuan per ${addParkingInfo?.parkingLot?.cost?.per} ${addParkingInfo?.parkingLot?.cost?.period}`"
            :rules="[(v: ParkingLotInfo) => !!v || 'Item is required']"
            label="Parking Lot"
            persistent-hint
            return-object
            required
          />
          <div class="d-flex flex-column">
            <v-btn
              class="mt-4"
              block
              @click="parkingMyDog"
            >
              Parking
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="less">
ul {
  list-style: none;
  li {
    margin-block-end: 2rem;
  }
}
</style>
