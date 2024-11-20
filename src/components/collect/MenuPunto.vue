<template>
  <div class="">
    <q-btn flat padding="sm" icon="more_vert">
      <q-menu>
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup @click="openData(props.punto)">
            <q-item-section avatar>
              <q-icon color="blue" name="developer_board" />
            </q-item-section>
            <q-item-section>Ficha</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="showOnMap(props.punto)">
            <q-item-section avatar>
              <q-icon color="blue" name="location_on" />
            </q-item-section>
            <q-item-section>Mapa</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="edit(props.punto)" :disable="props.punto.confirmado">
            <q-item-section avatar>
              <q-icon color="blue" name="edit" />
            </q-item-section>
            <q-item-section>Editar</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="confirmPoint(props.punto)" :disable="props.punto.confirmado">
            <q-item-section avatar>
              <q-icon color="green" name="done" />
            </q-item-section>
            <q-item-section>Confirmar</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="deletePoint(props.punto)" :disable="props.punto.confirmado">
            <q-item-section avatar>
              <q-icon color="red" name="delete" />
            </q-item-section>
            <q-item-section>Eliminar</q-item-section>
          </q-item>

        </q-list>
      </q-menu>
    </q-btn>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import { usePointsStore } from 'src/stores/points-store';
import { PointData } from 'src/components/points';


interface Props {
  punto: PointData;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: 'confirmPoint', point: PointData): void;
  (event: 'deletePoint', id: number): void;
}>();

const $router = useRouter();
const $q = useQuasar();
const pointsStore = usePointsStore();

const edit = (row: PointData) => {
  pointsStore.setPointData(row);
  $router.push(`/collect/formpunto?id=${row.id}&r=list`);
};

const showOnMap = (row: PointData) => {
  pointsStore.setPointData(row);
  $router.push('/collect/map');
};


const openData = (row: PointData) => {
  pointsStore.setPointData(row);
  $router.push('/collect/punto');
};

const confirmPoint = async (row: PointData) => {
  $q.dialog({
    title: 'Confirmar Punto',
    message: `¿Está seguro que quiere confirmar el Punto N° ${row.id}`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const p = await pointsStore.confirmPoint(row);
    if (p) {
      emit('confirmPoint', p)
    }
  })
};

const deletePoint = async (row: PointData) => {
  $q.dialog({
    title: 'Eliminar Punto',
    message: `¿Está seguro que quiere eliminar el Punto N° ${row.id}`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await pointsStore.deletePoint(row);
    emit('deletePoint', row.id)
  })
};

</script>
