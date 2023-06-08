<script setup lang="ts">
import pantry from './services/pantry'

async function a() {
  const b = await pantry.getDetails()
  console.log(b)
}
a()
</script>

<template>
  <HHeader />
  <main container>
    <ParkingInfo />
  </main>
  <HFooter />
</template>
