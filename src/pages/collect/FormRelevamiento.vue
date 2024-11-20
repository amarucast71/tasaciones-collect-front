<template>
  <q-page padding>

    <!-- <q-btn flat padding="sm" icon="arrow_back" @click="$router.go(-1)" /> -->

    <div class="bg-purple-8 text-white q-my-sm q-pa-sm">
      {{ form }}
    </div>

    <div class="q-pa-sm bg-blue-4 text-h6 text-white">
      Agregar o Editar Relevamiento
    </div>

    <div>
      <q-input
        v-model="form.fecha"
        label="Fecha:"
        @blur="v$.fecha.$touch"
        :error="v$.fecha.$error"
        error-message="Debe ingresar la fecha"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="fechaPopup"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="form.fecha"
                mask="DD/MM/YYYY"
                @update:model-value="() => fechaPopup?.hide()"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <div class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        DATOS DEL REGISTRO
      </div>
      <q-select
        v-model="form.datos.tipo_registro"
        label="Tipo de Registro"
        :options="optTipoRegistro"
        @update:model-value="resetForm"
        @blur="v$.datos.tipo_registro.$touch"
        :error="v$.datos.tipo_registro.$error"
        error-message="Debe completar el tipo de registro"
      />
        <!-- fill-mask -->
      <q-input
        class=""
        v-model="form.datos.fecha_referencia"
        label="Fecha de Referencia"
        mask="##/####"
        hint="MM/AAAA"
         @blur="v$.datos.fecha_referencia.$touch"
        :error="v$.datos.fecha_referencia.$error"
        error-message="Debe completar el tipo de registro"
      />

      <q-select
        v-if="showExpediente"
        v-model="form.datos.caso"
        label="Caso"
        :options="optCaso"
        @blur="v$.datos.caso.$touch"
        :error="v$.datos.caso.$error"
        error-message="Debe completar el caso"
      />

      <q-input
        v-if="showExpediente"
        class=""
        v-model="form.datos.tramite"
        label="N° de Trámite"
         @blur="v$.datos.tramite.$touch"
        :error="v$.datos.tramite.$error"
        error-message="Debe completar el número de tramite"
      />

      <q-select
        v-model="form.datos.tipo_inmueble"
        label="Tipo de Inmueble"
        :options="optTipoInmueble"
        @update:model-value="resetForm"
        @blur="v$.datos.tipo_inmueble.$touch"
        :error="v$.datos.tipo_inmueble.$error"
        error-message="Debe completar el tipo de inmueble"
      />

      <q-select
        v-if="showExpediente"
        v-model="form.datos.asunto_i"
        label="Iniciador"
        :options="optAsunto1"
        @update:model-value="resetAsuntoII"
        @blur="v$.datos.asunto_i.$touch"
        :error="v$.datos.asunto_i.$error"
        error-message="Debe completar el campo"
      />

      <q-select
        v-if="showExpediente"
        v-model="form.datos.asunto_ii"
        label="Asunto"
        :options="optAsunto2"
        @blur="v$.datos.asunto_ii.$touch"
        :error="v$.datos.asunto_ii.$error"
        error-message="Debe completar el campo"
      />

      <q-select
        v-if="showAntecedente"
        v-model="form.datos.operacion"
        label="Operación"
        :options="optOperacion"
        @blur="v$.datos.operacion.$touch"
        :error="v$.datos.operacion.$error"
        error-message="Debe completar el campo"
      />


      <q-input
        v-if="showAntecedente"
        class=""
        v-model="form.datos.oferente"
        label="Oferente"
        @blur="v$.datos.oferente.$touch"
        :error="v$.datos.oferente.$error"
        error-message="Debe completar el oferente"
      />

      <q-input
        v-if="showAntecedente"
        class=""
        v-model="form.datos.telefono"
        label="Teléfono"
         @blur="v$.datos.telefono.$touch"
        :error="v$.datos.telefono.$error"
        error-message="Debe completar el telefono"
      />

      <q-input
        v-if="showAntecedente"
        class=""
        v-model="form.datos.email"
        label="Correo Electrónico"
         @blur="v$.datos.email.$touch"
        :error="v$.datos.email.$error"
        error-message="Debe completar el correo electrónico"
      />

      <q-input
        v-if="showAntecedente"
        class=""
        v-model="form.datos.enlace"
        label="Enlace"
         @blur="v$.datos.enlace.$touch"
        :error="v$.datos.enlace.$error"
        error-message="Debe completar el enlace"
      />

      <div class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        UBICACIÓN DEL INMUEBLE
        <q-btn flat icon="refresh" @click="getDatosCuenta"/>
      </div>
      <q-input
        class="q-mt-lg"
        v-model="form.datos.nomenclatura_catastral"
        label="Nomenclatura catastral"
        @blur="v$.datos.nomenclatura_catastral.$touch"
        :error="v$.datos.nomenclatura_catastral.$error"
        error-message="Debe completar este campo"
      />

      <q-input
        class="q-mt-lg"
        v-model="form.datos.cuenta"
        label="Cuenta"
        @blur="v$.datos.cuenta.$touch"
        :error="v$.datos.cuenta.$error"
        error-message="Debe completar este campo"
      />

      <q-input
        class="q-mt-lg"
        v-model="form.datos.departamento"
        label="Departamento"
        @blur="v$.datos.departamento.$touch"
        :error="v$.datos.departamento.$error"
        error-message="Debe completar este campo"
      />
      <q-input
        class="q-mt-lg"
        v-model="form.datos.pedania"
        label="Pedania"
        @blur="v$.datos.pedania.$touch"
        :error="v$.datos.pedania.$error"
        error-message="Debe completar este campo"
      />

      <q-input
        v-if="!showRural"
        class="q-mt-lg"
        v-model="form.datos.ciudad"
        label="Ciudad"
        @blur="v$.datos.ciudad.$touch"
        :error="v$.datos.ciudad.$error"
        error-message="Debe completar este campo"
      />
      <q-input
        v-if="!showRural"
        class="q-mt-lg"
        v-model="form.datos.barrio"
        label="Barrio"
        @blur="v$.datos.direccion.$touch"
        :error="v$.datos.direccion.$error"
        error-message="Debe completar este campo"
      />
      <q-input
        class="q-mt-lg"
        v-model="form.datos.direccion"
        label="Dirección"
        @blur="v$.datos.direccion.$touch"
        :error="v$.datos.direccion.$error"
        error-message="Debe completar este campo"
      />

      <div class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        DESCRIPCIÓN DEL INMUEBLE
      </div>

      <q-input
        class="q-mt-lg"
        v-model="form.datos.superficie_terreno"
        label="Superficie del Terreno"
        :hint="hintSuperficieTerreno"
        @blur="v$.datos.superficie_terreno.$touch"
        :error="v$.datos.superficie_terreno.$error"
        error-message="Debe completar la superficie del terreno"
      />

      <q-input
        v-if="showUrbanoBaldio || showUrbanoEdificado"
        class="q-mt-lg"
        v-model="form.datos.frente"
        label="Frente"
        @blur="v$.datos.frente.$touch"
        :error="v$.datos.frente.$error"
        error-message="Debe completar el dato de frente"
      />

      <q-input
        v-if="showUrbanoBaldio || showUrbanoEdificado"
        class="q-mt-lg"
        v-model="form.datos.fondo"
        label="Fondo"
        @blur="v$.datos.fondo.$touch"
        :error="v$.datos.fondo.$error"
        error-message="Debe completar el dato de fondo"
      />


      <q-select
        v-model="form.datos.forma"
        label="Forma"
        :options="optForma"
        @update:model-value="resetForm"
        @blur="v$.datos.forma.$touch"
        :error="v$.datos.forma.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.limitantes_uso"
        label="Limitantes al uso"
        type="textarea"
        @blur="v$.datos.limitantes_uso.$touch"
        :error="v$.datos.limitantes_uso.$error"
        error-message="Debe completar el dato de limitantes al uso"
      />

      <div v-if="showRural" class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        CARTA DE SUELO
        <q-btn flat icon="refresh" @click="getDatosCarta"/>
      </div>

      <q-btn
        v-if="showRural && form.datos.pdfsimbolo"
        flat
        label="Abrir PDF Carta"
        color="blue-8"
        @click="abrirPDFCarta"
      />

      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.simbolo"
        label="Símbolo"
        @blur="v$.datos.simbolo.$touch"
        :error="v$.datos.simbolo.$error"
        error-message="Debe completar el simbolo"
      />
      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.unidades_cartograficas"
        label="Unidades cartográficas"
        @blur="v$.datos.unidades_cartograficas.$touch"
        :error="v$.datos.unidades_cartograficas.$error"
        error-message="Debe completar el dato de unidades cartográficas"
      />
      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.capacidad_uso"
        label="Capacidad de uso"
        @blur="v$.datos.capacidad_uso.$touch"
        :error="v$.datos.capacidad_uso.$error"
        error-message="Debe completar el dato de capacidad de uso"
      />
      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.clase"
        label="Clase"
        @blur="v$.datos.clase.$touch"
        :error="v$.datos.clase.$error"
        error-message="Debe completar el dato clase"
      />
      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.subclase"
        label="Subclase"
        @blur="v$.datos.subclase.$touch"
        :error="v$.datos.subclase.$error"
        error-message="Debe completar el dato subclase"
      />
      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.indice_productividad"
        label="Índice de productividad"
        @blur="v$.datos.indice_productividad.$touch"
        :error="v$.datos.indice_productividad.$error"
        error-message="Debe completar el dato de índice de productividad"
      />
      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.limitante1"
        label="Limitante 1"
        @blur="v$.datos.limitante1.$touch"
        :error="v$.datos.limitante1.$error"
        error-message="Debe completar el dato limitante 1"
      />
      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.limitante2"
        label="Limitante 2"
        @blur="v$.datos.limitante2.$touch"
        :error="v$.datos.limitante2.$error"
        error-message="Debe completar el dato limitante 2"
      />
      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.limitante3"
        label="Limitante 3"
        @blur="v$.datos.limitante3.$touch"
        :error="v$.datos.limitante3.$error"
        error-message="Debe completar el dato limitante 3"
      />

      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.agua_util_1m"
        label="Agua útil a 1m"
        @blur="v$.datos.agua_util_1m.$touch"
        :error="v$.datos.agua_util_1m.$error"
        error-message="Debe completar el dato agua útil a 1m"
      />

      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.agua_util_2m"
        label="Agua útil a 2m"
        @blur="v$.datos.agua_util_2m.$touch"
        :error="v$.datos.agua_util_2m.$error"
        error-message="Debe completar el dato agua útil a 2m"
      />

      <div v-if="showUrbanoEdificado || showUrbanoBaldio" class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        USO DE SUELO / PLANEAMIENTO
        <q-btn flat icon="refresh" @click="getDatosNormativa"/>
      </div>

      <q-input
        v-if="showUrbanoEdificado || showUrbanoBaldio"
        class="q-mt-lg"
        v-model="form.datos.ordenanza"
        label="Ordenanza de referencia"
        @blur="v$.datos.ordenanza.$touch"
        :error="v$.datos.ordenanza.$error"
        error-message="Debe completar el dato de ordenanza"
      />

      <q-input
        v-if="showUrbanoEdificado || showUrbanoBaldio"
        class="q-mt-lg"
        v-model="form.datos.zona"
        label="Zona"
        @blur="v$.datos.zona.$touch"
        :error="v$.datos.zona.$error"
        error-message="Debe completar el dato de zona"
      />

      <q-input
        v-if="showUrbanoEdificado || showUrbanoBaldio"
        class="q-mt-lg"
        v-model="form.datos.fot"
        label="FOT"
        @blur="v$.datos.fot.$touch"
        :error="v$.datos.fot.$error"
        error-message="Debe completar el dato de FOT"
      />

      <q-input
        v-if="showUrbanoEdificado || showUrbanoBaldio"
        class="q-mt-lg"
        v-model="form.datos.fos"
        label="FOS"
        @blur="v$.datos.fos.$touch"
        :error="v$.datos.fos.$error"
        error-message="Debe completar el dato de FOT"
      />

      <q-input
        v-if="showUrbanoEdificado || showUrbanoBaldio"
        class="q-mt-lg"
        v-model="form.datos.superficie_edificable"
        label="Superficie edificable"
        hint="dada en m2"
        @blur="v$.datos.superficie_edificable.$touch"
        :error="v$.datos.superficie_edificable.$error"
        error-message="Debe completar el dato de superficie edificable"
      />

      <!-- <q-select -->
      <!--   v-model="form.datos.situacion_dominial" -->
      <!--   label="Situación dominial" -->
      <!--   :options="optSituacionDominial" -->
      <!--   @blur="v$.datos.situacion_dominial.$touch" -->
      <!--   :error="v$.datos.situacion_dominial.$error" -->
      <!--   error-message="Debe completar el dato de situacion dominial" -->
      <!-- /> -->
      <!--  -->
      <!-- <q-select -->
      <!--   v-model="form.datos.ocupacion" -->
      <!--   label="Ocupación" -->
      <!--   :options="optOcupacion" -->
      <!--   @blur="v$.datos.ocupacion.$touch" -->
      <!--   :error="v$.datos.ocupacion.$error" -->
      <!--   error-message="Debe completar el dato de upación" -->
      <!-- /> -->
      <!--  -->
      <!-- <q-select -->
      <!--   v-model="form.datos.ubicacion" -->
      <!--   :label="labelUbicacion" -->
      <!--   :options="optUbicacion" -->
      <!--   @blur="v$.datos.ubicacion.$touch" -->
      <!--   :error="v$.datos.ubicacion.$error" -->
      <!--   error-message="Debe completar el dato de ubicación cuadra" -->
      <!-- /> -->

      <div v-if="showUrbanoEdificado || showRural"
        class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        MEJORAS
      </div>
      <q-input
        v-if="showUrbanoEdificado"
        class="q-mt-lg"
        v-model="form.datos.mejoras_superficie"
        label="Superficie"
        hint="dada en m2"
        @blur="v$.datos.mejoras_superficie.$touch"
        :error="v$.datos.mejoras_superficie.$error"
        error-message="Debe completar el dato de superficie edificable"
      />

      <q-input
        v-if="showUrbanoEdificado || showRural"
        class="q-mt-lg"
        v-model="form.datos.mejoras_antiguedad"
        label="Antigüedad"
        hint="dada en años"
        @blur="v$.datos.mejoras_antiguedad.$touch"
        :error="v$.datos.mejoras_antiguedad.$error"
        error-message="Debe completar el dato de mejoras antigüedad"
      />

      <q-select
        v-if="showUrbanoEdificado || showRural"
        v-model="form.datos.mejoras_tipologia"
        label="Tipología"
        :options="optTipologia"
        @blur="v$.datos.mejoras_tipologia.$touch"
        :error="v$.datos.mejoras_tipologia.$error"
        error-message="Debe completar el dato de tipología"
      />

      <q-input
        v-if="showUrbanoEdificado || showRural"
        class="q-mt-lg"
        v-model="form.datos.mejoras_caracteristicas_principales"
        label="Características principales"
        type="textarea"
        @blur="v$.datos.mejoras_caracteristicas_principales.$touch"
        :error="v$.datos.mejoras_caracteristicas_principales.$error"
        error-message="Debe completar el dato de características principales"
      />

      <q-select
        v-if="showUrbanoEdificado"
        v-model="form.datos.mejoras_estado_construccion"
        label="Estado construcción"
        :options="optEstadoConstruccion"
        @blur="v$.datos.mejoras_estado_construccion.$touch"
        :error="v$.datos.mejoras_estado_construccion.$error"
        error-message="Debe completar el dato de estado construcción"
      />

      <div class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        CARACTERÍSTICAS GENERALES
      </div>
      <q-select
        v-model="form.datos.situacion_dominial"
        label="Situación dominial"
        :options="optSituacionDominial"
        @blur="v$.datos.situacion_dominial.$touch"
        :error="v$.datos.situacion_dominial.$error"
        error-message="Debe completar el dato de situacion dominial"
      />

      <q-select
        v-model="form.datos.ocupacion"
        label="Ocupación"
        :options="optOcupacion"
        @blur="v$.datos.ocupacion.$touch"
        :error="v$.datos.ocupacion.$error"
        error-message="Debe completar el dato de upación"
      />

      <q-select
        v-model="form.datos.ubicacion"
        :label="labelUbicacion"
        :options="optUbicacion"
        @blur="v$.datos.ubicacion.$touch"
        :error="v$.datos.ubicacion.$error"
        error-message="Debe completar el dato de ubicación cuadra"
      />
      <q-input
        class="q-mt-lg"
        v-model="form.datos.descripcion_general"
        label="Descripción general"
        type="textarea"
         @blur="v$.datos.descripcion_general.$touch"
        :error="v$.datos.descripcion_general.$error"
        error-message="Debe completar la descripción general"
      />

      <q-input
        v-if="showExpediente"
        class="q-mt-lg"
        v-model="form.datos.propietario_titulo"
        label="Propietario según título"
        @blur="v$.datos.propietario_titulo.$touch"
        :error="v$.datos.propietario_titulo.$error"
        error-message="Debe completar el propietario título"
      />

      <div class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        VALOR TERRENO
      </div>

      <q-input
        v-if="showExpediente"
        class="q-mt-lg"
        v-model="form.datos.superficie_a_tasar"
        label="Superficie a tasar"
         @blur="v$.datos.superficie_a_tasar.$touch"
        :error="v$.datos.superficie_a_tasar.$error"
        error-message="Debe completar la superfie a tasar"
      />

      <q-input
        v-if="showExpediente"
        class="q-mt-lg"
        v-model="form.datos.valor_determinado"
        label="Valor determinado"
        hint="dado en $"
         @blur="v$.datos.valor_determinado.$touch"
        :error="v$.datos.valor_determinado.$error"
        error-message="Debe completar el valor determinado"
      />

      <q-input
        v-if="showAntecedente"
        class="q-mt-lg"
        v-model="form.datos.valor_terreno"
        label="Valor del terreno"
         @blur="v$.datos.valor_terreno.$touch"
        :error="v$.datos.valor_terreno.$error"
        error-message="Debe completar el valor del terreno"
      />

      <q-input
        v-if="showAntecedente"
        class="q-mt-lg"
        v-model="form.datos.descuento"
        label="Descuento"
         @blur="v$.datos.descuento.$touch"
        :error="v$.datos.descuento.$error"
        error-message="Debe completar el descuento"
      />

      <q-input
        v-if="showAntecedente"
        class="q-mt-lg"
        v-model="form.datos.valor_neto"
        label="Valor neto"
         @blur="v$.datos.valor_neto.$touch"
        :error="v$.datos.valor_neto.$error"
        error-message="Debe completar el valor neto"
      />

      <q-input
        class="q-mt-lg"
        v-model="form.datos.valor_unitario_neto"
        label="Valor unitario neto"
         @blur="v$.datos.valor_unitario_neto.$touch"
        :error="v$.datos.valor_unitario_neto.$error"
        error-message="Debe completar el valor unitario neto"
      />

      <div v-if="showUrbanoEdificado || showRural" class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        VALOR DE LA CONSTRUCCIÓN
      </div>
      <q-input
        v-if="showUrbanoEdificado"
        class="q-mt-lg"
        v-model="form.datos.valor_unitario_construccion_nuevo"
        label="Valor unitario de la construcción a nuevo"
         @blur="v$.datos.valor_unitario_construccion_nuevo.$touch"
        :error="v$.datos.valor_unitario_construccion_nuevo.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showUrbanoEdificado"
        class="q-mt-lg"
        v-model="form.datos.valor_unitario_depreciado"
        label="Valor unitario depreciado"
         @blur="v$.datos.valor_unitario_depreciado.$touch"
        :error="v$.datos.valor_unitario_depreciado.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showUrbanoEdificado"
        class="q-mt-lg"
        v-model="form.datos.valor_total_construccion"
        label="Valor total de la construcción"
         @blur="v$.datos.valor_total_construccion.$touch"
        :error="v$.datos.valor_total_construccion.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.valor_mejora_nuevo"
        label="Valor de la mejora a nuevo"
         @blur="v$.datos.valor_mejora_nuevo.$touch"
        :error="v$.datos.valor_mejora_nuevo.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.depreciacion"
        label="Depreciación"
         @blur="v$.datos.depreciacion.$touch"
        :error="v$.datos.depreciacion.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showRural"
        class="q-mt-lg"
        v-model="form.datos.valor_total_mejoras"
        label="Valor total mejoras"
         @blur="v$.datos.valor_total_mejoras.$touch"
        :error="v$.datos.valor_total_mejoras.$error"
        error-message="Debe completar el campo"
      />

      <div class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        VALOR TOTAL
      </div>

      <q-input
        v-if="showAntecedente"
        class="q-mt-lg"
        v-model="form.datos.valor_pretendido"
        label="Valor pretendido"
         @blur="v$.datos.valor_pretendido.$touch"
        :error="v$.datos.valor_pretendido.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showAntecedente"
        class="q-mt-lg"
        v-model="form.datos.valor_en_dolares"
        label="Valor en dólares"
         @blur="v$.datos.valor_en_dolares.$touch"
        :error="v$.datos.valor_en_dolares.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        class="q-mt-lg"
        v-model="form.datos.valor_del_dolar"
        label="Valor del dólar a la fecha"
        hint="dado en $/U$D"
         @blur="v$.datos.valor_del_dolar.$touch"
        :error="v$.datos.valor_del_dolar.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showExpediente"
        class="q-mt-lg"
        v-model="form.datos.informe"
        label="N° Informe"
         @blur="v$.datos.informe.$touch"
        :error="v$.datos.informe.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showExpediente"
        class="q-mt-lg"
        v-model="form.datos.resolucion"
        label="Resolución"
         @blur="v$.datos.resolucion.$touch"
        :error="v$.datos.resolucion.$error"
        error-message="Debe completar el campo"
      />

      <q-input
        v-if="showExpediente"
        class="q-mt-lg"
        v-model="form.datos.valor_total_determinado"
        label="Valor Total Determinado"
         @blur="v$.datos.valor_total_determinado.$touch"
        :error="v$.datos.valor_total_determinado.$error"
        error-message="Debe completar el campo"
      />

      <div class="q-mb-md q-mt-lg q-pa-xs bg-orange-5 text-center text-white text-overline">
        OBSERVACIONES
      </div>

      <q-input
        class="q-mt-lg"
        v-model="form.observaciones"
        label="Observaciones"
      />

      <div class="q-gutter-sm q-my-md text-right">
        <q-btn outline label="Cancelar" color="blue-8" to="/collect/map/" />
        <q-btn
          label="Registrar"
          color="blue-8"
          @click="submitForm"
        />
          <!-- :disable="v$.$invalid" -->
      </div>
    </div>
    <div class="q-my-md qpa-sm bg-blue-4">{{v$}}</div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// import { useQuasar, QPopupProxy } from 'quasar';
