<template>
  <q-page padding>
    <div class="q-pa-sm bg-blue-4 text-h6 text-white">Agregar o Editar Punto</div>
    <div>
      <q-input v-model="form.nombre" label="Nombre:" @blur="v$.nombre.$touch" :error="v$.nombre.$error"
        error-message="Debe ingresar el nombre" />
      <q-input v-model="form.observaciones" label="Observaciones:" />

      <div class="q-gutter-sm q-my-md text-right">
        <q-btn outline label="Cancelar" color="blue-8" to="/collect/map" />
        <q-btn label="Registrar" color="blue-8" :disable="v$.$invalid" @click="submitForm" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { api } from 'src/boot/axios';
import { usePointsStore } from 'src/stores/points-store';
import { NewPoint } from 'src/components/points'

const $router = useRouter();
const $route = useRoute()
const pointsStore = usePointsStore();
const id = $route.query.id
const retorno = $route.query.r

const lng = pointsStore.setting?.coordinates.lng;
const lat = pointsStore.setting?.coordinates.lat;

const form = ref<NewPoint>({
  id: undefined,
  nombre: '',
  observaciones: '',
  latitud: undefined,
  longitud: undefined,
  relevamientos: []
});

const rules = {
  nombre: { required }
}

const v$ = useVuelidate(rules, form.value)

onMounted(async () => {
  if (id) {
    const url = `${process.env.API}/api/v1/puntos/${id}`;
    const resp = await api.get(url)
    Object.assign(form.value, resp.data);
  }
})

const submitForm = async () => {
  form.value.latitud = Number(lat)
  form.value.longitud = Number(lng)

  try {
    let urlRedirect
    if (id) {
      if (retorno === 'list') {
        urlRedirect = '/collect/puntos'
      } else {
        urlRedirect = '/collect/map'
      }
    } else {
      urlRedirect = '/collect/formrelevamiento?b=map'
    }

    pointsStore.createPoint(form.value)
    $router.push(urlRedirect);
  } catch (error) {
    console.error('Error al registrar el punto:', error);
  }
};
</script>
