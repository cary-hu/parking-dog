<script setup lang="ts">
import type { ParkingLotInfo } from '@/@types/parkingLot'
import parkingLotService from '@/services/parkingLotService'

const allParkingLots = ref<ParkingLotInfo[]>([])
const noParkingLotSnackbar = ref(false)
const router = useRouter()
function onParking() {
  if (allParkingLots.value.length === 0)
    noParkingLotSnackbar.value = true
}
function onGoToAddParkingLot() {
  noParkingLotSnackbar.value = false
  router.replace('/parking-lot')
}
async function init() {
  allParkingLots.value = await parkingLotService.getParkingLots()
}
onMounted(() => {
  init()
})
</script>

<template>
  <v-btn-group>
    <v-btn @click="onParking">
      Parking
    </v-btn>
    <v-btn>
      Go
    </v-btn>
  </v-btn-group>
  <div>
    <ParkingInfoItem />
  </div>
  <v-snackbar
    v-model="noParkingLotSnackbar"
  >
    There is no parking lot, go to add?

    <template #actions>
      <v-btn
        color="pink"
        variant="text"
        @click="onGoToAddParkingLot"
      >
        Add Parking Lot
      </v-btn>
    </template>
  </v-snackbar>
</template>
