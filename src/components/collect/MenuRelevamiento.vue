<template>
  <div class="text-right">
    <q-btn flat padding="sm" icon="more_vert">
      <q-menu>
        <q-list dense style="min-width: 100px">
          <q-item clickable v-close-popup :to="`/collect/formrelevamiento?id=${relevamiento.id}`" :disable="props.relevamiento.confirmado">
            <q-item-section avatar>
              <q-icon color="blue" name="edit" />
            </q-item-section>
            <q-item-section>Editar</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="descargar(props.relevamiento)">
            <q-item-section avatar>
              <q-icon color="blue" name="download" />
            </q-item-section>
            <q-item-section>Descargar</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="confirmRelevamiento(props.relevamiento)" :disable="props.relevamiento.confirmado">
            <q-item-section avatar>
              <q-icon color="green" name="done" />
            </q-item-section>
            <q-item-section>Confirmar</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="deleteRelevamiento(props.relevamiento)" :disable="props.relevamiento.confirmado">
            <q-item-section avatar>
              <q-icon color="red" name="delete" />
            </q-item-section>
            <q-item-section>Eliminar</q-item-section>
          </q-item>

          <q-item clickable v-close-popup :to="`/collect/fotorelevamiento?id=${relevamiento.id}`">
            <q-item-section avatar>
              <q-icon color="blue" name="photo_camera" />
            </q-item-section>
            <q-item-section>Tomar Foto</q-item-section>
          </q-item>


        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { useQuasar, openURL } from 'quasar';
import { usePointsStore } from 'src/stores/points-store';
import { Relevamiento } from 'src/components/points';

interface Props {
  relevamiento: Relevamiento;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  // (event: 'getPoints'): void;
  (event: 'confirmRelevamiento', relevamiento: Relevamiento): void;
  (event: 'deleteRelevamiento', id: number): void;
}>();

const $q = useQuasar();
const pointsStore = usePointsStore();

const descargar = (row: Relevamiento) => {
  const url = `${process.env.API}/planillaregistro/${row.id}`
  openURL(url)
}

const confirmRelevamiento = async (row: Relevamiento) => {
  $q.dialog({
    title: 'Confirmar Relevamiento',
    message: `¿Está seguro que quiere confirmar el Relevamiento N° ${row.id}`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const r = await pointsStore.confirmRelevamiento(row);
    if (r) {
      emit('confirmRelevamiento', r)
    }
  })
};

const deleteRelevamiento = async (row: Relevamiento) => {
  $q.dialog({
    title: 'Eliminar Relevamiento',
    message: `¿Está seguro que quiere eliminar el Relevamiento N° ${row.id}`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    if (row.id !== undefined) {
      await pointsStore.deleteRelevamiento(row);
      emit('deleteRelevamiento', row.id);
    } else {
      console.error('El ID del relevamiento es undefined');
    }
    // await pointsStore.deleteRelevamiento(row);
    // emit('deleteRelevamiento', row.id)
  })
};


</script>
