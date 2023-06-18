<script setup lang="ts">
import { ParkingInfo } from '@/@types/parkingInfo'
import parkingService from '@/services/parkingService'
import { MapUtils } from '@/utils/mapUtils'

const props = defineProps({
  parkingInfo: {
    type: ParkingInfo,
  },
})

const message = useMessage()

async function onExitParkingLot() {
  const parkingInfo = props.parkingInfo
  if (!parkingInfo)
    message.error('Getting parking info failed')

  parkingInfo!.endTime = new Date()
  parkingInfo!.expectedCost = 123
  await parkingService.addOrUpdateParkingInfo(parkingInfo!)
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
</script>

<template>
  <v-card
    class="mx-auto"
    max-width="500"
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
            <span>Actual: {{ parkingInfo?.actualCost }}</span>
          </div>
          <div>
            <span>Estimate: {{ parkingInfo?.expectedCost }}</span>
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
        <v-list-item-subtitle><i class="fa-regular fa-clock me-2" />{{ $dayjs(parkingInfo?.startTime).format("YYYY-MM-DD HH:mm:ss") }}</v-list-item-subtitle>
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
      <v-btn v-if="isStillParking" @click="onExitParkingLot">
        Exit Parking Lot
      </v-btn>
      <v-btn v-else @click="onExitParkingLot">
        Modify
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style lang="less">
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
