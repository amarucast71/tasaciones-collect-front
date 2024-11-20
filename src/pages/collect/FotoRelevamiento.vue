<template>
  <q-page padding>
<div class="q-pa-md flex flex-center justify-center items-center" style="height: 100vh; max-width: 700px; margin: auto;">
  <div>
    <div class="camera-frame q-pa-md">
      <video v-show="!imageCaptured" ref="video" class="full-width" autoplay />
      <canvas v-show="imageCaptured" ref="canvas" class="full-width" height="240" />
    </div>
    <div class="text-center q-pa-md">
      <q-toggle v-model="galeria" color="cyan-7" label="Adjuntar desde la galería" @update:model-value="setOrigen" />
    </div>
    <div class="text-center q-pa-md">
      <q-btn v-if="hasCameraSupport" round color="grey-10" icon="camera" size="lg" :disable="imageCaptured"
        @click="captureImage" />
      <q-file v-else outlined label="Seleccione una imagen" accept="image/*" max-file-size="1048576"
        v-model="imageUpload" @update:model-value="captureImageFallback">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
      <q-input
        class=""
        v-model="nombre"
        label="Nombre"
      />
      <q-input
        class=""
        v-model="observaciones"
        label="Observaciones"
      />
      <div class="row justify-center q-mt-lg">
        <q-btn outline color="primary" label="Cancelar" class="q-mr-sm" @click="router.go(-1)" />
        <q-btn color="primary" label="Aceptar" :disabled="!datos.foto" @click="submit" />
      </div>
    </div>
  </div>
</div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute, LocationQueryValue } from 'vue-router';
import { useQuasar } from 'quasar'
import { usePointsStore } from 'src/stores/points-store';
import { api } from 'src/boot/axios'

const router = useRouter();
const $route = useRoute()
const $q = useQuasar()

const pointsStore = usePointsStore();
const id: string | LocationQueryValue[] | null = $route.query.id
const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const galeria = ref<boolean>(false)
const imageCaptured = ref<boolean>(false)
const imageUpload = ref<File[]>([])
const hasCameraSupport = ref<boolean>(true)
const datos = reactive<{ foto: Blob | null }>({ foto: null })
const nombre = ref<string>('');
const observaciones = ref<string>('');

const initCamera = () => {
  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment',
      width: { ideal: 800 },
      height: { ideal: 600 }
    }
  }).then(stream => {
    if (video.value) {
      video.value.srcObject = stream
      hasCameraSupport.value = true
      galeria.value = false
    }
  }).catch(err => {
    console.log(err)
    hasCameraSupport.value = false
    galeria.value = true
  })
}

const disbleCamera = () => {
  if (video.value && video.value.srcObject) {
    const mediaStream = video.value.srcObject as MediaStream;
    mediaStream.getVideoTracks().forEach(track => track.stop());
    video.value.srcObject = null;
    video.value = null;
  }
}

const captureImage = () => {
  if (video.value && canvas.value) {
    const context = canvas.value.getContext('2d')
    canvas.value.width = video.value.getBoundingClientRect().width
    canvas.value.height = video.value.getBoundingClientRect().height
    context?.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
    imageCaptured.value = true
    datos.foto = dataURItoBlob(canvas.value.toDataURL())
    disbleCamera()
  }
}

const captureImageFallback = (file: File) => {
  if (file instanceof File) {
    datos.foto = file;

    if (canvas.value) {
      const context = canvas.value.getContext('2d');
      const render = new FileReader();

      render.onload = event => {
        const img = new Image();
        img.onload = () => {
          if (canvas.value) {
            canvas.value.width = img.width;
            canvas.value.height = img.height;
            context?.drawImage(img, 0, 0);
            imageCaptured.value = true;
          }
        };
        img.src = event.target?.result as string;
      };

      render.readAsDataURL(file);
    }
  } else {
    console.error('El argumento pasado no es un archivo válido.');
  }
};

const dataURItoBlob = (dataURI: string): Blob => {
  const byteString = atob(dataURI.split(',')[1])
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

const submit = async () => {
  // $q.loading.show({
  //   message: 'Guardando Foto...'
  // })

  try {

    const formData = new FormData()
    if (id) {
      const url = `${process.env.API}/api/v1/relevamientos/${id}/addfoto`;
      formData.append('id', id.toString())
      if (datos.foto) {
        formData.append('foto', datos.foto, id + '.png')
      }
      formData.append('nombre', nombre.value)
      formData.append('observaciones', observaciones.value)

      await api.post(url, formData)
      await pointsStore.refreshPoint()
    }

    // $q.loading.hide()
    $q.notify({
      color: 'positive',
      message: 'Foto Guardada',
      position: 'top',
      icon: 'thumb_up'
    })
    router.go(-1)
  } catch (err: unknown) {
    let msg = 'Se produjo un error al intentar guardar la foto.'

    if (err && typeof err === 'object' && 'response' in err) {
      const error = err as { response: { statusText: string; status: number } }
      msg = `Se produjo un error al intentar guardar la foto (${error.response.statusText} - Error: ${error.response.status})`
    }

    // $q.loading.hide()
    $q.notify({
      color: 'negative',
      message: msg,
      position: 'top',
      icon: 'report_problem'
    })
  }
}

const setOrigen = (value: boolean) => {
  hasCameraSupport.value = !value
  if (value) {
    disbleCamera()
  } else {
    initCamera()
  }
}


onMounted(() => {
  galeria.value = !$q.platform.is.mobile
  setOrigen(galeria.value)
  initCamera()
})

onUnmounted(() => {
  // if (hasCameraSupport.value) {
  disbleCamera()
  // }
})







</script>
