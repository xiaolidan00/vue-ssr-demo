<template>
  <div>
    <h1 @click="changeData()">Home</h1>
    <ol>
      <li v-for="(i, ii) in list" :key="ii">
        {{ i }}
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  const list = ref<number[]>([]);

  const changeData = () => {
    let d: number[] = [];
    for (let i = 0; i < 100; i++) {
      d.push(Math.round(Math.random() * 100));
    }
    list.value = d;
  };
  changeData();
</script>

<style scoped></style>
