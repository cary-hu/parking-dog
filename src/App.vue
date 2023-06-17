<script setup lang="ts">
</script>

<template>
  <HHeader />
  <n-message-provider keep-alive-on-hover closable placement="top-right" :max="10">
    <main container>
      <router-view />
    </main>
  </n-message-provider>
</template>
