<template>
  <div v-show="showPopupPunto" ref="popupPunto">
    <popup-click-map />
  </div>

  <div v-show="showPopupRelevamiento" ref="popupRelevamiento">
    <popup-click-point />
  </div>
  <div id="map-view" class="map-view" ref="mapView"></div>
  <tool-bar @changeTool="setTool" />

</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, markRaw } from 'vue';
import {
  MaplibreLegendControl,
  LegendOptions,
} from '@watergis/maplibre-gl-legend';
import '@watergis/maplibre-gl-legend/dist/maplibre-gl-legend.css';
import '@watergis/maplibre-gl-legend/dist/maplibre-gl-legend.css';
import '../../node_modules/maplibre-gl/dist/maplibre-gl.css';
import {
  Map,
  NavigationControl,
  GeolocateControl,
  StyleSpecification,
  IControl,
  Popup,
  Marker,
} from 'maplibre-gl';


import { usePointsStore } from '../stores/points-store';
import { useAuthStore } from 'src/stores/auth-store';
import { PointSetting, PointData } from './points';
import ToolBar from './ToolBar.vue';
import PopupClickMap from './PopupClickMap.vue';
import PopupClickPoint from './PopupClickPoint.vue';
import { bus } from 'src/tools/bus';

interface Metadata {
  targets: { [key: string]: string };
}

interface Props {
  style?: StyleSpecification;
  id?: number;
  lat?: number;
  lng?: number;
}

const props = defineProps<Props>();
const pointsStore = usePointsStore();
const authStore = useAuthStore();

const mapView = shallowRef<string>('');
const map = shallowRef<Map | null>(null);
let currentMarker: Marker | null = null;
let clickedOnPoint = false;

const popupPunto = ref<Node | null>(null);
const popupRelevamiento = ref<Node | null>(null);
const showPopupPunto = ref(false);
const showPopupRelevamiento = ref(false);
const currentTool = ref<string>('')

const setTool = (tool: string) => {
  currentTool.value = tool
}