import { api } from 'src/boot/axios'
import { useQuasar, QPopupProxy, openURL } from 'quasar';
import { useRouter, useRoute, LocationQueryValue } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf, minValue, url, email, helpers } from '@vuelidate/validators';
// import { required, requiredIf, integer, minValue, , minLength, maxLength } from '@vuelidate/validators';
import { usePointsStore } from '../../stores/points-store';
import { Relevamiento } from 'src/components/points';
import { Asunto } from 'src/components/admin';
import { getAsuntosPadres, getAsuntosHijos } from 'src/components/tools';

const router = useRouter();
const $route = useRoute();
const $q = useQuasar();
const pointsStore = usePointsStore();

const id: string | LocationQueryValue[] | null = $route.query.id;
const back = $route.query.b;

const fechaPopup = ref<QPopupProxy | null>(null);
const asuntosPadres = ref<Asunto[]>([]);
const asuntosHijos = ref<Asunto[]>([]);

const form = ref<Relevamiento>({
  id: undefined,
  fecha: null,
  datos: {
    tipo_registro: '',
    fecha_referencia: '',
    caso: '',
    tramite: '',

    tipo_inmueble: '',

    asunto_i: '',
    asunto_ii: '',

    operacion: '',
    oferente: '',
    telefono: '',
    email: '',
    enlace: '',

    nomenclatura_catastral: '',
    cuenta: '',
    departamento: '',
    pedania: '',
    ciudad: '',
    barrio: '',
    direccion: '',

    // superficie_terreno: 0,
    // frente: 0,
    // fondo: 0,
    forma: '',
    limitantes_uso: '',
    ordenanza: '',
    zona: '',
    // fot: '',
    // fos: '',
    // superficie_edificable: '',

    situacion_dominial: '',
    ocupacion: '',
    ubicacion: '',

    descripcion_general: '',
    propietario_titulo: '',

    // mejoras_superficie?: number;
    // mejoras_antiguedad?: number;
    mejoras_tipologia: '',
    mejoras_caracteristicas_principales: '',
    mejoras_estado_construccion: '',

    informe: '',
    resolucion: '',

  },
  observaciones: null,
  punto: null,
});

