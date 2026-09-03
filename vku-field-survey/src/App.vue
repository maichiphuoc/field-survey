<script setup lang="ts">
import SurveyForm from './components/SurveyForm.vue';
</script>

<template>
  <div class="app">

    <!-- Header -->
    <header class="app-header">
      <div>
        <h1>VKU Field Survey</h1>
        <p>Campus Facility Inspection</p>
      </div>

      <div class="network-status">
        <span class="status-dot"></span>
        Online
      </div>
    </header>

    <!-- Main -->
    <main class="app-main">

      <section class="welcome">
        <h2>New Field Survey</h2>

        <p>
          Record campus facility conditions
          even when you are offline.
        </p>
      </section>

      <SurveyForm />

    </main>

  </div>
</template>