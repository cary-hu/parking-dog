<script setup lang="ts">
import { ParkingLotInfo } from '@/@types/parkingLot'
import parkingLotService from '@/services/parkingLotService'

const allParkingLots = ref<ParkingLotInfo[]>([])
const addParkingLotDialog = ref(false)
const addParkingLotFormValid = ref(false)
const addParkingLotData = ref(new ParkingLotInfo())
const zoom = ref(12)
const center = ref([121.59996, 31.197646])
let map: any = null
watch(center, () => {
  map.setCenter(center, true)
})
const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
}
navigator.geolocation.getCurrentPosition((pos) => {
  const crd = pos.coords
  center.value[1] = crd.latitude
  center.value[0] = crd.longitude
  draw(center.value)
}, null, geolocationOptions)
navigator.geolocation.watchPosition((pos) => {
  const crd = pos.coords
  center.value[1] = crd.latitude
  center.value[0] = crd.longitude
  draw(center.value)
}, null, geolocationOptions)

async function getParkingLots() {
  allParkingLots.value = await parkingLotService.getParkingLots()
}
async function addParkingLots() {
  await parkingLotService.addOrUpdateParkingLot(new ParkingLotInfo())
}
function onOpenAddParkingLotDialog() {
  addParkingLotData.value = new ParkingLotInfo()
}

function mapInit(e: any) {
  const marker = new (AMap as any).Marker({
    position: center.value,
  })
  e.add(marker)
  map = e
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
}

parkingLotService.ensureParkingLotBasket()
</script>

<template>
  <h1>Parking Lot</h1>
  <v-btn-group>
    <v-dialog
      v-model="addParkingLotDialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <template #activator="{ props }">
        <v-btn
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
            <v-btn
              variant="text"
              @click="addParkingLotDialog = false"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form v-model="addParkingLotFormValid">
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
                  :hint="`${addParkingLotData.cost.price} Yuan, per ${addParkingLotData.cost.per} ${addParkingLotData.cost.period}`"
                  :items="['hour', 'day', 'week', 'month', 'year']"
                />
              </v-col>
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
        </v-form>
      </v-card>
    </v-dialog>
    <v-btn>
      Update Parking Lot
    </v-btn>
    <v-btn @click="getParkingLots">
      Get All Parking Lot
    </v-btn>
  </v-btn-group>
  <div>
    <ParkingLotItem v-for="parkingLot in allParkingLots" :key="parkingLot.id" :item="parkingLot" />
  </div>
</template>

<style>
.map-page-container {
  width:100%;
  height: 500px;
  }
</style>
