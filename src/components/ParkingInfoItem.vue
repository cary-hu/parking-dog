<script setup lang="ts">
import { ParkingInfo } from '@/@types/parkingInfo'
import parkingService from '@/services/parkingService'
import { MapUtils } from '@/utils/mapUtils'
import { parkingUtils } from '@/utils/parkingUtils'

const props = defineProps<{
  parkingInfo: ParkingInfo
}>()

const emits = defineEmits(['onItemUpdated'])
const message = useMessage()
const modifyParkingInfoDialog = ref(false)
const modifyParkingInfoDialogLoading = ref(false)
const modifyParkingInfoForm = ref(null)
const modifyParkingInfoTitle = ref('')
const modifyParkingInfoButtonText = ref('')
const modifyParkingInfoModel = ref<ParkingInfo>(new ParkingInfo())
const parkingDateRange = ref<[number, number]>([new Date(props.parkingInfo.startTime).getTime(), Date.now()])

function openModifyParkingInfoDialog() {
  modifyParkingInfoModel.value = JSON.parse(JSON.stringify(props.parkingInfo))
  if (props.parkingInfo.startTime === props.parkingInfo.endTime) {
    modifyParkingInfoTitle.value = 'Exit Parking Lot'
    modifyParkingInfoButtonText.value = 'Exit'
    modifyParkingInfoModel.value.endTime = new Date()
  }
  else {
    modifyParkingInfoTitle.value = 'Modify the Parking Info'
    modifyParkingInfoButtonText.value = 'Modify'
  }
  modifyParkingInfoDialog.value = true
}

const centerPoint = computed(() => {
  return [props.parkingInfo!.parkingLot.location.lng, props.parkingInfo!.parkingLot.location.lat]
})

function mapInit(map: any) {
  const marker = new (AMap as any).Marker({
    position: centerPoint.value,
  })
  map.add(marker)
}

const isStillParking = computed(() => {
  return props.parkingInfo?.startTime === props.parkingInfo?.endTime
})
const parkingLotCost = computed(() => {
  const parkingLotInfoCost = props.parkingInfo?.parkingLot.cost
  return `${parkingLotInfoCost?.price} Yuan per ${parkingLotInfoCost?.per} ${parkingLotInfoCost?.period}`
})
function getMinute(time: Date, twoTime: Date, value = 0) {
  const chaTime = Math.abs(new Date(time).getTime() - new Date(twoTime).getTime())
  if (value)
    return Number.parseInt((chaTime / 60000).toString()) - value
  else
    return Number.parseInt((chaTime / 60000).toString())
}

const computedTrigger = ref(0)
const estimateCost = computed(() => {
  if (computedTrigger.value + 1 > 0) {
    // do nothing
  }
  if (props.parkingInfo?.startTime !== props.parkingInfo?.endTime)
    return props.parkingInfo?.expectedCost
  return parkingUtils.calcEstimateCost(getMinute(props.parkingInfo!.startTime, new Date()), props.parkingInfo!.parkingLot.cost)
})
const currentPeriod = computed(() => {
  if (computedTrigger.value + 1 > 0) {
    // do nothing
  }
  if (props.parkingInfo?.startTime !== props.parkingInfo?.endTime)
    return parkingUtils.calcPeriod(getMinute(props.parkingInfo!.startTime, props.parkingInfo!.endTime), props.parkingInfo!.parkingLot.cost)
  return parkingUtils.calcPeriod(getMinute(props.parkingInfo!.startTime, new Date()), props.parkingInfo!.parkingLot.cost)
})
const progressColor = computed(() => {
  const currentRestPeriod = (currentPeriod.value - Math.floor(currentPeriod.value)) * 100
  let color = 'red'
  if (currentRestPeriod > 20)
    color = 'pink'
  if (currentRestPeriod > 40)
    color = 'primary'
  if (currentRestPeriod > 80)
    color = 'teal'

  return color
})
setInterval(() => {
  computedTrigger.value++
}, 60000)

function disablePreviousDate(ts: number) {
  return ts < new Date(props.parkingInfo.startTime).getTime()
}
async function onExitParkingLot() {
  const parkingInfo = props.parkingInfo
  if (!parkingInfo) {
    message.error('Getting parking info failed')
    return
  }
  modifyParkingInfoDialogLoading.value = true
  parkingInfo!.startTime = new Date(parkingDateRange.value[0])
  parkingInfo!.endTime = new Date(parkingDateRange.value[1] ?? parkingDateRange.value[0])
  parkingInfo!.expectedCost = parkingUtils.calcEstimateCost(getMinute(parkingInfo!.startTime, parkingInfo!.endTime), props.parkingInfo!.parkingLot.cost)
  parkingInfo!.actualCost = modifyParkingInfoModel.value.actualCost
  try {
    await parkingService.addOrUpdateParkingInfo(parkingInfo!)
    message.success('Update parking info successful')
    await emits('onItemUpdated')
    modifyParkingInfoDialog.value = false
  }
  catch (error) {
    message.error('Update parking info failed')
  }
  modifyParkingInfoDialogLoading.value = false
}
</script>

