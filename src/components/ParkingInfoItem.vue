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

type progressType = 'default' | 'error' | 'success' | 'warning' | 'info' | undefined
const progressColor = computed<progressType>(() => {
  const currentRestPeriod = (currentPeriod.value - Math.floor(currentPeriod.value)) * 100
  let color: progressType = 'error'
  if (currentRestPeriod > 20)
    color = 'warning'
  if (currentRestPeriod > 40)
    color = 'info'
  if (currentRestPeriod > 80)
    color = 'success'

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

const currentCycleRemain = computed(() => {
  return Number.parseFloat(((currentPeriod.value - Math.floor(currentPeriod.value)) * 100).toFixed(2))
})
const remainTips = computed(() => {
  let tips = 'It\'s a good deal to exit the parking lot now'
  if (currentCycleRemain.value <= 10)
    tips = 'It\'s not worth the money to exit the parking lot now'

  if (currentCycleRemain.value <= 20)
    tips = 'Exiting the parking lot now is a bit of a waste'
  if (currentCycleRemain.value <= 50)
    tips = 'It\'s not too bad to exit the parking lot now'
  if (currentCycleRemain.value <= 70)
    tips = 'Getting out of the parking lot is a small gain now'
  return tips
})

async function openNavigation() {
  window.open(await MapUtils.getAMapNavigationURI([props.parkingInfo.parkingLot.location.lng, props.parkingInfo.parkingLot.location.lat], props.parkingInfo.parkingLot.name), '_blank')
}
</script>

<template>
  <div class="parking-card-container">
    <div class="parking-card-header">
      <span h-full flex items-center text-7><i class="me-2 fa-solid fa-square-parking" /></span>
      <span h-full flex items-center me-2 text-5>{{ parkingInfo?.parkingLot.name }}</span>
      <span h-full flex items-center me-2 text-4 text-gray-400>{{ parkingLotCost }}</span>
    </div>
    <div class="parking-card-content-container px-3 pb-2">
      <div class="map-page-container">
        <el-amap
          :center="MapUtils._transform(centerPoint, 0.14, 255)"
          :zoom="17"
          @init="mapInit"
        />
      </div>
      <div flex pt-3>
        <div me-3>
          <n-timeline>
            <n-timeline-item
              title="Start Parking"
              :time="$dayjs(parkingInfo?.startTime).format('YYYY-MM-DD HH:mm:ss')"
              :line-type="isStillParking ? 'dashed' : 'default'"
            >
              <template #icon>
                <i class="fa-regular fa-clock" />
              </template>
            </n-timeline-item>
            <n-timeline-item
              :title="isStillParking ? 'Still Parking' : 'End Parking'"
              :time="isStillParking ? '' : $dayjs(parkingInfo?.endTime).format('YYYY-MM-DD HH:mm:ss')"
              line-type="dashed"
            >
              <template #icon>
                <i class="fa-solid fa-stopwatch" />
              </template>
            </n-timeline-item>
          </n-timeline>
        </div>
        <div text-11>
          <span v-if="parkingInfo?.startTime === parkingInfo?.endTime">
            {{ $dayjs(parkingInfo?.startTime).toNow(true) }}
          </span>
          <span v-else>
            {{ $dayjs(parkingInfo?.startTime).to(parkingInfo?.endTime, true) }}
          </span>
        </div>
      </div>

      <div flex items-center text-3 text-slate-950 my-5>
        <n-statistic v-if="!isStillParking" me-5 label="Actual Cost">
          <template #prefix>
            <i class=" fa-solid fa-coins" />
          </template>
          {{ `${parkingInfo?.actualCost} Yuan` }}
        </n-statistic>
        <n-statistic label="Estimate Cost">
          <template #prefix>
            <i class=" fa-solid fa-chart-line" />
          </template>
          {{ estimateCost }} Yuan
        </n-statistic>
      </div>
      <n-alert :type="progressColor" :show-icon="false">
        <n-progress
          type="line"
          :percentage="currentCycleRemain"
          :height="16"
          :color="progressColor"
          :status="progressColor"
          rail-color="white"
          indicator-placement="inside"
          :processing="isStillParking"
        />
        <span block>Parking {{ Math.floor(currentPeriod) }} periods, {{ (100 - currentCycleRemain).toFixed(2) }}% remaining in the current period.</span>
        <span block>{{ remainTips }}</span>
      </n-alert>
    </div>

    <div class="parking-card-footer">
      <v-btn v-if="isStillParking" @click="openModifyParkingInfoDialog">
        Exit Parking Lot
      </v-btn>
      <v-btn v-else @click="openModifyParkingInfoDialog">
        Modify
      </v-btn>
      <v-btn ms-2 @click="openNavigation">
        <i class="fa-solid fa-map-location-dot" />Navigation
      </v-btn>
    </div>
  </div>
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
.parking-card-container {
    --marginX: 1rem;

    position: relative;
    width: calc(100% - calc(var(--marginX) * 2));
    height: auto;
    min-height: 300px;
    margin: var(--marginX);
    border-radius: .5rem;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
    overflow: hidden;

    &:deep(.parking-card-footer),
    &:deep(.parking-card-header) {
        padding: .5rem;
        border-bottom: 1px solid #eee;
        height: 50px;
        width: 100%;
        z-index: 2;
        position: relative;
        display: flex;
        align-items: center;
    }

    &:deep(.parking-card-footer) {
      background-color: #fff;
      height: 60px;
    }

    &:deep(.parking-card-content-container) {
      position: relative;
        min-height: 200px;
        height: auto;
        width: 100%;
    }

    &:deep(.parking-card-icon) {
      width: 20px;
      display: inline-block;
      text-align: center;
    }
}
</style>
