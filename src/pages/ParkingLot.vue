<script setup lang="ts">
import { ParkingLotInfo } from '@/@types/parkingLot'
import parkingLotService from '@/services/parkingLotService'

const allParkingLots = ref<ParkingLotInfo[]>([])

async function getParkingLots() {
  allParkingLots.value = await parkingLotService.getParkingLots()
}
async function addParkingLots() {
  await parkingLotService.addOrUpdateParkingLot(new ParkingLotInfo())
}

parkingLotService.ensureParkingLotBasket()
</script>

<template>
  <h1>Parking Lot</h1>
  <v-btn-group>
    <v-btn @click="addParkingLots">
      Add Parking Lot
    </v-btn>
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
