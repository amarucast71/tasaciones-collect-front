<template>
  <q-page padding>
    <!-- content -->

    <q-select
      clearable
      v-model="campania"
      :options="optCampanias"
      label="Campaña"
      emit-value
      map-options
    />
    <div class="q-mt-lg">
      <q-btn
        :disable="!campania"
        color="cyan-7"
        icon="cloud_download"
        label="Descargar Geojson"
        @click="downloadGeoJson()"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import { Campania } from 'src/components/admin'

const rows = ref<Campania[]>([]);
const campania = ref(null)

const getData = async () => {
  const url = `${process.env.API}/api/v1/campanias?sort_by=-id&page_size=500`;
  const resp = await api.get(url)
  rows.value = resp.data.data
}

const downloadGeoJson = async () => {
      const resp = await api.get(`${process.env.API}/api/v1/relevamientos/${campania.value}/geojson`)
      const data = resp.data.data
      const blob = new Blob([JSON.stringify(data)], {
        type: 'application/octet-stream'
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'Datos.geojson'
      link.click()
    }


const optCampanias = computed(() => {
  return rows.value.map(opt => ({ label: opt.nombre, value: opt.id }))

})

onMounted(async () => {
  setTimeout(async () => {
    await getData()
  }, 200)
})

</script>