const resetForm = () => {
  if (form.value.datos.tipo_inmueble === 'RURAL') {
    getDatosCarta()
  }
  if (form.value.datos.tipo_inmueble === 'URBANO BALDIO' || form.value.datos.tipo_inmueble === 'URBANO EDIFICADO') {
    getDatosNormativa()
  }
};
// const changeTipoInmueble = () => {
//   if (form.value.datos.tipo_inmueble === 'RURAL') {
//     getDatosCarta()
//   }
// };

const resetAsuntoII = () => {
  form.value.datos.asunto_ii = ''
};

const abrirPDFCarta = () => {
  const url = `https://obs-idecor-mapas-docs.obs.myhuaweicloud.com/cartas_suelos/PDF_Unidades_500mil/${form.value.datos.pdfsimbolo}.pdf`
  openURL(url)
}

const validarFechaReferencia = helpers.withMessage('Fecha de referencia no válida', value => {
  // if (!value) return false;
  if (typeof value !== 'string') return false;

  const regex = /^(\d{2})\/(\d{4})$/;
  const match = value.match(regex);

  if (!match) return false;

  const mes = parseInt(match[1], 10);
  const anio = parseInt(match[2], 10);

  if (mes < 1 || mes > 12) return false;

  const anioActual = new Date().getFullYear();
  if (anio < 1900 || anio > anioActual) return false;

  return true;
});

