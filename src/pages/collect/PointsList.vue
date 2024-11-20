<template>
  <q-page padding>
    <div class="q-py-md">
      <q-btn flat label="Mapa" icon="map" to="/collect/map" />
    </div>
    <div class="q-pa-sm bg-blue-4 text-h6 text-white">Listado de Puntos Registrados</div>
    <div class="q-mt-lg">
      <q-table flat bordered title="Puntos Registrados" :columns="columns" :rows="puntos" row-key="id"
        :rows-per-page-options="[0]">
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <!-- @getPoints="getPoints" -->
            <menu-punto
              :punto="props.row"
              @confirmPoint="confirmPoint"
              @deletePoint="deletePoint"
              />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QTableColumn } from 'quasar';
import { api } from 'src/boot/axios';
// import { PointData } from 'src/components/points';
import MenuPunto from '/src/components/collect/MenuPunto.vue'

interface Punto {
  id: number;
  fecha_alta: string;
  nombre: string;
  relevamientos_campania: number;
  relevamientos_total: number;
  observaciones: string;
  actions: string;
}

const puntos = ref<Punto[]>([]);
const columns: QTableColumn<Punto>[] = [
  { name: 'actions', label: '', field: 'actions', align: 'left' },
  { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },

  {
    name: 'fecha_alta',
    label: 'Fecha Alta',
    align: 'left',
    field: 'fecha_alta',
    sortable: true,
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'left',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'relevamientos_campania',
    label: 'Rel.Campaña',
    align: 'right',
    field: 'relevamientos_campania',
    sortable: true,
  },
  {
    name: 'relevamientos_total',
    label: 'Rel.Totales',
    align: 'right',
    field: 'relevamientos_total',
    sortable: true,
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    field: 'observaciones',
    align: 'left',
    format: (val) => (val ? `${val.substring(0, 50)}...` : ''),
  },
];

const getPoints = async () => {
  const url = `${process.env.API}/api/v1/puntos?sort_by=-id&page_size=1000`;
  const resp = await api.get(url);
  puntos.value = resp.data.data;
}

const deletePoint = (id: number) => {
  puntos.value = puntos.value.filter(punto => punto.id !== id);
}

const confirmPoint = (p: Punto) => {
  const index = puntos.value.findIndex(punto => punto.id === p.id);
  if (index !== -1) {
    puntos.value[index] = p;
  }
}

onMounted(async () => {
  await getPoints()
});
</script>
