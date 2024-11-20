<template>
  <q-page padding>

    <q-table flat bordered title="Asuntos" :columns="columns" :rows="rows" :filter="filter" row-key="id"
      :rows-per-page-options="[0]">
      <template v-slot:top>
        <q-btn outline label="Agregar" color="blue-7" icon="add_box" to="/admin/asuntos/form" />
        <q-space />
        <q-input borderless clearable dense debounce="300" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat padding="sm" icon="edit" :to="`/admin/asuntos/form?id=${props.row.id}`" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { QTableColumn } from 'quasar';
import { api } from 'src/boot/axios'
import { Asunto } from 'src/components/admin'

const rows = ref<Asunto[]>([]);
const filter = ref<string>('')

const columns: QTableColumn<Asunto>[] = [
  { name: 'actions', label: '', field: 'actions', align: 'left' },
  { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
  { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre', sortable: true },
  { name: 'padre_nombre', label: 'Iniciador', align: 'left', field: 'padre_nombre', sortable: true },
  { name: 'observaciones', label: 'Observaciones', align: 'left', field: 'observaciones' },
]

const getData = async () => {
  const url = `${process.env.API}/api/v1/asuntos?page_size=1000`;
  const resp = await api.get(url)
  rows.value = resp.data.data
}

onMounted(async () => {
  setTimeout(async () => {
    await getData()
  }, 200)
})
</script>