const showExpediente = computed<boolean>(() => {
  return form.value.datos.tipo_registro === 'EXPEDIENTE';
});

const showAntecedente = computed<boolean>(() => {
  return form.value.datos.tipo_registro === 'ANTECEDENTE';
});

const showUrbanoBaldio = computed<boolean>(() => {
  return form.value.datos.tipo_inmueble === 'URBANO BALDIO';
});

const showUrbanoEdificado = computed<boolean>(() => {
  return form.value.datos.tipo_inmueble === 'URBANO EDIFICADO';
});

const showRural = computed<boolean>(() => {
  return form.value.datos.tipo_inmueble === 'RURAL';
});

const labelUbicacion = computed<string>(() => {
  if (showRural.value) {
    return 'Ubicación acceso'
  }
  return 'Ubicación en la cuadra';
});

const hintSuperficieTerreno = computed<string>(() => {
  if (showRural.value) {
    return 'dada en ha'
  }
  return 'dada en m2';
});

const rules = computed(() => ({
  fecha: { required },
  datos: {
    tipo_registro: { required },
    fecha_referencia: { validarFechaReferencia },
    caso: { requiredIf: requiredIf(showExpediente) },
    tramite: { requiredIf: requiredIf(showExpediente) },

    tipo_inmueble: { required },

    asunto_i: { requiredIf: requiredIf(showExpediente) },
    asunto_ii: { requiredIf: requiredIf(showExpediente) },

    // enlace: { url, requiredIf: requiredIf(showAntecedente) },
    operacion: { requiredIf: requiredIf(showAntecedente) },
    oferente: { requiredIf: requiredIf(showAntecedente) },
    telefono: { requiredIf: requiredIf(showAntecedente) },
    email: { email },
    enlace: { url },

    nomenclatura_catastral: { required },
    cuenta: { required },
    departamento: { required },
    pedania: { required },
    ciudad: { required },
    barrio: { required },
    direccion: { required },

    descripcion_general: { required },
    propietario_titulo: { requiredIf: requiredIf(showExpediente) },


    superficie_terreno: { required, minValue: minValue(0) },
    frente: { required, minValue: minValue(0) },
    fondo: { required, minValue: minValue(0) },
    forma: { required },

    limitantes_uso: { requiredIf: requiredIf(showRural) },
    ordenanza: { requiredIf: requiredIf(showUrbanoBaldio.value || showUrbanoEdificado.value) },
    zona: { requiredIf: requiredIf(showUrbanoBaldio.value || showUrbanoEdificado.value) },
    fos: { requiredIf: requiredIf(showUrbanoBaldio.value || showUrbanoEdificado.value) },
    fot: { requiredIf: requiredIf(showUrbanoBaldio.value || showUrbanoEdificado.value) },
    superficie_edificable: { requiredIf: requiredIf(showUrbanoBaldio.value || showUrbanoEdificado.value) },

    situacion_dominial: { required },
    ocupacion: { required },
    ubicacion: { required },

    unidades_cartograficas: { requiredIf: requiredIf(showRural) },
    simbolo: { requiredIf: requiredIf(showRural) },
    capacidad_uso: { requiredIf: requiredIf(showRural) },
    clase: { requiredIf: requiredIf(showRural) },
    subclase: { requiredIf: requiredIf(showRural) },
    indice_productividad: { requiredIf: requiredIf(showRural) },
    limitante1: { requiredIf: requiredIf(showRural) },
    limitante2: { requiredIf: requiredIf(showRural) },
    limitante3: { requiredIf: requiredIf(showRural) },
    agua_util_1m: { requiredIf: requiredIf(showRural) },
    agua_util_2m: { requiredIf: requiredIf(showRural) },

    mejoras_superficie: { requiredIf: requiredIf(showUrbanoEdificado) },
    mejoras_antiguedad: { requiredIf: requiredIf(showUrbanoEdificado.value || showRural.value) },
    mejoras_tipologia: { requiredIf: requiredIf(showUrbanoEdificado.value || showRural.value) },
    mejoras_caracteristicas_principales: { requiredIf: requiredIf(showUrbanoEdificado.value || showRural.value) },
    mejoras_estado_construccion: { requiredIf: requiredIf(showUrbanoEdificado) },

    superficie_a_tasar: { requiredIf: requiredIf(showExpediente) },
    valor_determinado: { requiredIf: requiredIf(showExpediente) },
    valor_terreno: { requiredIf: requiredIf(showAntecedente) },
    descuento: { requiredIf: requiredIf(showAntecedente) },
    valor_neto: { requiredIf: requiredIf(showAntecedente) },
    valor_unitario_neto: { required },

    valor_unitario_construccion_nuevo: { requiredIf: requiredIf(showUrbanoEdificado) },
    valor_unitario_depreciado: { requiredIf: requiredIf(showUrbanoEdificado) },
    valor_total_construccion: { requiredIf: requiredIf(showUrbanoEdificado) },

    valor_mejora_nuevo: { requiredIf: requiredIf(showRural) },
    depreciacion: { requiredIf: requiredIf(showRural) },
    valor_total_mejoras: { requiredIf: requiredIf(showRural) },

    valor_pretendido: { requiredIf: requiredIf(showAntecedente) },
    valor_en_dolares: { requiredIf: requiredIf(showAntecedente) },
    valor_del_dolar: { requiredIf: requiredIf(showAntecedente) },
    valor_total_determinado: { requiredIf: requiredIf(showExpediente) },
    informe: { requiredIf: requiredIf(showExpediente) },
    resolucion: { requiredIf: requiredIf(showExpediente) },

  },
}));
const v$ = useVuelidate(rules, form);

