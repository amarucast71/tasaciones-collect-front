<template>
  <q-page padding>

    <q-table flat bordered title="Campañas" :columns="columns" :rows="rows" row-key="id"
      :rows-per-page-options="[0]">
      <template v-slot:top>
        <q-btn outline label="Agregar" color="blue-7" icon="add_box" to="/admin/campanias/form" />
        <q-space />
        <!-- <q-input borderless clearable dense debounce="300" v-model="filter" placeholder="Buscar"> -->
        <!--   <template v-slot:append> -->
        <!--     <q-icon name="search" /> -->
        <!--   </template> -->
        <!-- </q-input> -->
      </template>
      <template v-slot:body-cell="props">
          <q-td :props="props">
            <div :class="props.row.vigente ? 'text-weight-bold text-blue' : 'text-weight-regular text-strike'">
              {{props.value}}
            </div>
          </q-td>
        </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat padding="sm" icon="edit" :to="`/admin/campanias/form?id=${props.row.id}`" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>


<script setup lang="ts">


import { ref, onMounted } from 'vue'
import { QTableColumn } from 'quasar';
import { api } from 'src/boot/axios'
import { Campania } from 'src/components/admin'

const rows = ref<Campania[]>([]);

const columns: QTableColumn<Campania>[] = [
  { name: 'actions', label: '', field: 'actions', align: 'left' },
  { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
  { name: 'inicio', label: 'Inicio', align: 'left', field: 'finicio', sortable: true },
  { name: 'fin', label: 'Fin', align: 'left', field: 'ffin', sortable: true },
  { name: 'relevamientos', label: 'Relevamientos', align: 'right', field: 'relevamientos', sortable: true },
  { name: 'vigente', label: 'Vigente', align: 'center', field: 'fvigente', sortable: true },
  // { name: 'usuarios', label: 'Usuarios', align: 'right', field: 'usuarios', sortable: true },
  { name: 'datos', label: 'datos', align: 'left', field: 'datos', sortable: false },
]

const getData = async () => {
  const url = `${process.env.API}/api/v1/campanias?sort_by=-id&page_size=500`;
  const resp = await api.get(url)
  rows.value = resp.data.data
}

onMounted(async () => {
  setTimeout(async () => {
    await getData()
  }, 200)
})



</script>
