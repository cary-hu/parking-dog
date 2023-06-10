<script setup lang="ts">
import { ParkingLotInfo } from '@/@types/parkingLot'
import parkingLotService from '@/services/parkingLotService'

const props = defineProps({
  item: ParkingLotInfo!,
})
async function removeParkingLots() {
  await parkingLotService.removeParkingLot(props.item!.id)
}
</script>

<template>
  <div>
    {{ item!.name }}
    <button class="btn btn-primary" @click="removeParkingLots">
      Remove Parking Lot
    </button>
  </div>
</template>
