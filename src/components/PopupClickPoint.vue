<template>
  <div class="text-h6">{{ point?.nombre }}</div>
  <div class="text-caption text-bold">ID: {{ point?.id }}</div>
  <div class="text-caption">Fecha: {{ point?.fecha }}</div>
  <div class="text-caption">Relevamientos Campaña: {{ point?.relevamientos_campania }}</div>
  <div class="text-caption">Relevamientos Totales: {{ point?.relevamientos_total }}</div>
  <div class="text-caption">Usuario: {{ point?.usuario_nombre }}</div>
  <div class="q-gutter-xs column">
    <q-btn v-if="authStore.user.id === point?.usuario" outline label="Editar Punto" color="primary" icon="edit"
      :to="`/collect/formpunto?id=${point?.id}`" />
    <q-btn outline label="Datos Punto" color="primary" icon="description" @click="showDataPoint" />
    <q-btn outline label="Agregar Relevamiento" color="primary" icon="library_add"
      :to="`/collect/formrelevamiento?punto=${point?.id}`" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePointsStore } from '../stores/points-store';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { PointData } from './points';

const pointsStore = usePointsStore();
const authStore = useAuthStore();
// console.log(pointsStore)
const point = computed<PointData | null>(() => pointsStore.point);
const $router = useRouter();

const showDataPoint = async () => {
  const url = `${process.env.API}/api/v1/puntos/${point.value?.id}`;
  const resp = await api.get(url)

  pointsStore.setPointData(resp.data)
  $router.push('/collect/punto');
}
// </script>
