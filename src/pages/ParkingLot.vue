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
  <div class="btn-group btn-group-sm">
    <button class="btn btn-primary" @click="addParkingLots">
      Add Parking Lot
    </button>
    <button class="btn btn-primary">
      Update Parking Lot
    </button>

    <button class="btn btn-primary" @click="getParkingLots">
      Get All Parking Lot
    </button>
  </div>
  <div>
    <ParkingLotItem v-for="parkingLot in allParkingLots" :key="parkingLot.id" :item="parkingLot" />
  </div>
</template>
