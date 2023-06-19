<script setup lang="ts">
</script>

<template>
  <header container relative flex items-center content-center>
    <router-link to="/" text-center mr-auto>
      <h1>
        Parking Dog
      </h1>
    </router-link>
    <div h-full text-xl>
      <router-link to="/parking-lot" mx-2>
        <i class="fa-solid fa-square-parking" />
      </router-link>
      <router-link to="/" mx-2>
        <i class="fa-solid fa-car" />
      </router-link>
    </div>
  </header>
</template>
