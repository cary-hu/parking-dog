<script setup lang="ts">
import { ParkingLotInfo } from '@/@types/parkingLot'
import { MapUtils } from '@/mapUtils'
import parkingLotService from '@/services/parkingLotService'

const allParkingLots = ref<ParkingLotInfo[]>([])
const addParkingLotDialog = ref(false)
const addParkingLotFormValid = ref(false)
const addParkingLotLoading = ref(false)
const addParkingLotData = ref(new ParkingLotInfo())
const zoom = ref(16)
const center = ref([108.86888340442673, 34.237322002402756])
const home = ref([108.87116, 34.234962])
const distanceBetweenHomeAndParkingLot = computed(() => {
  return MapUtils.distance(center.value, home.value)
})
let map: any = null

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
}

async function getParkingLots() {
  allParkingLots.value = await parkingLotService.getParkingLots()
}
async function addParkingLots() {
  addParkingLotLoading.value = true
  try {
    await parkingLotService.addOrUpdateParkingLot(addParkingLotData.value)
    addParkingLotDialog.value = false
  }
  catch (error) {

  }
  addParkingLotLoading.value = false
}
function onOpenAddParkingLotDialog() {
  addParkingLotData.value = new ParkingLotInfo()
}

function mapInit(_map: any) {
  map = _map
  watch(center, () => {
    map.setCenter(center.value, true)
    draw(center.value)
  }, {
    immediate: true,
  })
  navigator.geolocation.getCurrentPosition((pos) => {
    const crd = pos.coords
    center.value[0] = crd.longitude
    center.value[1] = crd.latitude
  }, null, geolocationOptions)
}
function draw(pos: number[]) {
  if (!map) {
    setTimeout(() => {
      draw(pos)
    }, 1000)
    return
  }
  map.clearMap()
  const marker = new (AMap as any).Marker({
    position: pos,
  })
  map.add(marker)
  addParkingLotData.value.location.lng = pos[0]
  addParkingLotData.value.location.lat = pos[1]
}

async function init() {
  await parkingLotService.ensureParkingLotBasket()
}

onMounted(() => {
  init()
})
</script>

<template>
  <h1>Parking Lot</h1>
  <v-dialog
    v-model="addParkingLotDialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <template #activator="{ props }">
      <v-btn
        variant="elevated"
        v-bind="props"
        @click="onOpenAddParkingLotDialog"
      >
        Add Parking Lot
      </v-btn>
    </template>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Parking Lot</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            variant="text"
            @click="addParkingLotDialog = false"
          >
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
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="addParkingLotData.cost.price"
                label="Price"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="addParkingLotData.cost.per"
                label="Per"
              />
            </v-col>
            <v-col>
              <v-select
                v-model="addParkingLotData.cost.period"
                label="Unit"
                persistent-hint
                :hint="`${addParkingLotData.cost.price} Yuan, per ${addParkingLotData.cost.per} ${addParkingLotData.cost.period}, away from home ${distanceBetweenHomeAndParkingLot} miles`"
                :items="['hour', 'day', 'week', 'month', 'year']"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-text-field
              v-model="addParkingLotData.location.lng"
              label="longitude"
              disabled
            />
            <v-text-field
              v-model="addParkingLotData.location.lat"
              label="latitude"
              disabled
            />
          </v-row>
          <v-row>
            <v-col>
              <div class="map-page-container">
                <el-amap
                  :center="center"
                  :zoom="zoom"
                  @init="mapInit"
                >
                  <el-amap-mouse-tool
                    type="marker"
                    :show-tooltip="false"
                    @draw="draw"
                  />
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
  <v-btn mx-2>
    Update Parking Lot
  </v-btn>
  <v-btn @click="getParkingLots">
    Get All Parking Lot
  </v-btn>
  <div>
    <ParkingLotItem v-for="parkingLot in allParkingLots" :key="parkingLot.id" :item="parkingLot" />
  </div>
</template>

<style>
.map-page-container {
  width:100%;
  height: 300px;
  }
</style>
