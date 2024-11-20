<template>
  <div class="fullscreen bg-grey text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        403
      </div>

      <div class="text-h2" style="opacity:.4">
        Permisos Insuficientes
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="dark"
        unelevated
        to="/"
        label="Inicio"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ErrorNotFound'
});
</script>
