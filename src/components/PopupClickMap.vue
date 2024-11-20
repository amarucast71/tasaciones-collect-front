<template>
  <div class="text-center text-caption">({{lat}}, {{lng}})</div>
    <q-btn
      outline
      label="Registrar Ubicación"
      color="primary"
      icon="location_on"
      to="/collect/formpunto"
    />
</template>

<script setup lang="ts">
import { usePointsStore } from '../stores/points-store';
const pointsStore = usePointsStore();
// console.log(pointsStore)
const lng = pointsStore.setting?.coordinates.lng.toFixed(8);
const lat = pointsStore.setting?.coordinates.lat.toFixed(8);
</script>
