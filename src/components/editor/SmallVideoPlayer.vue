<template>
  <div class="col-start-2 row-start-7 row-span-2 lg:col-start-5 lg:row-start-3 lg:row-span-3">
    <video :style="styleVideo()" ref="videoElement" :src="''" controls source />
  </div>
</template>

<script setup lang="ts">
function styleVideo(): string {
  if ('' == '') {
    return 'width: 100%'
  } else {
    return ''
  }
}
</script>

<style scoped></style>
