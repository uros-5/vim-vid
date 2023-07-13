<template>
  <router-link to="/">
    <InlineSvg :src="mainLogo" />
  </router-link>
</template>

<script setup lang="ts">
import InlineSvg from 'vue-inline-svg'
import mainLogo from '@/assets/mainlogo.svg'
</script>

<style></style>
