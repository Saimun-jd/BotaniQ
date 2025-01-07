import React, { createContext, useState, useContext, useEffect } from 'react';
import { Plant } from '../types/Plant';
import { storeData, getData } from '../utils/storage';
import { supabase } from '../utils/supabase';

interface PlantContextType {
  plants: Plant[];
  addPlant: (plant: Plant) => Promise<void>;
  removePlant: (plantId: string) => Promise<void>;
  removeAllPlants: () => Promise<void>;
  fetchAllPlants: () => Promise<void>;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>([]);

  const loadPlants = async () => {
    try {
      // const storedPlants = await getData('plants');
      // fetching plants from supabase database
      const supabaseSession = await supabase.auth.getUser();
      let allPlants = []
      if (supabaseSession) {
        try {
          const { data, error } = await supabase.from('Plants').select('*').order('created_at', { ascending: false }).eq('user_id', supabaseSession.data.user?.id);
          if (error) {
            console.log(error);
          } else {
            // console.log("stored plants are ", data);
            data.forEach((plant) => {
              const newPlant = {
                id: plant.plant_id,
                name: plant.name,
                description: plant.description,
                imageUri: plant.imageUri, 
                wateringSchedule: {
                  frequency: plant.watering_frequency,
                  lastWatered: plant.last_watered
                },
                fertilizingSchedule: {
                  frequency: plant.fertilizing_frequency,
                  lastFertilized: plant.last_fertilized
                }
              }
              allPlants.push(newPlant);
              setPlants(allPlants);
            })
          }
        } catch (error) {
          console.log("error fetching plants ", error);
        }
      }

      // if (storedPlants) {
      //   setPlants(storedPlants);
      // }
    } catch (error) {
      console.error('Error loading plants', error);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const addPlant = async (plant: Plant) => {
    try {
      const updatedPlants = [...plants, plant];
      await storeData('plants', updatedPlants);
      setPlants(updatedPlants);
    } catch (error) {
      console.error('Error adding plant', error);
    }
  };

  const removePlant = async (plantId: string) => {
    try {
      const updatedPlants = plants.filter(plant => plant.id !== plantId);
      await storeData('plants', updatedPlants);
      setPlants(updatedPlants);
    } catch (error) {
      console.error('Error removing plant', error);
    }
  };

  const removeAllPlants = async () => {
    try{
      await storeData('plants', []);
      setPlants([]);
    } catch(error) {
      console.log("error removing all plants ", error);
    }
  }

  const fetchAllPlants = async () => {
    loadPlants();
  }

  return (
    <PlantContext.Provider value={{ plants, addPlant, removePlant, removeAllPlants, fetchAllPlants }}>
      {children}
    </PlantContext.Provider>
  );
};

export const usePlants = () => {
  const context = useContext(PlantContext);
  if (context === undefined) {
    throw new Error('usePlants must be used within a PlantProvider');
  }
  return context;
};