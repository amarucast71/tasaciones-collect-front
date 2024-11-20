<template>
  <q-page>
    <div class="map-container">
      <map-view
        v-if="showMap"
        class="fit"
        :style="jsonDataStyle"
        :id="props.id"
        :lat="props.lat"
        :lng="props.lng"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { StyleSpecification } from 'maplibre-gl';
import { useAuthStore } from 'src/stores/auth-store';
import MapView from 'src/components/MapView.vue';
import jsonData from 'src/assets/data/style.json';

interface Props {
  id?: number;
  lat?: number;
  lng?: number;
}
const props = defineProps<Props>();
const authStore = useAuthStore();
const showMap = ref(false)

console.log(authStore.user.id)
jsonData.sources.puntos_src.tiles[0] = `${process.env.API}/mvt/tiles/{z}/{x}/{y}.pbf`;
// jsonData.sources.ensayos_src.tiles[0] = `${process.env.API}/mvt/ensayos/tiles/{z}/{x}/{y}.pbf?uid=${authStore.user.id}`;


const jsonDataStyle: StyleSpecification = jsonData as StyleSpecification;
showMap.value = true
</script>

<style scoped>
.map-container {
  width: 100%;
  height: calc(100vh - 50px);
}
</style>
