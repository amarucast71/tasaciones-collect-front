<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="max-width: 600px; width: 100%">
      <q-card-section class="row items-center">
        <div class="col-3">
          <q-avatar size="56px" icon="lock" />
        </div>
        <div class="col-9">
          <div class="text-h5">Iniciar Sesión</div>
          <div class="text-subtitle2">
            Introduce tus credenciales para acceder
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="form.email" label="Correo Electrónico" type="email" :rules="[
            (val: any) => !!val || 'Correo electrónico es obligatorio',
            (val: string) => /.+@.+\..+/.test(val) || 'Correo debe ser válido',
          ]" clearable />
          <q-input v-model="form.password" label="Contraseña" type="password"
            :rules="[(val: any) => !!val || 'Contraseña es obligatoria']" clearable />
          <div>
            <q-btn type="submit" label="Ingresar" color="primary" class="full-width" />
          </div>
        </q-form>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { useAuthStore } from 'src/stores/auth-store';

const $router = useRouter();
const $q = useQuasar()
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
  d: 30,
});

const onSubmit = async () => {
  if (form.email && form.password) {
    const url = `${process.env.API}/api/authsm/login`;
    try {
      const resp = await api.post(url, form);
      authStore.setUser(resp.data.data);
      $router.push('/collect/map/');
    } catch (err: unknown) {
      $q.notify({
        message: `Error de validación ${JSON.stringify((err as Error).message)}. Por favor verifique las credenciales ingresadas`,
        color: 'negative',
        multiLine: true,
        icon: 'error',
        position: 'top'
      })
    }
  }
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
