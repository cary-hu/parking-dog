<script setup lang="ts">
import { ParkingLotInfo } from '@/@types/parkingLot'
import parkingLotService from '@/services/parkingLotService'

async function getParkingLots() {
  const parkingLots = await parkingLotService.getParkingLots()
  console.log(parkingLots)
}
async function addParkingLots() {
  await parkingLotService.addOrUpdateParkingLot(new ParkingLotInfo())
}
async function removeParkingLots() {
  await parkingLotService.removeParkingLot('f10b9f2d-dd49-4edc-9864-cb8ea6e690b4')
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
    <button class="btn btn-primary" @click="removeParkingLots">
      Remove Parking Lot
    </button>
    <button class="btn btn-primary" @click="getParkingLots">
      Get All Parking Lot
    </button>
  </div>
</template>
