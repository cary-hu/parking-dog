<script setup lang="ts">
import { ParkingLotInfo } from '@/@types/parkingLot'
import { MapUtils } from '@/utils/mapUtils'
import parkingLotService from '@/services/parkingLotService'

const message = useMessage()

const allParkingLots = ref<ParkingLotInfo[]>([])
const addParkingLotDialog = ref(false)
const addParkingLotFormValid = ref(false)
const addParkingLotLoading = ref(false)
const addParkingLotData = ref(new ParkingLotInfo())
const zoom = ref(16)
const addPackingLotMapZoom = ref(1)
const center = ref([108.86888340442673, 34.237322002402756])
const home = ref([108.87116, 34.234962])
const distanceBetweenHomeAndParkingLot = computed(() => {
  return MapUtils._distance(center.value, home.value).toFixed(2)
})
let map: any = null

const parkingLotsLoading = ref(true)
async function refreshParkingLots() {
  parkingLotsLoading.value = true
  allParkingLots.value = await parkingLotService.getParkingLots()
  parkingLotsLoading.value = false
}
async function addParkingLots() {
  addParkingLotLoading.value = true
  try {
    await parkingLotService.addOrUpdateParkingLot(addParkingLotData.value)
    await refreshParkingLots()
    message.success('Add new parking lot successful')
    addParkingLotDialog.value = false
  }
  catch (error) {
    message.warning('Add new parking lot failed')
  }
  addParkingLotLoading.value = false
}
function onOpenAddParkingLotDialog() {
  addParkingLotDialog.value = true
  addParkingLotData.value = new ParkingLotInfo()
}

async function refreshCenter() {
  try {
    const position = await MapUtils.getCurrentLocation()
    center.value[0] = position[0]
    center.value[1] = position[1]
  }
  catch (error) {
    setTimeout(() => {
      refreshCenter()
    }, 100)
  }
}

function mapInit(_map: any) {
  map = _map
  watch(center, () => {
    map.setCenter(center.value, true)
    draw(center.value)
  }, {
    immediate: true,
  })
  refreshCenter()
  addPackingLotMapZoom.value = 16
}
function draw(pos: number[]) {
  if (!map) {
    setTimeout(() => {
      draw(pos)
    }, 1000)
    return
  }
  map.clearMap()
  center.value = pos
  const marker = new (AMap as any).Marker({
    position: pos,
  })
  map.add(marker)
  addParkingLotData.value.location.lng = pos[0]
  addParkingLotData.value.location.lat = pos[1]
}

async function init() {
  await parkingLotService.ensureParkingLotBasket()
  await refreshParkingLots()
}

onMounted(() => {
  init()
})
</script>

<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col align="center">
          <n-button round type="primary" size="large" @click="onOpenAddParkingLotDialog">
            <i class="fa-solid fa-plus" />
          </n-button>
        </v-col>
      </v-row>
      <v-row v-if="parkingLotsLoading">
        <v-col v-for="index in 6" :key="index">
          <n-skeleton height="140px" width="572px" />
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="parkingLot in allParkingLots" :key="parkingLot.id">
          <ParkingLotItem :parking-lot-info="parkingLot" @onItemRemoved="refreshParkingLots" />
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="addParkingLotDialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Parking Lot</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn variant="text" @click="addParkingLotDialog = false">
              Exit
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-progress-linear :indeterminate="addParkingLotLoading" />
        <v-form v-model="addParkingLotFormValid" :disabled="addParkingLotLoading" @submit.prevent="addParkingLots">
          <v-container fluid>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="addParkingLotData.name"
                  label="Parking Lot Name"
                  required
                  persistent-hint
                  :hint="`${addParkingLotData.cost.price} Yuan, per ${addParkingLotData.cost.per} ${addParkingLotData.cost.period}, away from home ${distanceBetweenHomeAndParkingLot} miles`"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="addParkingLotData.cost.price" label="Price" />
              </v-col>
              <v-col>
                <v-text-field v-model="addParkingLotData.cost.per" label="Per" />
              </v-col>
              <v-col>
                <v-select
                  v-model="addParkingLotData.cost.period" label="Unit"

                  :items="['hour', 'day', 'week', 'month', 'year']"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-text-field v-model="addParkingLotData.location.lng" label="longitude" disabled class="d-none" />
              <v-text-field v-model="addParkingLotData.location.lat" label="latitude" disabled class="d-none" />
            </v-row>
            <v-row>
              <v-col>
                <div class="map-page-container" style="z-index: 1;">
                  <div class="map-maker-position">
                    {{ addParkingLotData.location.lng }} {{ addParkingLotData.location.lat }}
                  </div>
                  <el-amap :center="center" :zoom="addPackingLotMapZoom" @init="mapInit">
                    <el-amap-mouse-tool type="marker" :show-tooltip="false" @draw="draw" />
                    <el-amap-control-map-type :visible="false" :show-road="true" :show-traffic="true" />
                  </el-amap>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-btn type="submit" block class="mt-2">
            Add
          </v-btn>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.map-page-container {
  width: 100%;
  height: 300px;
  position: relative;
}

.map-page-container::after {
  display: none;
}

.map-maker-position {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.35;
}
</style>
