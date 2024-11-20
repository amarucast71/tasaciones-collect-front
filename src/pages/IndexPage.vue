<template>
  <q-page class="bg-index">
    <div class="constrain">
      <div class="text-center">
        <img class="icono" alt="Agroforestal Collect" src="images/pin.svg" width="100px">
      </div>
      <div class="q-mb-sm bienvenida text-grey-9 text-caption text-center">
        <div class="text-h3 text-bold">
          Tasaciones Collect
        </div>
        <div class="q-mt-lg subtitulo">
          Recolector de datos del Consejo General de Tasaciones de la Provincia de Córdoba
        </div>
        <div class="q-mt-md text-grey-8 landcollect">
          Basado en IDECOR Land Collect
        </div>
      </div>
      <div class="">
        <div v-if="!authStore.isLoggedIn" class="">
          <q-btn outline class="q-mb-sm text-grey-8 full-width" icon="login" color="dark" title="Ingresar" label="Ingresar"
            to="/login" />
        </div>

        <div v-else class="">
          <q-btn outline class="q-mb-sm text-grey-8 full-width" icon="map" color="grey-1" title="Mapa" label="Ir al Mapa"
            to="/collect/map" />
        </div>

      </div>

      <div class="secretaria text-center">
        <!-- <img class="" alt="Logo Ministerio" src="images/ministerio.png" width="175px"> -->
      </div>

      <div class="q-pt-sm q-pr-lg text-right bg-white absolute-bottom">
        <img class="" alt="Idecor" src="images/zocalo.png" width="120px">
      </div>
    </div>

  </q-page>
</template>

<script setup lang="ts">
  import { useAuthStore } from '../stores/auth-store';
  const authStore = useAuthStore();

</script>

<style lang="scss" scoped>
.header-image {
  width: 100%;
  opacity: 1;
}

.bg-index {
  background-color: #EEEEEE;
}

.icono {
  margin-top: 60px;
}

.secretaria {
  margin-top: 25px,
}

.bienvenida {
  font-size: 1.2em;
  margin-top: 12px;
  margin-bottom: 12px;
}

.subtitulo {
  font-size: 16px;
}

.landcollect {
  font-size: 16px;
}
</style>
