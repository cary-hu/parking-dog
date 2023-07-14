<script setup lang="ts">
import { AppWriteDatabase } from '@/services/appwrite'
import { ParkingInfoCollectionID } from '@/services/appwrite/constraint'
</script>

<template>
  <button @click="AppWriteDatabase.createEntity(ParkingInfoCollectionID, { a: 123 })">
    123
  </button>
</template>