<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
    <div class="map-page-container">
      <el-amap
        :center="MapUtils._transform(centerPoint, 0.14, 245)"
        :zoom="17"
        @init="mapInit"
      />
    </div>
    <v-card-item>
      <template #title>
        <span text-6 block><i class="me-2 fa-solid fa-square-parking" />{{ parkingInfo?.parkingLot.name }}</span>
        <span text-3>Price: {{ parkingLotCost }}</span>
      </template>
      <template #subtitle>
        <div class="py-2" text-3 text-slate-950>
          <div v-if="!isStillParking">
            <span>Actual: {{ parkingInfo?.actualCost }} Yuan</span>
          </div>
          <div>
            <span>Estimate: {{ estimateCost }} Yuan</span>
          </div>
        </div>
      </template>
    </v-card-item>

    <v-card-text class="py-0">
      <v-row no-gutters>
        <v-col
          class="text-h2"
        >
          <span v-if="parkingInfo?.startTime === parkingInfo?.endTime">
            {{ $dayjs(parkingInfo?.startTime).toNow(true) }}
          </span>
          <span v-else>
            {{ $dayjs(parkingInfo?.startTime).to(parkingInfo?.endTime, true) }}
          </span>
        </v-col>
      </v-row>
    </v-card-text>

    <div class="py-3">
      <v-list-item
        density="compact"
      >
        <v-list-item-subtitle>
          <div flex items-center>
            <v-progress-circular
              v-if="isStillParking"
              :model-value="(currentPeriod - Math.floor(currentPeriod)) * 100"
              :size="60"
              :width="7"
              :color="progressColor"
            >
              {{ Math.floor(currentPeriod) }}
            </v-progress-circular>
            <div ms-1>
              <i class="fa-regular fa-clock me-2" />{{ $dayjs(parkingInfo?.startTime).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </div>
        </v-list-item-subtitle>
      </v-list-item>

      <v-list-item
        v-if="!isStillParking"
        density="compact"
      >
        <v-list-item-subtitle>
          <span>
            <i class="fa-solid fa-stopwatch me-2" />{{ $dayjs(parkingInfo?.endTime).format("YYYY-MM-DD HH:mm:ss") }}
          </span>
        </v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-card-actions>
      <v-btn v-if="isStillParking" @click="openModifyParkingInfoDialog">
        Exit Parking Lot
      </v-btn>
      <v-btn v-else @click="openModifyParkingInfoDialog">
        Modify
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog
    v-model="modifyParkingInfoDialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
    :z-index="1999"
  >
    <v-card :loading="modifyParkingInfoDialogLoading">
      <template #loader="{ isActive }">
        <v-progress-linear
          :active="isActive"
          color="deep-purple"
          height="4"
          indeterminate
        />
      </template>
      <v-toolbar
        dark
      >
        <v-btn
          icon
          dark
          @click="modifyParkingInfoDialog = false"
        >
          <i class="fa-solid fa-xmark" />
        </v-btn>
        <v-toolbar-title>{{ modifyParkingInfoTitle }}</v-toolbar-title>
      </v-toolbar>
      <v-form ref="modifyParkingInfoForm">
        <v-list lines="one">
          <v-list-item title="Parking Date">
            <template #subtitle>
              <n-date-picker v-model:value="parkingDateRange[0]" :actions="null" update-value-on-close :to="modifyParkingInfoForm!" type="datetime" />
            </template>
          </v-list-item>
          <v-list-item title="Exit Date">
            <template #subtitle>
              <n-date-picker v-model:value="parkingDateRange[1]" :actions="null" update-value-on-close :to="modifyParkingInfoForm!" type="datetime" clearable :is-date-disabled="disablePreviousDate" />
            </template>
          </v-list-item>
          <v-list-item title="Actual Cost">
            <template #subtitle>
              <n-input-number
                v-model:value="modifyParkingInfoModel.actualCost"
                :default-value="0"
              />
            </template>
          </v-list-item>
        </v-list>
        <div class="d-flex flex-column">
          <v-btn
            class="mt-4"
            block
            @click="onExitParkingLot"
          >
            {{ modifyParkingInfoButtonText }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style lang="less" scoped>
.map-page-container {
  height: 300px;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: -1;
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(53deg, #ffffff 25%, rgba(255, 255, 255, 0) 89%);
  }
  .amap-copyright,
  .amap-logo {
    display: none !important;
  }

}

.v-card-actions {
  background-color: #fff;
}
</style>
