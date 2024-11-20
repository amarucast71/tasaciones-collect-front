<template>
  <div v-if="props.item.childs && props.item.childs.length > 0">
    <q-expansion-item
      expand-separator
      :content-inset-level="0.25"
      :icon="props.item.icon"
      :label="props.item.title"
      :caption="props.item.caption"
    >
      <div>
        <expand-menu
          v-for="subitem in props.item.childs"
          :key="subitem.title"
          :item="subitem"
        />
      </div>
    </q-expansion-item>
  </div>
  <div v-else>
    <item-menu :item="props.item" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import ItemMenu from './ItemMenu.vue';
import { Item } from '../menu';
const ExpandMenu = defineAsyncComponent(() => import('./ExpandMenu.vue'))

const props = defineProps<{ item: Item }>();

// const components = {
//   ItemMenu,
//   ExpandMenu: defineAsyncComponent(() => import('./ExpandMenu.vue')),
// };
</script>
