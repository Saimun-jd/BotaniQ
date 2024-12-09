import React, { createContext, useState, useContext, useEffect } from 'react';
import { Plant } from '../types/Plant';
import { storeData, getData } from '../utils/storage';

interface PlantContextType {
  plants: Plant[];
  addPlant: (plant: Plant) => Promise<void>;
  removePlant: (plantId: string) => Promise<void>;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

export const PlantProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const storedPlants = await getData('plants');
        if (storedPlants) {
          setPlants(storedPlants);
        }
      } catch (error) {
        console.error('Error loading plants', error);
      }
    };
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

  return (
    <PlantContext.Provider value={{ plants, addPlant, removePlant }}>
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