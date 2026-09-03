const API_URL = 'http://localhost:3000/api';

export async function uploadSurvey(survey: unknown) {
  const response = await fetch(`${API_URL}/surveys`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(survey),
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}