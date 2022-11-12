<template>
    <div>
        <InlineSvg :src="dlIcon" width="50px" />
    </div>

</template>

<script setup lang="ts">
import dlIcon from '@/assets/icons/download.svg';
import InlineSvg from "vue-inline-svg";

</script>

<style scoped>

    img { color: white; }

</style>