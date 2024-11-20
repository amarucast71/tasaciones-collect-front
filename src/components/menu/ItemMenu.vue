<template>
  <div>
    <q-item
      :key="props.item.title"
      clickable
      exact
      :to="props.item.link"
      :disable="item.disable"
    >
      <q-item-section
        v-if="props.item.icon"
        avatar
      >
        <q-icon :name="props.item.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ props.item.title }}</q-item-label>
        <q-item-label caption>
          {{ props.item.caption }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>

</template>
<script setup lang="ts">

import { Item } from '../menu'

interface Props {
  item: Item;
}

const props = defineProps<Props>();

</script>
