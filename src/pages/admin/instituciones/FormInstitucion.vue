<template>
  <q-page padding>
    <div class="q-pa-sm bg-blue-4 text-h6 text-white">Agregar o Editar Institución</div>
    <div>
      <q-input v-model="form.nombre" label="Nombre:" @blur="v$.nombre.$touch" :error="v$.nombre.$error"
        error-message="Debe ingresar el nombre" />
      <q-input v-model="form.datos" label="Datos:" />

      <div class="q-gutter-sm q-my-md text-right">
        <q-btn outline label="Cancelar" color="blue-8" to="/admin/instituciones/list" />
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
import { api } from 'src/boot/axios'
import { Institucion } from 'src/components/admin'

const $router = useRouter();
const $route = useRoute()
const id = $route.query.id

const form = ref<Institucion>({
  id: undefined,
  nombre: '',
  datos: '',
});

const rules = {
  nombre: { required }
}

const v$ = useVuelidate(rules, form.value)

const getData = async () => {
  if (id) {
    const url = `${process.env.API}/api/v1/instituciones/${id}`;
    const resp = await api.get(url)
    Object.assign(form.value, resp.data);
  }
}

const submitForm = async () => {
  try {
    if (id) {
      const url = `${process.env.API}/api/v1/instituciones/${id}`;
      await api.put(url, form.value)
    } else {
      const url = `${process.env.API}/api/v1/instituciones`;
      await api.post(url, form.value)

    }
    $router.push('/admin/instituciones/list');
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
