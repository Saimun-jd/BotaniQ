import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <SafeAreaView className="flex-1 bg-green-50 items-center justify-center p-6">
      <View className="items-center mb-8">
        <Image 
          source={require('../../assets/images/botaniq-logo.png')} 
          className="w-48 h-48 mb-4" 
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-green-800 mb-4">
          Welcome to BotaniQ
        </Text>
        <Text className="text-center text-gray-600 mb-6">
          Track your plants, get watering reminders, and become a plant care expert!
        </Text>
      </View>

      <View className="w-full">
        <TouchableOpacity 
          className="bg-green-500 p-4 rounded-lg items-center"
          onPress={onComplete}
        >
          <Text className="text-white text-lg font-bold">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;