const optTipoRegistro = [
  'ANTECEDENTE',
  'EXPEDIENTE',
];

const optCaso = [
  'MONTO INDEMNIZATORIO',
  'ESTIMACIÓN DE VALOR',
  'SERVIDUMBRE',
];

const optTipoInmueble = [
  'URBANO BALDIO',
  'URBANO EDIFICADO',
  'RURAL',
];

const optOperacion = [
  'OFERTA DE VENTA',
  'VENTA CONCRETADA',
];

const optForma = [
  '',
  'REGULAR',
  'IRREGULAR',
  'TRIANGULAR',
  'MARTILLO'
];

const optSituacionDominial = [
  '',
  'CON ESCRITURA',
  'SIN ESCRITURA',
  'BOLETO COMPRAVENTA',
  'HERENCIA VACANTE'
];

const optOcupacion = [
  '',
  'LIBRE',
  'OCUPADO',
  'USURPADO',
  'OCUPADO CON DERECHO',
  'CON JUICIO DE DESALOJO',
  'COMODATO',
  'ALQUILADO',
];

const optEstadoConstruccion = [
  '',
  'EXCELENTE',
  'MUY BUENA',
  'BUENA',
  'NORMAL',
  'REGULAR',
  'MALO',
  'MUY MALO',
  'DEMOLICION',
  'IRRECUPERABLE',
];

