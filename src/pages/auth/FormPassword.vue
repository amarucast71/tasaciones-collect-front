<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="max-width: 600px; width: 100%">
      <q-card-section class="row items-center">
        <div class="col-3">
          <q-avatar size="56px" icon="lock" />
        </div>
        <div class="col-9">
          <div class="text-h5">Cambiar Contraseña</div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="form.password" label="Contraseña Actual" type="password"
            :rules="[(val: any) => !!val || 'Contraseña es obligatoria']" clearable />
          <q-input v-model="form.new_password" label="Nueva Contraseña" type="password"
            :rules="[(val: any) => !!val || 'Nueva Contraseña es obligatoria']" clearable />
          <q-input v-model="form.new_password2" label="Repetir Nueva Contraseña" type="password"
            :rules="[(val: any) => !!val || 'Nueva Contraseña es obligatoria']" clearable />
          <div>
            <q-btn type="submit" label="Cambiar Contraseña" color="primary" class="full-width" />
          </div>
        </q-form>
      </q-card-section>

      <!-- <q-card-actions> -->
      <!--   <q-btn flat label="¿Olvidaste tu contraseña?" color="primary" /> -->
      <!-- </q-card-actions> -->
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios';
// import { useAuthStore } from 'src/stores/auth-store';

const $router = useRouter();
const $q = useQuasar()

// const authStore = useAuthStore();

const form = reactive({
  password: '',
  new_password: '',
  new_password2: '',
});

const onSubmit = async () => {
  if (form.new_password === form.new_password2) {
    const url = `${process.env.API}/api/authsm/change_password`;

    try {
      await api.post(url, form);
      $q.notify({
        message: 'Contraseña cambiada con éxito',
        color: 'positive',
        multiLine: true,
        icon: 'thumb_up',
        position: 'top'
      })
      $router.push('/');
    } catch (err: unknown) {
      console.log(err)
      $q.notify({
        message: `No se pudo cambiar la contraseña ${JSON.stringify((err as Error).message)}. Por favor verifique los datos ingresados`,
        color: 'negative',
        multiLine: true,
        icon: 'error',
        position: 'top'
      })
    }

  } else {
    $q.notify({
      message: 'Las contraseñas no coinciden',
      color: 'negative',
      icon: 'error',
      position: 'top'
    })
  }
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
