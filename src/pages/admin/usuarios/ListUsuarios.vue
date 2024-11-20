<template>
  <q-page padding>
    <q-dialog v-model="dlgRoles" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 400px">
        <q-card-section class="bg-blue-7 text-white">
          <div class="text-h6">Roles de Usuario</div>
          <div class="" v-if="usuarioSeleccionado">
            {{ usuarioSeleccionado?.first_name }} {{ usuarioSeleccionado?.last_name }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="" v-if="optRoles.length > 0">
            <q-option-group :options="optRoles" type="toggle" v-model="rolesAsignados" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-blue-7">
          <q-btn flat label="Registrar" @click="saveRoles" />
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-table flat bordered title="Usuarios" :columns="columns" :rows="rows" row-key="id" v-model:pagination="pagination"
      :rows-per-page-options="[0]" @request="onRequest">
      <template v-slot:top>
        <q-btn outline label="Agregar" color="blue-7" icon="add_box" to="/admin/usuarios/form" />
        <q-space />
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar" @update:model-value="updateData">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <!-- <q-input borderless clearable dense debounce="300" v-model="filter" placeholder="Buscar"> -->
        <!--   <template v-slot:append> -->
        <!--     <q-icon name="search" /> -->
        <!--   </template> -->
        <!-- </q-input> -->
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat padding="sm" icon="more_vert">
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup @click="openDlgRoles(props.row)">
                  <q-item-section avatar>
                    <q-icon color="blue" name="group" />
                  </q-item-section>
                  <q-item-section>Roles</q-item-section>
                </q-item>

                <q-item clickable v-close-popup :to="`/admin/usuarios/form?id=${props.row.id}`">
                  <q-item-section avatar>
                    <q-icon color="blue" name="edit"/>
                  </q-item-section>
                  <q-item-section>Editar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { QTableColumn } from 'quasar';
import { api } from 'src/boot/axios'
import { Usuario, Rol, OptionList, Pagination, RequestProps } from 'src/components/admin'

const rows = ref<Usuario[]>([]);
const filter = ref<string | undefined>(undefined);
const dlgRoles = ref<boolean>(false);
// const optRoles = ref<Rol | undefined>(undefined);
const optRoles = ref<OptionList[]>([]);
const rolesAsignados = ref<number[]>([]);
const usuarioSeleccionado = ref<Usuario | undefined>(undefined);

const columns: QTableColumn<Usuario>[] = [
  { name: 'actions', label: '', field: 'actions', align: 'left' },
  { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
  { name: 'first_name', label: 'Nombre', align: 'left', field: 'first_name', sortable: true },
  { name: 'last_name', label: 'Apellido', align: 'left', field: 'last_name', sortable: true },
  { name: 'usuario', label: 'Usuario', align: 'left', field: 'usuario', sortable: true },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'institucion_nombre', label: 'Institución', align: 'left', field: 'institucion_nombre', sortable: true },
  // { name: 'usuarios', label: 'Usuarios', align: 'right', field: 'usuarios', sortable: true },
  // { name: 'datos', label: 'datos', align: 'left', field: 'datos', sortable: true },
]

const loading = ref(false)
const pagination = ref<Pagination>({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 30,
  rowsNumber: 0
})

const openDlgRoles = (row: Usuario) => {
  usuarioSeleccionado.value = row
  rolesAsignados.value = []
  usuarioSeleccionado.value.roles.forEach(r => rolesAsignados.value.push(r.id))

  dlgRoles.value = true
}

const getRoles = async () => {
  const resp = await api.get(`${process.env.API}/api/v1/admin/roles`)
  const roles: Rol[] = resp.data.data;

  optRoles.value = roles.map((item: Rol) => ({
    label: item.role,
    value: item.id
  }))
}

const updateData = async () => {
  await getData()
}

const saveRoles = async () => {
  if (usuarioSeleccionado.value) {
    const data = {
      usuario: usuarioSeleccionado.value.id,
      roles: rolesAsignados.value
    }
    const resp = await api.post(`${process.env.API}/api/v1/admin/roles`, data)
    const index = rows.value.findIndex(x => x.id === usuarioSeleccionado.value?.id)
    rows.value[index].roles = resp.data.data
    dlgRoles.value = false
  }
}

const getData = async () => {

  let where: string | object = '';

  if (filter.value) {
    const whereClause: object = {
      $or: [
        { last_name: { $ilike: `%${filter.value}%` } },
        { first_name: { $ilike: `%${filter.value}%` } },
      ],
    };

    where = JSON.stringify(whereClause);
  }
  let sortBy
  if (pagination.value.descending) {
    sortBy = '-' + pagination.value.sortBy
  } else {
    sortBy = pagination.value.sortBy
  }

  let resp
  let url
  if (where) {
    url = `${process.env.API}/api/v1/admin/usuarios?page=${pagination.value.page}&page_size=${pagination.value.rowsPerPage}&sort_by=${sortBy}&where=${where}`;
  } else {
    url = `${process.env.API}/api/v1/admin/usuarios?page=${pagination.value.page}&page_size=${pagination.value.rowsPerPage}&sort_by=${sortBy}`;
  }

  resp = await api.get(url)
  rows.value = resp.data.data
  pagination.value.rowsNumber = resp.data.meta.total_objects
}

const onRequest = async (props: RequestProps) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  filter.value = props.filter
  loading.value = true;

  if (pagination.value.rowsPerPage === 0) {
    pagination.value.rowsPerPage = 10;
  }

  pagination.value.sortBy = sortBy;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.descending = descending;

  await getData();

  loading.value = false;
};

onMounted(async () => {
  setTimeout(async () => {
    await getData()
    await getRoles()
  }, 200)
})
</script>