const optTipologia = computed<string[]>(() => {
  if (showRural.value) {
    return [
      '',
      'NO POSEE',
      'ORDINARIAS',
      'EXTRAORDINARIAS',
    ];
  }
  return [
    '',
    'VIVIENDA FAMILIAR',
    'VIVIENDA COLECTIVA',
    'EDIFICIO VIVIENDA',
    'EDIFICIOS COMERCIALES',
    'EDIFICIOS INDUSTRIALES',
    'INFRAESTRUCTURAS',
    ];
});

const optUbicacion = computed<string[]>(() => {
  if (showRural.value) {
    return [
      '',
      'SOBRE RUTA',
      'CAMINO SECUNDARIO',
      'CAMINO TERCIARIO',
      'INTERNO',
    ];
  }
  return [
    '',
    'MEDIAL',
    'ESQUINA',
    'SALIDA A DOS CALLES',
    'INTERNO',
  ];
});

const optAsunto1 = computed(() => {
  return asuntosPadres.value.map((item: Asunto) => item.nombre);
});

const optAsunto2 = computed(() => {
  return asuntosHijos.value.filter(item => item.padre_nombre === form.value.datos.asunto_i).map(item => item.nombre);
});

const getAsuntos = async () => {
  const respP = await getAsuntosPadres()
  asuntosPadres.value = respP.data.data
  const respH = await getAsuntosHijos()
  asuntosHijos.value = respH.data.data
};


