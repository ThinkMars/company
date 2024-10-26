<template>
  <HelloWorld msg="Vite + Vue" />
  <button @click="handleFetch">Fetch发请求</button>
  <button @click="handleXHR">XHR发请求</button>
  <button @click="handleNav">路由跳转</button>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import axios from 'axios'
import HelloWorld from '@/components/HelloWorld.vue'

const router = useRouter()

function handleFetch() {
  fetch('http://localhost:3000/', {
    method: 'GET',
  })
}

function handleXHR() {
  axios.get('http://localhost:3000/test')
}

function handleNav() {
  router.push('/about')
}
</script>
