<script setup lang="ts">
import type { MessageReactive } from 'naive-ui'
import { ParkingInfo } from '@/@types/parkingInfo'
import type { ParkingLotInfo } from '@/@types/parkingLot'
import parkingLotService from '@/services/parkingLotService'
import parkingService from '@/services/parkingService'

const allParkingLots = ref<ParkingLotInfo[]>([])
const allParkingInfos = ref<ParkingInfo[]>([])
const message = useMessage()
const showAllParkingInfos = ref(false)

const addParkingInfoDialog = ref(false)
const addParkingInfoForm = ref()
const addParkingInfo = ref<ParkingInfo>(new ParkingInfo())

async function onParking() {
  await initAllParkingLot()

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
  await refreshData()
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

const parkingInfoLoading = ref(true)
async function refreshAllParkingInfo() {
  parkingInfoLoading.value = true
  allParkingInfos.value = await parkingService.getParkingInfos()
  parkingInfoLoading.value = false
}
let initRetryCounter = 0
let loadingMessage: MessageReactive | null = null
async function refreshData() {
  if (!loadingMessage) {
    loadingMessage = message.loading('Loading parking info', {
      closable: false,
      duration: 0,
    })
  }
  loadingMessage.content = initRetryCounter > 0 ? `Retry loading parking info ${initRetryCounter} times` : 'Loading parking info'
  loadingMessage.type = 'loading'
  try {
    await refreshAllParkingInfo()
    loadingMessage.type = 'success'
    loadingMessage.content = 'Loading parking info successful.'
    loadingMessage.duration = 2000
    loadingMessage.closable = true
    setTimeout(() => {
      if (loadingMessage) {
        loadingMessage.destroy()
        loadingMessage = null
      }
    }, 3000)
  }
  catch (error) {
    initRetryCounter++
    if (loadingMessage) {
      loadingMessage.type = 'error'
      loadingMessage.content = `Retry loading parking info ${initRetryCounter} times`
    }
    setTimeout(() => {
      refreshData()
    }, 2000)
  }
}
const isStillParking = computed(() => {
  const latestParkingInfo = allParkingInfos.value[0]
  if (!latestParkingInfo)
    return false

  return latestParkingInfo.startTime === latestParkingInfo.endTime
})
async function onItemUpdated() {
  await refreshData()
}
onMounted(() => {
  refreshData()
})
</script>

<template>
  <div>
    <div flex justify-center w-full py-4>
      <v-btn v-if="!isStillParking && !parkingInfoLoading" border rounded="xl" size="x-large" @click="onParking">
        <i class="fa-solid fa-square-parking" />
      </v-btn>
      <v-btn border rounded="xl" size="x-large" @click="showAllParkingInfos = !showAllParkingInfos">
        {{ showAllParkingInfos ? "Less Info" : "More Info" }}
      </v-btn>
    </div>
    <ul v-if="parkingInfoLoading">
      <li flex justify-center>
        <n-skeleton height="430px" width="98%" />
      </li>
    </ul>
    <ul v-else>
      <template v-if="showAllParkingInfos">
        <li v-for="parkingInfo in allParkingInfos" :key="parkingInfo.id">
          <ParkingInfoItem :parking-info="parkingInfo" @on-item-updated="onItemUpdated" />
        </li>
      </template>
      <li v-else>
        <ParkingInfoItem :parking-info="allParkingInfos[0]" @on-item-updated="onItemUpdated" />
      </li>
    </ul>
    <v-dialog v-model="addParkingInfoDialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="addParkingInfoDialog = false">
            <i class="fa-solid fa-xmark" />
          </v-btn>
          <v-toolbar-title>Parking My Dog</v-toolbar-title>
        </v-toolbar>
        <v-form ref="addParkingInfoForm">
          <v-combobox
            v-model="addParkingInfo.parkingLot" :items="allParkingLots" item-title="name" item-value="id"
            :hint="`${addParkingInfo?.parkingLot?.cost?.price} Yuan per ${addParkingInfo?.parkingLot?.cost?.per} ${addParkingInfo?.parkingLot?.cost?.period}`"
            :rules="[(v: ParkingLotInfo) => !!v || 'Item is required']" label="Parking Lot" persistent-hint return-object
            required
          />
          <div class="d-flex flex-column">
            <v-btn class="mt-4" block @click="parkingMyDog">
              Parking
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="less" scoped>
ul {
  list-style: none;

  li {
    margin-block-end: 2rem;
  }
}
</style>
