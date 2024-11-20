<template>
  <q-item v-if="authStore.isLoggedIn" clickable v-close-popup @click="confirm">
    <q-item-section avatar>
      <q-icon name="logout" />
    </q-item-section>
    <q-item-section>Salir</q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store';

const $router = useRouter();

const $q = useQuasar();
const authStore = useAuthStore();

const confirm = () => {
  $q.dialog({
    title: 'Salir de la Aplicación',
    message: '¿Está seguro que quiere salir de la apicación',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    authStore.doLogout()
    $router.push('/');
  })
}
</script>
