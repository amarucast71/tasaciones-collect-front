<template>
  <q-dialog v-model="dlgReferencias" persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 400px">
      <div class="q-pa-md bg-blue-7 text-white">
        <div class="text-h6">Referencias</div>
      </div>

      <q-card-section class="">
        <div class="">
          <q-img src="~/assets/referencias.png" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-blue-7">
        <q-btn flat label="Cerrar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-page-sticky position="top-left" :offset="[10, 10]">
    <q-fab v-model="state" square external-label color="grey-1" text-color="grey-9" padding="xs"
      icon="keyboard_arrow_down" direction="down">
      <q-fab-action square external-label label="Agregar punto" padding="xs" icon="add_location"
        :color="currentTool === 'newpoint' ? 'grey-9' : 'grey-1'"
        :text-color="currentTool === 'newpoint' ? 'grey-1' : 'grey-9'" @click="setTool('newpoint')" />
      <q-fab-action square external-label label="Información" padding="xs" icon="info"
        :color="currentTool === 'info' ? 'grey-9' : 'grey-1'" :text-color="currentTool === 'info' ? 'grey-1' : 'grey-9'"
        @click="setTool('info')" />
      <q-fab-action square external-label label="Puntos registrados" padding="xs" icon="list"
        :color="currentTool === 'listado' ? 'grey-9' : 'grey-1'"
        :text-color="currentTool === 'listado' ? 'grey-1' : 'grey-9'" to="/collect/puntos" />
      <q-fab-action square external-label
        :disable="btnOffLineDisable"
        label="Sincronizar puntos offline" padding="xs" icon="rss_feed" color="grey-1"
        text-color="grey-9" @click="sincronizarPuntosOffline" />

      <q-fab-action square external-label label="Referencias" padding="xs" icon="map" color="grey-1" text-color="grey-9"
        @click="dlgReferencias = true" />
    </q-fab>
  </q-page-sticky>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue'
import { usePointsStore } from 'src/stores/points-store';
import { bus } from 'src/tools/bus';


const pointsStore = usePointsStore();
const state = ref(true)
const dlgReferencias = ref(false)
const emit = defineEmits(['changeTool'])
const currentTool = ref('newpoint')

emit('changeTool', currentTool.value)

const setTool = (tool: string) => {
  currentTool.value = tool
  emit('changeTool', tool)
}

const sincronizarPuntosOffline = () => {
  pointsStore.syncPointsOffline()
  bus.emit('mapRefreshOffline');

}

const btnOffLineDisable = computed(() => {
  return pointsStore.offlinePoints.length === 0 || !navigator.onLine
})
</script>
