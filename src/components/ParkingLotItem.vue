<script setup lang="ts">
import type { ParkingLotInfo } from '@/@types/parkingLot'
import { MapUtils } from '@/utils/mapUtils'
import parkingLotService from '@/services/parkingLotService'

const props = defineProps<{
  parkingLotInfo: ParkingLotInfo
}>()

const emits = defineEmits(['onItemRemoved'])
const message = useMessage()
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

const removeParkingLotLoading = ref(false)
async function removeParkingLots() {
  removeParkingLotLoading.value = true
  try {
    await parkingLotService.removeParkingLot(props.parkingLotInfo!.id)
    emits('onItemRemoved')
    message.success(`Remove ${props.parkingLotInfo.name} successful`)
  }
  catch (error) {
    message.error(`Remove ${props.parkingLotInfo.name} failed`)
  }
  removeParkingLotLoading.value = false
}

async function openNavigation() {
  window.open(await MapUtils.getAMapNavigationURI([props.parkingLotInfo.location.lng, props.parkingLotInfo.location.lat], props.parkingLotInfo.name), '_blank')
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
      >
        <el-amap-control-map-type :visible="false" :show-road="true" :show-traffic="true" />
      </el-amap>
    </div>
    <v-card-item>
      <template #title>
        <span text-6 block><i class="me-2 fa-solid fa-square-parking" />{{ parkingLotInfo.name }}</span>
        <span text-3>Price: {{ parkingLotCost }}</span>
      </template>
    </v-card-item>

    <v-card-actions>
      <n-space>
        <n-button secondary round type="info" bordered @click="openNavigation">
          <i class="me-2 fa-solid fa-map-location-dot" />Navigation
        </n-button>
        <n-popconfirm @positive-click="removeParkingLots">
          <template #trigger>
            <n-button secondary round type="warning" bordered :loading="removeParkingLotLoading">
              Remove
            </n-button>
          </template>
          Are you sure?
        </n-popconfirm>
      </n-space>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.map-page-container {
  height: 300px;
}
</style>
