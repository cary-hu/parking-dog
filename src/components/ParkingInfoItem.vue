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
  const parkingId = props.parkingInfo!.id
  const parkingInfo = await parkingService.getParkingInfo(parkingId)
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
    <v-card-item :title="parkingInfo?.parkingLot.name">
      <template #subtitle>
        <span v-if="parkingInfo?.startTime === parkingInfo?.endTime">
          Parking: {{ $dayjs(parkingInfo?.startTime).toNow(true) }}
        </span>
        <span v-else>
          Parking: {{ $dayjs(parkingInfo?.startTime).to(parkingInfo?.endTime, true) }}
        </span>
      </template>
    </v-card-item>

    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col
          class="text-h2"
        >
          <span flex items-center><i w-10 text-center text-8 class="fa-solid fa-brain" />{{ parkingInfo?.expectedCost }}</span>
          <span flex items-center><i w-10 text-center text-8 class="fa-solid fa-yen-sign" />{{ parkingInfo?.actualCost }}</span>
        </v-col>
      </v-row>
    </v-card-text>

    <div class="d-flex py-3">
      <v-list-item
        density="compact"
      >
        <v-list-item-subtitle><i class="fa-regular fa-clock" />{{ $dayjs(parkingInfo?.startTime).format("YYYY-MM-DD HH:mm:ss") }}</v-list-item-subtitle>
      </v-list-item>

      <v-list-item
        density="compact"
      >
        <v-list-item-subtitle>
          <span v-if="parkingInfo?.startTime === parkingInfo?.endTime"><i class="fa-solid fa-hourglass-half" />Still Parking</span>
          <span v-else>
            <i class="fa-solid fa-stopwatch" />{{ $dayjs(parkingInfo?.endTime).format("YYYY-MM-DD HH:mm:ss") }}
          </span>
        </v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-card-actions>
      <v-btn @click="onExitParkingLot">
        Exit Parking Lot
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
    -webkit-clip-path: polygon(0px 298px, 502px 300px, 500px 250px, 263px 201px, 189px 1px, 0px 0px);
    clip-path: polygon(0px 298px, 502px 300px, 500px 250px, 263px 201px, 189px 1px, 0px 0px);
    background: linear-gradient(45deg, rgba(255,255,255,1) 14%, rgba(255,255,255,0) 83%);
  }
}

.v-card-actions {
  background-color: #fff;
}
</style>
