import { RouteRecordRaw } from 'vue-router';
import FormPunto from 'src/pages/collect/FormPunto.vue'
import FormRelevamiento from 'src/pages/collect/FormRelevamiento.vue'
// import FormPunto from 'src/pages/collect/FormPunto.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      {
        path: '/collect',
        component: () => import('pages/collect/CollectPage.vue'),
        children: [
          {
            path: 'map/:lat?/:lng?/:id?',
            component: () => import('pages/collect/MapPage.vue'),
            props: true,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: 'formpunto',
            // component: () => import('pages/collect/FormPunto.vue'),
            component: FormPunto,
            props: true,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: 'formrelevamiento',
            component: FormRelevamiento,
            props: true,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: 'punto',
            component: () => import('pages/collect/PointData.vue'),
            props: true,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: 'puntos',
            component: () => import('pages/collect/PointsList.vue'),
            props: true,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: 'fotorelevamiento',
            component: () => import('pages/collect/FotoRelevamiento.vue'),
            props: true,
            meta: {
              requiresAuth: true
            }
          },

        ]
      },

      {
        path: '/admin',
        component: () => import('pages/admin/AdminPage.vue'),
        children: [
          { path: 'asuntos/form', component: () => import('pages/admin/asuntos/FormAsunto.vue') },
          { path: 'asuntos/list', component: () => import('pages/admin/asuntos/ListAsuntos.vue') },
          { path: 'instituciones/form', component: () => import('pages/admin/instituciones/FormInstitucion.vue') },
          { path: 'instituciones/list', component: () => import('pages/admin/instituciones/ListInstituciones.vue') },
          { path: 'usuarios/form', component: () => import('pages/admin/usuarios/FormUsuario.vue') },
          { path: 'usuarios/list', component: () => import('pages/admin/usuarios/ListUsuarios.vue') },
          { path: 'campanias/form', component: () => import('pages/admin/campanias/FormCampania.vue') },
          { path: 'campanias/list', component: () => import('pages/admin/campanias/ListCampanias.vue') },
          { path: 'reportes', component: () => import('pages/admin/reportes/IndexPage.vue') },
          { path: 'descargas', component: () => import('pages/admin/descargas/IndexPage.vue') },
        ],
        meta: {
          requiresAuth: true,
          requiredRoles: ['administrador']
        }
      },
      { path: '/login', component: () => import('pages/auth/FormLogin.vue') },
      {
        path: '/changepassword',
        component: () => import('pages/auth/FormPassword.vue'),
        meta: {
          requiresAuth: true
        }
      },
      { path: '/error403', component: () => import('pages/Error403.vue') },
    ]
  },


  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
];

export default routes;
