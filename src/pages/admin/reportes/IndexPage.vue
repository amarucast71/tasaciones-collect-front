<template>
  <q-page padding>
    <div class="">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="avance">
          <avance-campania />
        </q-tab-panel>

        <q-tab-panel name="otro">
          <div class="text-center bg-grey-3">
            A desarrollar...
          </div>
        </q-tab-panel>
      </q-tab-panels>

    <!-- <q-separator /> -->

    <q-footer>
      <q-tabs
        v-model="tab"
        dense
        inline-label
        switch-indicator
        indicator-color="blue-4"
        class="bg-blue-9 text-white shadow-2"
        align="justify"
      >
        <q-tab name="avance" icon="donut_small" label="Avance" />
        <q-tab disable name="otra" icon="stacked_bar_chart" label="Otros..." />
      </q-tabs>
    </q-footer>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
import AvanceCampania from 'src/components/reportes/AvanceCampania.vue'

const tab = ref('avance')

</script>
