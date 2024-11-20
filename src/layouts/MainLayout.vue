<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <modo-offline v-if="isOffline" />

      <q-toolbar class="bg-grey-9">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Tasaciones
          <div class="text-caption">
            IDECOR Collect
          </div>
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <q-btn v-if="authStore.isLoggedIn" flat round dense icon="person">
          <q-menu>
            <q-list style="min-width: 260px">
              <q-item clickable v-close-popup to="/changepassword">
                <q-item-section avatar>
                  <q-icon name="password" />
                </q-item-section>
                <q-item-section>Cambiar Contraseña</q-item-section>
              </q-item>
              <q-separator />
              <do-logout />
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header>
          Menú
        </q-item-label>
        <main-menu v-if="authStore.isLoggedIn" :items="itemsCollect" />
        <main-menu v-if="authStore.isLoggedIn && authStore.isAdmin" :items="itemsAdmin" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePointsStore } from 'src/stores/points-store';
import { useAuthStore } from 'src/stores/auth-store';
import MainMenu from 'src/components/menu/MainMenu.vue';
import ModoOffline from 'src/components/ModoOffline.vue';
import { Item } from 'src/components/menu';
import DoLogout from 'src/components/auth/DoLogout.vue';
import collectMenu from 'src/data/collectMenu.json'
import adminMenu from 'src/data/adminMenu.json'

// const components = {
//   MainMenu,
//   ModoOffline,
//   DoLogout
// };
//
// defineOptions({
//   name: 'MainLayout',
//   components: components
// });

const isOffline = ref(false)
const pointsStore = usePointsStore();
const authStore = useAuthStore();
const leftDrawerOpen = ref(false);
const itemsCollect: Item[] = collectMenu;
const itemsAdmin: Item[] = adminMenu;

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

onMounted(() => {
  window.addEventListener('online', () => {
    isOffline.value = false
    pointsStore.syncPointsOffline()
  })
  window.addEventListener('offline', () => {
    isOffline.value = true
  })

})
</script>
