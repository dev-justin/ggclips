<script setup>
import Header from "@/components/global/Header.vue";
import AuthForms from "@/components/forms/AuthForms.vue";
</script>

<template>
  <Header />
  <router-view />
  <AuthForms />
</template>