const today = () => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
};

const getDatosCuenta = async () => {
  const _url = `${process.env.API}/api/v1/gis/cuentas?lat=${pointsStore.point?.latitud}&lng=${pointsStore.point?.longitud}`
  const resp = await api.get(_url)
  const data= resp.data.data.cuentas.getCuentasByLatlng

  if (data.length > 0) {
    form.value.datos.nomenclatura_catastral = data[0].nomenclatura
    form.value.datos.departamento = data[0].departamento
    form.value.datos.pedania = data[0].pedania
    form.value.datos.ciudad = data[0].localidad

    if (data.length === 1) {
      form.value.datos.cuenta = data[0].cuenta
    } else {

    }
  }
}

const getDatosCarta = async () => {
  const _url = `${process.env.API}/api/v1/gis/cartas?lat=${pointsStore.point?.latitud}&lng=${pointsStore.point?.longitud}`
  const resp = await api.get(_url)
  const data = resp.data.data.cartas.getCartaByLatlng

  if (data.length > 0) {
    form.value.datos.unidades_cartograficas = data[0].unidad
    form.value.datos.simbolo = data[0].simbolo
    form.value.datos.pdfsimbolo = data[0].pdfsimbolo
    form.value.datos.capacidad_uso = data[0].capacidadUso
    form.value.datos.clase = data[0].clase
    form.value.datos.subclase = data[0].subclase
    form.value.datos.indice_productividad = data[0].indiceProductividad
    form.value.datos.limitante1 = data[0].limitante1
    form.value.datos.limitante2 = data[0].limitante2
    form.value.datos.limitante3 = data[0].limitante3
    form.value.datos.agua_util_1m = data[0].aguautil.au1M
    form.value.datos.agua_util_2m = data[0].aguautil.au2M
  }
}

