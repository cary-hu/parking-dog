<script setup lang="ts">
import type { ParkingLotInfo } from '@/@types/parkingLot'
import { MapUtils } from '@/utils/mapUtils'
import parkingLotService from '@/services/parkingLotService'

const props = defineProps<{
  parkingLotInfo: ParkingLotInfo
}>()

const centerPoint = computed(() => {
  return [props.parkingLotInfo.location.lng, props.parkingLotInfo.location.lat]
})

function mapInit(map: any) {
  const marker = new (AMap as any).Marker({
    position: centerPoint.value,
  })
  map.add(marker)
}

const parkingLotCost = computed(() => {
  const parkingLotInfoCost = props.parkingLotInfo.cost
  return `${parkingLotInfoCost?.price} Yuan per ${parkingLotInfoCost?.per} ${parkingLotInfoCost?.period}`
})

async function removeParkingLots() {
  await parkingLotService.removeParkingLot(props.parkingLotInfo!.id)
}
</script>

<template>
  <v-card
    min-width="400"
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
        <span text-6 block><i class="me-2 fa-solid fa-square-parking" />{{ parkingLotInfo.name }}</span>
        <span text-3>Price: {{ parkingLotCost }}</span>
      </template>
    </v-card-item>

    <v-card-actions>
      <v-btn variant="plain" rounded="xl" color="blue-darken-4" @click="removeParkingLots">
        Remove
      </v-btn>
      <v-btn variant="plain" rounded="xl" color="blue-darken-4">
        Modify
      </v-btn>
    </v-card-actions>
  </v-card>
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
</style>
