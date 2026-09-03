<script setup lang="ts">
import { reactive, ref } from 'vue';
import { saveSurvey } from '../db/surveyRepository';
import { takePhoto } from '../services/cameraService';

const form = reactive({
  building: '',
  room: '',
  category: '',
  condition: 'good' as 'good' | 'warning' | 'bad',
  description: '',
});

const photos = ref<string[]>([]);
const cameraError = ref('');

async function addPhoto() {
  cameraError.value = '';

  try {
    const photo = await takePhoto();

    if (photo) {
      photos.value.push(photo);
    }
  } catch {
    cameraError.value = 'Không thể mở camera. Hãy cấp quyền camera và thử lại.';
  }
}

async function submitSurvey() {
  const survey = {
    id: crypto.randomUUID(),

    ...form,

    photos: [...photos.value],

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
  photos.value = [];
  cameraError.value = '';
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

    <div class="photo-section">
      <button type="button" class="secondary-button" @click="addPhoto">
        Chụp ảnh
      </button>

      <p v-if="cameraError" class="camera-error">{{ cameraError }}</p>

      <div v-if="photos.length" class="photo-grid">
        <img
          v-for="(photo, index) in photos"
          :key="`${photo}-${index}`"
          :src="photo"
          :alt="`Ảnh khảo sát ${index + 1}`"
        />
      </div>
    </div>

    <button type="submit">
      Lưu khảo sát
    </button>

  </form>
</template>