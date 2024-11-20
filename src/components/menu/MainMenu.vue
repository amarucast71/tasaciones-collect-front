<template>
  <div>
    <div v-for="item in props.items" :key="item.title">
      <div v-if="item.childs && item.childs.length > 0">
        <expand-menu :item="item" />
      </div>
      <div v-else>
        <item-menu :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ItemMenu from './ItemMenu.vue'
  import ExpandMenu from './ExpandMenu.vue'
  import { Item } from '../menu';
  const props = defineProps<{ items: Item[] }>();
</script>
