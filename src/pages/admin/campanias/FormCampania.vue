<template>
  <q-page padding>
    <div class="q-pa-sm bg-blue-4 text-h6 text-white">Agregar o Editar Campaña</div>
    <div>
      <q-input v-model="form.nombre" label="Nombre:" @blur="v$.nombre.$touch" :error="v$.nombre.$error"
        error-message="Debe ingresar el nombre" />

      <q-input v-model="form.inicio" label="Inicio:" type="date" @blur="v$.inicio.$touch" :error="v$.inicio.$error"
        error-message="Debe ingresar la fecha de inicio" />

      <q-input v-model="form.fin" label="Fin:" type="date" @blur="v$.fin.$touch" :error="v$.fin.$error"
        error-message="Debe ingresar la fecha de finalización" />

      <q-input v-model="form.relevamientos" label="Cantidad de Relevamientos Objetivo:" @blur="v$.relevamientos.$touch" :error="v$.relevamientos.$error"
        error-message="Debe ingresar cantidad de relevamientos" />

      <q-toggle
        left-label
        v-model="form.vigente"
        label="Campaña Vigente"
      />

      <q-input v-model="form.datos" label="Datos:" />

      <div class="q-gutter-sm q-my-md text-right">
        <q-btn outline label="Cancelar" color="blue-8" to="/admin/campanias/list" />
        <q-btn label="Registrar" color="blue-8" :disable="v$.$invalid" @click="submitForm" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import useVuelidate from '@vuelidate/core'
import { required, integer, minValue } from '@vuelidate/validators'
import { api } from 'src/boot/axios'
import { Campania } from 'src/components/admin'

const $router = useRouter();
const $route = useRoute()
const id = $route.query.id

const form = ref<Campania>({
  id: undefined,
  nombre: '',
  inicio: '',
  fin: '',
  relevamientos: 0,
  vigente: false,
  datos: '',
});

const rules = {
  nombre: { required },
  inicio: { required },
  fin: { required },
  relevamientos: { required, integer, minValue: minValue(0) },
}

const v$ = useVuelidate(rules, form.value)

const getData = async () => {
  if (id) {
    const url = `${process.env.API}/api/v1/campanias/${id}`;
    const resp = await api.get(url)
    // form.value.id = resp.data.id;
    // form.value.nombre = resp.data.nombre;
    // form.value.inicio = resp.data.inicio;
    // form.value.fin = resp.data.fin;
    // form.value.relevamientos = resp.data.relevamientos;
    // form.value.vigente = resp.data.vigente;
    // form.value.datos = resp.data.datos;
    Object.assign(form.value, resp.data);
  }
}

const submitForm = async () => {
  try {
    if (id) {
      const url = `${process.env.API}/api/v1/campanias/${id}`;
      await api.put(url, form.value)
    } else {
      const url = `${process.env.API}/api/v1/campanias`;
      await api.post(url, form.value)
    }
    $router.push('/admin/campanias/list');
  } catch (error) {
    console.error('Error al registrar los datos:', error);
  }
};

onMounted(async () => {
  setTimeout(async () => {
    await getData()
  }, 200)
})



</script>
