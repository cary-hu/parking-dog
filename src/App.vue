<script setup lang="ts">
</script>

<template>
  <HHeader />
  <n-message-provider keep-alive-on-hover closable placement="top-right">
    <main container>
      <router-view />
    </main>
  </n-message-provider>
</template>
