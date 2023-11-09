<script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  defineProps<{ msg?: string }>();
  type ListType = {
    name: string;
    value: number;
  };

  const list = ref<ListType[]>([]);
  axios.get('http://www.xiaolidan00.top/getRandNum.php').then(({ data: res }) => {
    list.value = res.data;
  });
</script>

<template>
  <h1>{{ msg }}</h1>

  <div>
    <button v-for="(item, idx) in list" :key="idx">{{ item.name }}-{{ item.value }}</button>
  </div>
</template>
