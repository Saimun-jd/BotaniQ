import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
    Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import { usePlants } from '../context/PlantContext';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const AddPlantModal: React.FC<{
    visible: boolean;
    onClose: () => void;
}> = ({ visible, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState<string | undefined>(undefined);
    const [wateringFrequency, setWateringFrequency] = useState('');
    const [showWateringTimePicker, setShowWateringTimePicker] = useState(false);
    const [wateringTime, setWateringTime] = useState(new Date());
    const [fertilizingFrequency, setFertilizingFrequency] = useState('');
    const [showFertilizingTimePicker, setShowFertilizingTimePicker] = useState(false);
    const [fertilizingTime, setFertilizingTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    const { addPlant } = usePlants();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleAddPlant = async () => {
        // Validate inputs
        if (!name || !wateringFrequency) {
            Alert.alert('Validation Error', 'Please enter plant name and watering frequency');
            return;
        }

        setIsLoading(true);

        try {
            const newPlant = {
                id: uuidv4(),
                name,
                description,
                imageUri,
                wateringSchedule: {
                    frequency: parseInt(wateringFrequency),
                    lastWatered: new Date(),
                },
                fertilizingSchedule: fertilizingFrequency ? {
                    frequency: parseInt(fertilizingFrequency),
                    lastFertilized: new Date(),
                } : undefined
            };

            // Use await to ensure plant is added before closing
            await addPlant(newPlant);

            // Reset form and close modal
            resetForm();
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to add plant. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setImageUri(undefined);
        setWateringFrequency('');
        setWateringTime(new Date());
        setShowWateringTimePicker(false);
        setFertilizingFrequency('');
        setFertilizingTime(new Date());
        setShowFertilizingTimePicker(false);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white w-11/12 rounded-lg p-4">
                    <Text className="text-xl font-bold mb-4">Add New Plant</Text>

                    <TextInput
                        className="border border-gray-300 p-2 rounded mb-2"
                        placeholder="Plant Name"
                        value={name}
                        onChangeText={setName}
                    />

                    <TextInput
                        className="border border-gray-300 p-2 rounded mb-2"
                        placeholder="Description (Optional)"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    {imageUri && (
                        <Image
                            source={{ uri: imageUri }}
                            className="w-full h-40 rounded mb-2"
                        />
                    )}

                    <TouchableOpacity
                        className="bg-green-500 p-2 rounded mb-2"
                        onPress={pickImage}
                    >
                        <Text className="text-white text-center">Pick Image</Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center mb-2">
                        <TextInput
                            className="border border-gray-300 p-2 rounded flex-1 mr-2"
                            placeholder="Watering Frequency (Days)"
                            value={wateringFrequency}
                            onChangeText={setWateringFrequency}
                            keyboardType="numeric"
                        />
                        <Text>Days</Text>
                    </View>

                    <TouchableOpacity
                        className="bg-white p-2 rounded mb-2 border border-gray-300"
                        onPress={() => setShowWateringTimePicker(true)}
                    >
                        <Text>Select Watering Time: {wateringTime.toLocaleTimeString()}</Text>
                    </TouchableOpacity>

                    {showWateringTimePicker && (
                        <DateTimePicker
                            value={wateringTime}
                            mode="time"
                            is24Hour={true}
                            onChange={(event, selectedTime) => {
                                setShowWateringTimePicker(Platform.OS === 'ios');
                                if (selectedTime) setWateringTime(selectedTime);
                            }}
                        />
                    )}

                    <View className="flex-row items-center mb-2">
                        <TextInput
                            className="border border-gray-300 p-2 rounded flex-1 mr-2"
                            placeholder="Fertilizing Frequency (Optional)"
                            value={fertilizingFrequency}
                            onChangeText={setFertilizingFrequency}
                            keyboardType="numeric"
                        />
                        <Text>Days</Text>
                    </View>

                    {fertilizingFrequency ? (
                        <>
                            <TouchableOpacity
                                className="bg-white p-2 rounded mb-2 border border-gray-300"
                                onPress={() => setShowFertilizingTimePicker(true)}
                            >
                                <Text>Select Fertilizing Time: {fertilizingTime.toLocaleTimeString()}</Text>
                            </TouchableOpacity>

                            {showFertilizingTimePicker && (
                                <DateTimePicker
                                    value={fertilizingTime}
                                    mode="time"
                                    is24Hour={true}
                                    onChange={(event, selectedTime) => {
                                        setShowFertilizingTimePicker(Platform.OS === 'ios');
                                        if (selectedTime) setFertilizingTime(selectedTime);
                                    }}
                                />
                            )}
                        </>
                    ) : null}

                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity
                            className="bg-red-500 p-2 rounded w-5/12"
                            onPress={onClose}
                            disabled={isLoading}
                        >
                            <Text className="text-white text-center">Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-green-500 p-2 rounded w-5/12"
                            onPress={handleAddPlant}
                            disabled={isLoading}
                        >
                            <Text className="text-white text-center">
                                {isLoading ? 'Adding...' : 'Add Plant'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddPlantModal;