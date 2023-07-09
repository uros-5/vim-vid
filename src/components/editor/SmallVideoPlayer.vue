<template>
  <div
    class="col-start-2 row-start-6 row-span-2 lg:col-start-5 lg:row-start-1 lg:row-span-2 lg:flex lg:items-center lg:justify-center"
  >
    <video class="m-2" :style="styleVideo()" ref="videoElement" :src="''" controls source></video>
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
