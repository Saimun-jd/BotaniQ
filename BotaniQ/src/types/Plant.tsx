export interface Plant {
    id: string;
    name: string;
    description: string;
    imageUri?: string;
    wateringSchedule: {
      frequency: number; // days between watering
      lastWatered: Date;
    };
    fertilizingSchedule?: {
      frequency: number; // days between fertilizing
      lastFertilized: Date;
    };
  }