onMounted(() => {
  map.value = markRaw(
    new Map({
      container: 'map-view',
      style: props.style,
    })
  );

  map.value?.addControl(new NavigationControl(), 'top-right');
  map.value?.addControl(
    new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
  );

  setTimeout(() => {
    const style: StyleSpecification | undefined = map.value?.getStyle();

    if (
      style &&
      style.metadata &&
      typeof style.metadata === 'object' &&
      'targets' in style.metadata
    ) {
      const metadata = style.metadata as Metadata;

      const legendOption: LegendOptions = {
        title: 'Capas',
        showDefault: false,
        showCheckbox: true,
        onlyRendered: false,
        reverseOrder: true,
      };
      const legendControl = new MaplibreLegendControl(
        metadata.targets,
        legendOption
      ) as unknown as IControl;
      map.value?.addControl(legendControl, 'top-right');
    }

    const latitud = props.lat || pointsStore.setting?.coordinates.lat;
    const longitud = props.lng || pointsStore.setting?.coordinates.lng;
    const zoom = pointsStore.setting?.zoom;

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

    map.value?.setPaintProperty('puntos', 'circle-color', [
      'case',
      [
        'all',
        ['>', ['get', 'relevamientos_campania'], 0],
        ['==', ['get', 'id_usuario'], authStore.user.id]
      ],
      '#07e0fa',
      [
        'all',
        ['==', ['get', 'relevamientos_campania'], 0],
        ['==', ['get', 'id_usuario'], authStore.user.id]
      ],
      '#338ab4',
      [
        'all',
        ['>', ['get', 'relevamientos_campania'], 0],
        ['!=', ['get', 'id_usuario'], authStore.user.id]
      ],
      '#faa407',
      '#8F8F8F'
    ]);

    map.value?.addSource('offlinePoints', {
      type: 'geojson',
      data: pointsStore.geojsonPoints
    });

    map.value?.addLayer({
      id: 'offlinePointsLayer',
      type: 'circle',
      source: 'offlinePoints',
      paint: {
        'circle-radius': 12,
        'circle-color': '#9C27B0'
      }
    });


    map.value?.addLayer({
      id: 'offlinePointsLayer-labels',
      type: 'symbol',
      source: 'offlinePoints',
      layout: {
        'text-field': [
          'concat',
          ['get', 'nombre']
        ],
        'text-font': [
          'Open Sans',
          'Arial Unicode MS'
        ],
        'text-size': 11,
        'text-offset': [0, 1.5]
      },
      paint: {
        'text-color': '#000',
        'text-halo-color': '#ceb2d5',
        'text-halo-width': 2
      }
    })
  }, 500);

  map.value?.on('click', 'puntos', function (e) {
    if (!e.features || !map.value) {
      return;
    }

    if (currentTool.value === 'info') {

      clickedOnPoint = true;
      const properties = e.features[0].properties;

      const pointSetting: PointSetting = {
        coordinates: {
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        },
        zoom: map.value.getZoom(),
      };
      pointsStore.setLastPoint(pointSetting);

      const pointData: PointData = {
        id: properties.id,
        nombre: properties.nombre,
        latitud: properties.latitud,
        longitud: properties.longitud,
        fecha: properties.fecha,
        relevamientos_campania: properties.relevamientos_campania,
        relevamientos_total: properties.relevamientos_total,
        usuario: properties.id_usuario,
        usuario_nombre: properties.usuario,
        observaciones: properties.observaciones
      }

      pointsStore.setPointData(pointData)

      showPopupRelevamiento.value = true;
      if (popupRelevamiento.value) {
        new Popup()
          .setLngLat(e.lngLat)
          .setDOMContent(popupRelevamiento.value)
          .setMaxWidth('400')
          .addTo(map.value);
      }
    }
  });

  map.value?.on('mouseenter', 'puntos', function () {
    if (!map.value) {
      return;
    }
    map.value.getCanvas().style.cursor = 'pointer';
  });

  map.value?.on('mouseleave', 'puntos', function () {
    if (!map.value) {
      return;
    }
    map.value.getCanvas().style.cursor = '';
  });

  map.value?.on('click', function (e) {
    if (!map.value) {
      return;
    }

    if (currentTool.value === 'newpoint') {

      if (clickedOnPoint) {
        clickedOnPoint = false;
        return;
      }

      if (currentMarker !== null) {
        currentMarker?.remove();
      }

      currentMarker = new Marker().setLngLat(e.lngLat).addTo(map.value);
      // currentMarker = new Marker({ draggable: true }).setLngLat(e.lngLat).addTo(map.value);
      // currentMarker.on('dragend', () => {
      //   console.log(currentMarker?.getLngLat())
      // });

      const pointSetting: PointSetting = {
        coordinates: {
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        },
        zoom: map.value.getZoom(),
      };
      pointsStore.setLastPoint(pointSetting);
      map.value.flyTo({
        center: [pointSetting.coordinates.lng, pointSetting.coordinates.lat],
        speed: 0.4,
        essential: true
      });
      showPopupPunto.value = true;
      if (popupPunto.value) {
        new Popup({ anchor: 'top', offset: 5 })
          .setLngLat(e.lngLat)
          .setDOMContent(popupPunto.value)
          .setMaxWidth('300')
          .addTo(map.value);
      }
    }
  });

  window.addEventListener('online', async () => {
    await sincPuntosOffline()
  })
});

const sincPuntosOffline = async () => {
  setTimeout(() => {
    const source = map.value?.getSource('offlinePoints');
    if (source) {
      map.value?.removeLayer('offlinePointsLayer');
      map.value?.removeLayer('offlinePointsLayer-labels');
      map.value?.removeSource('offlinePoints');
      map.value?.addSource('offlinePoints', {
        type: 'geojson',
        data: pointsStore.geojsonPoints,
      });
      map.value?.addLayer({
        id: 'offlinePointsLayer',
        type: 'circle',
        source: 'offlinePoints',
        paint: {
          'circle-radius': 12,
          'circle-color': '#9C27B0'
        }
      });

    }
    map.value?.redraw();
  }, 3000);

}

bus.on('mapRefreshOffline', async () => {
  await sincPuntosOffline()
})

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
