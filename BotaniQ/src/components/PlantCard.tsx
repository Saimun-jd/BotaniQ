import React from 'react';
import { View, Text, Image } from 'react-native';
import { Plant } from '../types/Plant';

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  return (
    <View className="bg-white rounded-lg shadow-md p-2 items-center">
      {plant.imageUri && (
        <Image 
          source={{ uri: plant.imageUri }} 
          className="w-full h-40 rounded-md mb-2" 
          resizeMode="cover"
        />
      )}
      <Text className="text-lg font-bold text-center mb-1">{plant.name}</Text>
      <Text className="text-sm text-green-600 text-center">
        Water every {plant.wateringSchedule.frequency} days
      </Text>
    </View>
  );
};

export default PlantCard;