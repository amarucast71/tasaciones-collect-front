<template>
  <q-page padding>
    <q-btn flat padding="sm" icon="arrow_back" @click="$router.go(-1)" />
    <div class="q-my-sm q-pa-sm bg-blue-4 text-h6 text-white rounded-borders">
      Datos de la Ubicación N° {{ pointsStore.point?.id }}
    </div>

    <div v-if="punto" class="row">
      <div class="col-12 col-md-4">
        <!-- <div class="">
          <span class="text-bold">Fecha Alta:</span> {{punto.fecha}}
        </div> -->
        <div class="">
          <span class="text-bold">Nombre:</span> {{ punto?.nombre }}
        </div>
        <div class="">
          <span class="text-bold">Relevamientos Campaña Actual:</span>
          {{ pointsStore.point?.relevamientos_campania }}
        </div>
        <div class="">
          <span class="text-bold">Total de Relevamientos:</span>
          {{ pointsStore.point?.relevamientos_total }}
        </div>
        <div class="">
          <span class="text-bold">Observaciones:</span>
          {{ punto?.observaciones }}
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="">
          <span class="text-bold">Estado:</span> {{ punto?.estado }}
        </div>
        <div class="">
          <span class="text-bold">Fecha Alta:</span> {{ punto?.fecha_alta }}
        </div>
        <div class="">
          <span class="text-bold">Latitud:</span> {{ punto?.latitud }}
        </div>
        <div class="">
          <span class="text-bold">Longitud:</span> {{ punto?.longitud }}
        </div>
        <div class="">
          <span class="text-bold">Usuario:</span> {{ punto?.usuario_nombre }}
        </div>
        <div class="">
          <span class="text-bold">Institución:</span>
          {{ punto?.usuario_institucion }}
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="map-container">
          <point-map-view v-if="showMap" class="fit" :style="jsonDataStyle" :lat="punto?.latitud" :lng="punto?.longitud"
            :zoom="18" />
        </div>
      </div>
    </div>
    <q-separator class="q-my-sm" />

    <q-btn outline label="Agregar Relevamiento" color="primary" icon="library_add"
      :to="`/collect/formrelevamiento?punto=${punto?.id}`" />

    <div v-for="relevamiento in punto?.relevamientos" :key="relevamiento?.id">
      <div class="row q-my-lg q-pa-xs bg-blue-2 rounded-borders">
        <div class="col self-center q-ml-md text-h6">
          Relevamiento N°: {{ relevamiento.id }}
        </div>
        <div class="col self-center">
          <menu-relevamiento :relevamiento="relevamiento" @confirmRelevamiento="confirmRelevamiento"
            @deleteRelevamiento="deleteRelevamiento" />
        </div>
      </div>

      <div class="row q-ma-sm">
        <div class="col-12 col-md-6">
          <div class="q-mb-md">
            <q-btn label="Agregar Foto" color="blue-10" icon="photo_camera"
              :to="`/collect/fotorelevamiento?id=${relevamiento.id}`" />
          </div>
          <div>
            <span class="text-weight-medium">Fecha:</span>
            {{ relevamiento.fecha }}
          </div>
          <div><span class="text-weight-medium">Usuario:</span> {{ relevamiento.usuario_nombre }}</div>
          <div><span class="text-weight-medium">Institución:</span> {{ relevamiento.usuario_institucion }}</div>

          <q-separator class="q-my-sm" />
          <div class="q-my-sm q-pa-xs bg-orange-5 text-center text-white text-overline">
            DATOS DEL REGISTRO
          </div>
          <div>
            <span class="text-weight-medium">Tipo de Registro:</span>
            {{ relevamiento.datos.tipo_registro }}
          </div>

          <div>
            <span class="text-weight-medium">Fecha de Referencia:</span>
            {{ relevamiento.datos.fecha_referencia }}
          </div>



          <div class="q-my-sm q-pa-xs bg-orange-5 text-center text-white text-overline">
            UBICACIÓN DEL INMUEBLE
          </div>


          <div>
            <span class="text-weight-medium">Nomenclatura catastral:</span>
            {{ relevamiento.datos.nomenclatura_catastral }}
          </div>

          <div>
            <span class="text-weight-medium">Cuenta:</span>
            {{ relevamiento.datos.cuenta }}
          </div>

          <div>
            <span class="text-weight-medium">Departamento:</span>
            {{ relevamiento.datos.departamento }}
          </div>

          <div>
            <span class="text-weight-medium">Pedania:</span>
            {{ relevamiento.datos.pedania }}
          </div>

          <div v-if="relevamiento.datos.tipo_inmueble != 'RURAL'">
            <span class="text-weight-medium">Ciudad:</span>
            {{ relevamiento.datos.ciudad }}
          </div>

          <div v-if="relevamiento.datos.tipo_inmueble != 'RURAL'">
            <span class="text-weight-medium">Barrio:</span>
            {{ relevamiento.datos.barrio }}
          </div>

          <div>
            <span class="text-weight-medium">Dirección:</span>
            {{ relevamiento.datos.direccion }}
          </div>


          <div class="q-my-sm q-pa-xs bg-orange-5 text-center text-white text-overline">
            DESCRIPCIÓN DEL INMUEBLE
          </div>


          <div>
            <span class="text-weight-medium">Superficie terreno:</span>
            {{ relevamiento.datos.superficie_terreno }}
          </div>

          <div v-if="relevamiento.datos.tipo_inmueble !== 'RURAL'">
            <span class="text-weight-medium">Frente [m]:</span>
            {{ relevamiento.datos.frente }}
          </div>

          <div v-if="relevamiento.datos.tipo_inmueble !== 'RURAL'">
            <span class="text-weight-medium">Fondo [m]:</span>
            {{ relevamiento.datos.fondo }}
          </div>

          <div>
            <span class="text-weight-medium">Forma:</span>
            {{ relevamiento.datos.forma }}
          </div>

          <div v-if="relevamiento.datos.tipo_inmueble === 'RURAL'">
            <span class="text-weight-medium">Limitantes al uso: "Restricciones por Ley OTBN, y/o según tipo de
              Actividad":</span>
            {{ relevamiento.datos.limitantes_uso }}
          </div>

          <div>
            <span class="text-weight-medium">Situación Dominial:</span>
            {{ relevamiento.datos.situacion_dominial }}
          </div>

          <div>
            <span class="text-weight-medium">Ocupación:</span>
            {{ relevamiento.datos.ocupacion }}
          </div>

          <div>
            <span class="text-weight-medium">Ubicación en la cuadra:</span>
            {{ relevamiento.datos.ubicacion }}
          </div>




          <div class="q-my-sm q-pa-xs bg-orange-5 text-center text-white text-overline">
            USO DE SUELO / PLANEAMIENTO
          </div>


          <div v-if="relevamiento.datos.tipo_inmueble !== 'RURAL'">

            <div>
              <span class="text-weight-medium">Ordenanza ref:</span>
              {{ relevamiento.datos.ordenanza }}
            </div>

            <div>
              <span class="text-weight-medium">Zona:</span>
              {{ relevamiento.datos.zona }}
            </div>

            <div>
              <span class="text-weight-medium">F.O.T.:</span>
              {{ relevamiento.datos.fot }}
            </div>

            <div>
              <span class="text-weight-medium">F.O.S.:</span>
              {{ relevamiento.datos.fos }}
            </div>

            <div>
              <span class="text-weight-medium">Superficie Edificable [m²]:</span>
              {{ relevamiento.datos.superficie_edificable }}
            </div>
          </div>


          <div v-if="relevamiento.datos.tipo_inmueble === 'RURAL'">
            <div>
              <span class="text-weight-medium">Carta de Suelo</span>
            </div>

            <div>
              <span class="text-weight-medium">Unidades cartográficas:</span>
              {{ relevamiento.datos.unidades_cartograficas }}
            </div>

            <div>
              <span class="text-weight-medium">Símbolo:</span>
              {{ relevamiento.datos.simbolo }}
            </div>

            <div>
              <span class="text-weight-medium">Capacidad de Uso:</span>
              {{ relevamiento.datos.capacidad_uso }}
            </div>

            <div>
              <span class="text-weight-medium">Índice de Productividad:</span>
              {{ relevamiento.datos.indice_productividad }}
            </div>

          </div>


          <div v-if="relevamiento.datos.tipo_inmueble !== 'URBANO BALDIO'">

            <div class="q-my-sm q-pa-xs bg-orange-5 text-center text-white text-overline">
              MEJORAS
            </div>
            <div>
              <span class="text-weight-medium" v-if="relevamiento.datos.tipo_inmueble === 'URBANO EDIFICADO'">Superficie
                [m²] :</span>
              {{ relevamiento.datos.mejoras_superficie }}
            </div>
            <div>
              <span class="text-weight-medium">Antigüedad [años]:</span>
              {{ relevamiento.datos.mejoras_antiguedad }}
            </div>

            <div>
              <span class="text-weight-medium">Tipología:</span>
              {{ relevamiento.datos.mejoras_tipologia }}
            </div>

            <div>
              <span class="text-weight-medium">Características principales:</span>
              {{ relevamiento.datos.mejoras_caracteristicas_principales }}
            </div>

            <div v-if="relevamiento.datos.tipo_inmueble === 'URBANO EDIFICADO'">
              <span class="text-weight-medium">Estado de la construcción:</span>
              {{ relevamiento.datos.mejoras_estado_construccion }}
            </div>

          </div>


          <div class="q-my-sm q-pa-xs bg-orange-5 text-center text-white text-overline">
            CARACTERÍSTICAS GENERALES
          </div>

          <div>
            <span class="text-weight-medium">Descripción general:</span>
            {{ relevamiento.datos.descripcion_general }}
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'EXPEDIENTE'">
            <span class="text-weight-medium">Propietario según Titulo:</span>
            {{ relevamiento.datos.propietario_titulo }}
          </div>

          <div>
            <span class="text-weight-medium">VALOR TERRENO</span>
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'EXPEDIENTE'">
            <span class="text-weight-medium">Superficie a Tasar:</span>
            {{ relevamiento.datos.superficie_a_tasar }}
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'EXPEDIENTE'">
            <span class="text-weight-medium">Valor determinado:</span>
            {{ relevamiento.datos.valor_determinado }}
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'ANTECEDENTE'">
            <span class="text-weight-medium">Valor Terreno:</span>
            {{ relevamiento.datos.valor_terreno }}
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'ANTECEDENTE'">
            <span class="text-weight-medium">Descuento [%]:</span>
            {{ relevamiento.datos.descuento }}
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'ANTECEDENTE'">
            <span class="text-weight-medium">Valor Neto [$]:</span>
            {{ relevamiento.datos.valor_neto }}
          </div>

          <div>
            <span class="text-weight-medium">Valor Unitario Neto [$/m²]:</span>
            {{ relevamiento.datos.valor_unitario_neto }}
          </div>



          <div v-if="relevamiento.datos.tipo_inmueble !== 'URBANO BALDIO'">

            <div class="q-my-sm q-pa-xs bg-orange-5 text-center text-white text-overline">
              VALOR CONSTRUCCIÓN
            </div>

            <div v-if="relevamiento.datos.tipo_inmueble === 'URBANO EDIFICADO'">
              <span class="text-weight-medium">Valor unitario de construcción a nuevo[$/m²]:</span>
              {{ relevamiento.datos.valor_unitario_construccion_nuevo }}
            </div>


            <div v-if="relevamiento.datos.tipo_inmueble === 'URBANO EDIFICADO'">
              <span class="text-weight-medium">Valor unit. depreciado[$/m²]:</span>
              {{ relevamiento.datos.valor_unitario_depreciado }}
            </div>

            <div v-if="relevamiento.datos.tipo_inmueble === 'RURAL'">
              <span class="text-weight-medium">Valor de Mejora a nuevo:</span>
              {{ relevamiento.datos.valor_mejora_nuevo }}
            </div>

            <div v-if="relevamiento.datos.tipo_inmueble === 'RURAL'">
              <span class="text-weight-medium">Depreciación [%]:</span>
              {{ relevamiento.datos.depreciacion }}
            </div>

            <div>
              <span class="text-weight-medium">Valor total de las mejoras:</span>
              {{ relevamiento.datos.valor_total_construccion }}
            </div>

          </div>


          <div class="q-my-sm q-pa-xs bg-orange-5 text-center text-white text-overline">
            VALOR TOTAL
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'ANTECEDENTE'">
            <span class="text-weight-medium">Valor pretendido:</span>
            {{ relevamiento.datos.valor_pretendido }}
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'ANTECEDENTE'">
            <span class="text-weight-medium">Valor en dólares:</span>
            {{ relevamiento.datos.valor_en_dolares }}
          </div>

          <div>
            <span class="text-weight-medium">Valor del dólar a fecha [$/u$s]:</span>
            {{ relevamiento.datos.valor_del_dolar }}
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'EXPEDIENTE'">
            <span class="text-weight-medium">Valor Total determinado:</span>
            {{ relevamiento.datos.valor_total_determinado }}
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'EXPEDIENTE'">
            <span class="text-weight-medium">Informe N°:</span>
            {{ relevamiento.datos.informe }}
          </div>

          <div v-if="relevamiento.datos.tipo_registro === 'EXPEDIENTE'">
            <span class="text-weight-medium">Resolución N°:</span>
            {{ relevamiento.datos.resolucion }}
          </div>

          <div class="q-mt-lg">
            <span class="text-weight-medium">Observaciones:</span>
            {{ relevamiento.observaciones }}
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="row q-pa-xl q-col-gutter-sm">
            <div class="col" v-for="foto in relevamiento.fotografias" :key="foto.id">
              <q-card class="my-card">
                <q-img :src="foto.url">
                  <div class="absolute-bottom text-h6">
                    {{ foto.nombre }}
                  </div>
                </q-img>
                <q-card-section class="ellipsis-3-lines" :tooltip="foto.observaciones">
                  {{ foto.observaciones.substr(0, 80) }}
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Eliminar" @click="deleteFotoRelevamiento(relevamiento.id || 0, foto.id)" />
                  <!-- <q-btn flat>Action 2</q-btn> -->
                </q-card-actions>
              </q-card>
              <!-- <img :src="foto.url" alt="Girl in a jacket" width="500" height="600"> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router';
