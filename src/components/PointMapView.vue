<template>
  <div id="map-view" class="map-view" ref="mapView"></div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted, markRaw } from 'vue';
import '../../node_modules/maplibre-gl/dist/maplibre-gl.css';
import {
  Map,
  Marker,
  StyleSpecification
} from 'maplibre-gl';


// import { PointSetting, PointData } from './points';

interface Props {
  style?: StyleSpecification;
  id?: number;
  lat?: number;
  lng?: number;
  zoom?: number;
}

const props = defineProps<Props>();

const mapView = shallowRef<string>('');
const map = shallowRef<Map | null>(null);
let currentMarker: Marker | null = null;


onMounted(() => {
  map.value = markRaw(
    new Map({
      container: 'map-view',
      style: props.style,
    })
  );

  setTimeout(() => {
    const latitud = props.lat;
    const longitud = props.lng;
    const zoom = props.zoom;

    if (latitud && longitud && zoom) {
      if (!map.value) {
        return;
      }
      map.value?.setCenter([longitud, latitud]);
      map.value?.setZoom(zoom);
      if (currentMarker !== null) {
        currentMarker?.remove();
      }
      currentMarker = new Marker()
        .setLngLat([longitud, latitud])
        .addTo(map.value);
    }

  }, 500);
});

onUnmounted(() => {
  map.value?.remove();
});
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
}
</style>
