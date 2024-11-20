<template>
  <q-page padding>

    <div class="q-pa-sm bg-blue-4 text-h6 text-white">
      Agregar o Editar Usuario
    </div>
    <div>
      <q-select
        emit-value
        map-options
        v-model="form.institucion"
        label="Institución u Organismo al que pertenece"
        :options="optInstituciones"
        @blur="v$.institucion.$touch"
        :error="v$.institucion.$error"
        error-message="Debe ingresar la institución"
      />

      <q-input
        v-model="form.last_name"
        label="Apellido:"
        @blur="v$.last_name.$touch"
        :error="v$.last_name.$error"
        error-message="Debe ingresar el apellido"
      />
      <q-input
        v-model="form.first_name"
        label="Nombre:"
        @blur="v$.first_name.$touch"
        :error="v$.first_name.$error"
        error-message="Debe ingresar el nombre"
      />

      <q-input
        v-model="form.usuario"
        label="Usuario:"
        @blur="v$.usuario.$touch"
        :error="v$.usuario.$error"
        error-message="Debe ingresar el usuario"
        hint="Corresponde al Usuario de la capa de ensayos. Debe escribirlo exactamente igual a como está en la capa"
      />

      <q-input
        v-model="form.email"
        label="Correo Electrónico:"
        @blur="v$.email.$touch"
        :error="v$.email.$error"
        error-message="Debe ingresar el correo electrónico"
      />

      <q-input
        v-model="form.password"
        label="Contraseña"
        type="password"
        @blur="v$.password.$touch"
        :error="v$.password.$error"
        error-message="Debe ingresar una contraseña de 6 o más caracteres"
      />

      <div class="q-gutter-sm q-my-md text-right">
        <q-btn
          outline
          label="Cancelar"
          color="blue-8"
          to="/admin/usuarios/list"
        />
        <q-btn
          label="Registrar"
          color="blue-8"
          :disable="v$.$invalid"
          @click="submitForm"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf, email, minLength } from '@vuelidate/validators';
import { api } from 'src/boot/axios';
import { NuevoUsuario, Institucion, OptionList } from 'src/components/admin';

const $router = useRouter();
const $route = useRoute();
const id = $route.query.id;

const instituciones = ref<Institucion[]>([]);
const optInstituciones = ref<OptionList[]>([]);

const form = ref<NuevoUsuario>({
  id: undefined,
  institucion: 0,
  last_name: '',
  first_name: '',
  usuario: '',
  email: '',
  password: '',
});

const rules = {
  institucion: { required },
  last_name: { required },
  first_name: { required },
  usuario: { required },
  email: { required, email },
  password: { requiredIf: requiredIf(!id), minLength: minLength(6) },
};

const v$ = useVuelidate(rules, form.value);

const getData = async () => {
  if (id) {
    const url = `${process.env.API}/api/v1/admin/usuarios/${id}`;
    const resp = await api.get(url);
    Object.assign(form.value, resp.data);
  }
};

const submitForm = async () => {
  try {
    if (id) {
      // let miform = Object.assign({}, form.value)
      // delete miform.password;
      const url = `${process.env.API}/api/v1/admin/usuarios/${id}`;
      await api.put(url, form.value);
    } else {
      const url = `${process.env.API}/api/v1/admin/usuarios`;
      await api.post(url, form.value);
    }
    $router.push('/admin/usuarios/list');
  } catch (error) {
    console.error('Error al registrar los datos:', error);
  }
};

const getInstituciones = async () => {
  const url = `${process.env.API}/api/v1/instituciones?page_size=1000`;
  const resp = await api.get(url);
  instituciones.value = resp.data.data;
  optInstituciones.value = instituciones.value
    .filter((item: Institucion) => item.id !== undefined)
    .map((item: Institucion) => ({
      label: item.nombre,
      value: item.id as number,
    }));
};

onMounted(async () => {
  setTimeout(async () => {
    await getInstituciones();
    await getData();
  }, 200);
});
</script>