import type { StyleSpecification } from 'maplibre-gl';
import PointMapView from 'src/components/PointMapView.vue';
import jsonData from 'src/assets/data/style.json';

import { PointData, Relevamiento } from 'src/components/points';
import MenuRelevamiento from 'src/components/collect/MenuRelevamiento.vue';
import { usePointsStore } from 'src/stores/points-store';
import { api } from 'src/boot/axios'

const $q = useQuasar()
const $router = useRouter();
const pointsStore = usePointsStore();

const punto = ref<PointData | null>(null);

const showMap = ref(false)

jsonData.sources.puntos_src.tiles[0] = `${process.env.API}/mvt/tiles/{z}/{x}/{y}.pbf`;
const jsonDataStyle: StyleSpecification = jsonData as StyleSpecification;
showMap.value = true


const confirmRelevamiento = (r: Relevamiento) => {
  const relevamientos = punto.value?.relevamientos;
  if (relevamientos) {
    const index = relevamientos.findIndex(
      (relevamiento) => relevamiento.id === r.id,
    );
    if (index !== -1) {
      relevamientos[index] = r;
    }
  }
};

const deleteRelevamiento = (id: number) => {
  if (punto.value?.relevamientos) {
    punto.value.relevamientos = punto.value.relevamientos.filter(
      (relevamiento) => relevamiento.id !== id,
    );
  }
  punto.value = pointsStore.point;
};

const deleteFotoRelevamiento = async (id: number, idFoto: number) => {
  $q.dialog({
    title: 'Eliminar Foto',
    message: '¿Está seguro que quiere eliminar la foto?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const url = `${process.env.API}/api/v1/relevamientos/${id}/deletefoto/${idFoto}`;
    await api.delete(url)
    await pointsStore.refreshPoint()
  })
};

onMounted(async () => {
  setTimeout(() => {
    punto.value = pointsStore.point;
  }, 300);
});
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 350px;
}

.map-container {
  width: 100%;
  height: calc(50vh - 50px);
}

.my-content {
  padding: 10px 15px;
  background: rgba(#999, .15);
  border: 1px solid rgba(#999, .2);
}
</style>
