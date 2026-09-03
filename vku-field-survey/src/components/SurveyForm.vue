<script setup lang="ts">
import { reactive } from 'vue';
import { saveSurvey } from '../db/surveyRepository';

const form = reactive({
  building: '',
  room: '',
  category: '',
  condition: 'good' as 'good' | 'warning' | 'bad',
  description: '',
});

async function submitSurvey() {
  const survey = {
    id: crypto.randomUUID(),

    ...form,

    photos: [],

    createdAt: Date.now(),
    updatedAt: Date.now(),

    synced: false,
  };

  await saveSurvey(survey);

  alert('Đã lưu khảo sát offline');

  form.building = '';
  form.room = '';
  form.category = '';
  form.condition = 'good';
  form.description = '';
}
</script>

<template>
  <form @submit.prevent="submitSurvey">

    <input
      v-model="form.building"
      placeholder="Tòa nhà"
      required
    />

    <input
      v-model="form.room"
      placeholder="Phòng"
      required
    />

    <input
      v-model="form.category"
      placeholder="Hạng mục"
      required
    />

    <select v-model="form.condition">
      <option value="good">Tốt</option>
      <option value="warning">Cảnh báo</option>
      <option value="bad">Hư hỏng</option>
    </select>

    <textarea
      v-model="form.description"
      placeholder="Mô tả tình trạng"
    />

    <button type="submit">
      Lưu khảo sát
    </button>

  </form>
</template>