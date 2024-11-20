<template>
  <div>Avance de campania</div>

  <q-select clearable v-model="campania" :options="optCampanias" label="Campaña" emit-value map-options
    @update:model-value="onCampaniaChange" />

  <div class="q-mt-xl text-center" v-if="resultado">
    <div class="text-caption text-bold">
      Campaña {{ resultado.nombre }} [{{ resultado.cantidad }}/{{ resultado.relevamientos }}]
    </div>
    <q-circular-progress show-value font-size="12px" :value="resultado.avance" size="15rem" :thickness="0.22"
      color="teal" track-color="grey-3" class="q-ma-md">
      {{ resultado.avance }}%
    </q-circular-progress>
  </div>
  <div class="q-mt-xl text-caption bg-grey-3" v-else>
    No hay relevamientos cargados para la campaña seleccionada
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import { Campania } from 'src/components/admin'

interface Resultado {
  cantidad: number;
  avance: number;
  relevamientos: number;
  nombre: string;
  id: number;
}

const rows = ref<Campania[]>([]);
const resultado = ref<Resultado | undefined>(undefined);
const campania = ref(null)

const getData = async () => {
  const url = `${process.env.API}/api/v1/campanias?sort_by=-id&page_size=500`;
  const resp = await api.get(url)
  rows.value = resp.data.data
}

const onCampaniaChange = async (value: number) => {
  if (value) {
    try {
      const url = `${process.env.API}/api/v1/campanias/${value}/avance`;
      const resp = await api.get(url)
      resultado.value = resp.data.data
    } catch (err) {
      console.log(err)
      // this.$q.notify({
      //   message: 'Se produjo un error al recuperar los datos de la campaña',
      //   color: 'negative',
      //   icon: 'report_problem',
      //   position: 'top'
      // })
    }
  } else {
    resultado.value = undefined
  }
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
