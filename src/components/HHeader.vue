<script setup lang="ts">
import HavalFace from '@/assets/haval_dog.png'
</script>

<template>
  <header container relative flex items-center content-center>
    <router-link to="/" text-center mr-auto>
      <h1>
        <img :src="HavalFace" w-16>
        Parking Dog
      </h1>
    </router-link>
    <div h-full text-xl>
      <router-link to="/parking-lot" mx-2>
        <i class="fa-solid fa-square-parking" />
      </router-link>
      <router-link to="/parking" mx-2>
        <i class="fa-solid fa-car" />
      </router-link>
    </div>
  </header>
</template>
