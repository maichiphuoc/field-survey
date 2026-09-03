import { db } from './database';
import type { Survey } from '../types/survey';

export async function saveSurvey(survey: Survey) {
  await db.put('surveys', survey);
}

export async function getSurvey(id: string) {
  return db.get('surveys', id);
}

export async function getAllSurveys(): Promise<Survey[]> {
  return db.getAll('surveys');
}

export async function deleteSurvey(id: string) {
  await db.delete('surveys', id);
}