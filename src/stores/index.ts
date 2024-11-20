import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { persistencePlugin } from 'pinia-persistence-plugin';
import { Router } from 'vue-router';
// import localforage from 'localforage'

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */


declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

// localforage.config({
//   driver: [localforage.INDEXEDDB],
//   name: 'mosquitos',
//   storeName: 'store',
// })

export default store(() => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  pinia.use(
    persistencePlugin({
      storeKeysPrefix: 'mosquitos',
      persistenceDefault: false,
      storageItemsDefault: [
        {
          // storage: localforage,
          storage: localStorage,
        },
      ],
      debug: true,
    })
  );

  return pinia;
});
