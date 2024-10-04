<script setup lang="ts">
import axios from 'axios'
import HelloWorld from './components/HelloWorld.vue'

function handleFetch() {
  fetch('http://localhost:3000/', {
    method: 'GET',
  })
}

function handleXHR() {
  axios.get('http://localhost:3000/test')
}
</script>

<template>
  <HelloWorld msg="Vite + Vue" />
  <button @click="handleFetch">Fetch发请求</button>
  <button @click="handleXHR">XHR发请求</button>
</template>

<style scoped></style>
