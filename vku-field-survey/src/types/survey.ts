export interface Survey {
  id: string;

  building: string;
  room: string;

  category: string;

  condition: 'good' | 'warning' | 'bad';

  description: string;

  latitude?: number;
  longitude?: number;

  photos: string[];

  createdAt: number;
  updatedAt: number;

  synced: boolean;
}