const getDatosNormativa = async () => {
  const _url = `${process.env.API}/api/v1/gis/normativaocupacion?lat=${pointsStore.point?.latitud}&lng=${pointsStore.point?.longitud}`
  const resp = await api.get(_url)
  const data = resp.data.data.normativaOcupacion.getNormativaByLatlng

  if (data.length > 0) {
    form.value.datos.ordenanza = data[0].ordenanza
    form.value.datos.zona = data[0].zona
    form.value.datos.fos = data[0].fos
    form.value.datos.fot = data[0].fot
  } else {
    // form.value.datos.ordenanza = ''
    // form.value.datos.zona = ''
    // form.value.datos.fos = ''
    // form.value.datos.fot = ''
  }
}

onMounted(async () => {
  let parsedValue = NaN;

  await getAsuntos()

  if (typeof id === 'string') {
    parsedValue = parseInt(id);
  } else if (Array.isArray(id) && id.length > 0 && typeof id[0] === 'string') {
    parsedValue = parseInt(id[0]);
  }

  if (!isNaN(parsedValue)) {
    const resp = await pointsStore.getRelevamiento(parsedValue);
    Object.assign(form.value, resp);
  } else {
    form.value.fecha = today();
    getDatosCuenta()
  }

});

const submitForm = async () => {
  if (pointsStore.point) {
    form.value.punto = pointsStore.point.id || null;

    v$.value.$touch();

    if (!v$.value.$invalid) {
      try {
        pointsStore.createRelevamiento(form.value);
        if (back === 'map') {
          router.push('/collect/map');
        } else {
          router.go(-1);
        }
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    } else {
      // type ValidationField = { $error: boolean };
      //
      // const invalidFields = Object.keys(v$.value as Record<string, ValidationField>)
      //   .filter((key) => {
      //     const field = (v$.value as Record<string, ValidationField>)[key];
      //     return field?.$error;
      //   });
      //
      // console.log('------------------------------')
      // console.log(invalidFields)
      // console.log('------------------------------')
      //
      // const errorMessage = `Los siguientes campos tienen errores o están incompletos: ${invalidFields.join(', ')}`;
      const errorMessage = 'El formuario tiene errores o faltan campos de completar'

      $q.notify({
        message: errorMessage,
        color: 'negative',
        multiLine: true,
        icon: 'error',
        position: 'top',
      });
    }
  }
};
</script>
