<template>
  <q-page padding>
    <div class="q-my-lg q-pa-md bg-purple-5">
      {{ form }}
    </div>
    <div class="q-pa-sm bg-blue-4 text-h6 text-white">Agregar o Editar Asunto</div>
    <div>
      <!-- @update:model-value="resetForm" -->
      <!-- @blur="v$.datos.tipo_registro.$touch" -->
      <!-- :error="v$.datos.tipo_registro.$error" -->
      <!-- error-message="Debe completar el tipo de registro" -->
      <q-select
        clearable
        emit-value
        map-options
        v-model="form.padre"
        label="Iniciador"
        :options="optPadres"
      />

      <q-input v-model="form.nombre" label="Nombre:" @blur="v$.nombre.$touch" :error="v$.nombre.$error"
        error-message="Debe ingresar el nombre" />
      <q-input v-model="form.observaciones" label="Observaciones:" />

      <div class="q-gutter-sm q-my-md text-right">
        <q-btn outline label="Cancelar" color="blue-8" to="/admin/asuntos/list" />
        <q-btn label="Registrar" color="blue-8" :disable="v$.$invalid" @click="submitForm" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { api } from 'src/boot/axios'
import { Asunto } from 'src/components/admin'
import { getAsuntosPadres } from 'src/components/tools'

const $router = useRouter();
const $route = useRoute()
const id = $route.query.id

const form = ref<Asunto>({
  id: undefined,
  nombre: '',
  observaciones: '',
});

const padres = ref<Asunto[]>([]);

const rules = {
  nombre: { required }
}

const v$ = useVuelidate(rules, form.value)

const getData = async () => {
  if (id) {
    const url = `${process.env.API}/api/v1/asuntos/${id}`;
    const resp = await api.get(url)
    Object.assign(form.value, resp.data);
  }
}

const getPadres = async () => {
  const resp = await getAsuntosPadres()
  padres.value = resp.data.data
}

const optPadres = computed(() => {
  return padres.value.map(item => {
    return { value: item.id, label: item.nombre }
  })
})

const submitForm = async () => {
  try {
    if (id) {
      const url = `${process.env.API}/api/v1/asuntos/${id}`;
      await api.put(url, form.value)
    } else {
      const url = `${process.env.API}/api/v1/asuntos`;
      await api.post(url, form.value)

    }
    $router.push('/admin/asuntos/list');
  } catch (error) {
    console.error('Error al registrar los datos:', error);
  }
};

onMounted(async () => {
  setTimeout(async () => {
    await getPadres()
    await getData()
  }, 200)
})



</script>
