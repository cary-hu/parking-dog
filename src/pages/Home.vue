<script setup lang="ts">
const message = useMessage()
</script>

<template>
  Hi
  Hi
  <n-button @click="message.warning('This is a test warning')">
    naive-ui
  </n-button>
</template>
