import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Modal
} from 'react-native';
import { usePlants } from '../context/PlantContext';
import PlantCard from '../components/PlantCard';
import AddPlantModal from '../components/AddPlantModal';
import { Plant } from '../types/Plant';

const PlantDetailModal: React.FC<{
    plant: Plant | null;
    visible: boolean;
    onClose: () => void,
    removePlant: (plantId: string) => void,
    setShowConfirmModal: (val: boolean) => void,
    handleRemoveRequest: () => void 
}> = ({ plant, visible, onClose, removePlant, setShowConfirmModal, handleRemoveRequest }) => {

    if (!plant) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white w-11/12 rounded-lg p-6 gap-4">
                    <Text className="text-2xl font-bold mb-4">{plant.name}</Text>

                    <View className="flex-row mb-4">
                        <ImageBackground
                            source={{ uri: plant.imageUri }}
                            className="w-32 h-32 rounded-lg mr-4"
                            imageStyle={{ borderRadius: 8 }}
                        />

                        <View className="flex-1 justify-center">
                            <Text className="text-gray-600 mb-2">{plant.description}</Text>
                            <Text className="text-green-600">
                                Water every {plant.wateringSchedule.frequency} days
                            </Text>
                            {plant.fertilizingSchedule && (
                                <Text className="text-green-600">
                                    Fertilize every {plant.fertilizingSchedule.frequency} days
                                </Text>
                            )}
                        </View>
                    </View>


                    <TouchableOpacity
                        className="bg-green-500 p-3 rounded-lg items-center"
                        onPress={onClose}
                    >
                        <Text className="text-white font-bold">Close</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        className="bg-red-500 p-3 rounded-lg items-center"
                        onPress={handleRemoveRequest}
                    >
                        <Text className="text-white font-bold">Remove</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const ConfirmationModal: React.FC<{
    showConfirmModal: boolean,
    setShowConfirmModal: (val: boolean) => void,
    selectedPlant: Plant | null,
    removePlant: (plantId: string) => void,
    setSelectedPlant: (plant: Plant | null) => void,
    handleConfirmRemove: () => void
}> = ({showConfirmModal, setShowConfirmModal, selectedPlant, removePlant, setSelectedPlant, handleConfirmRemove}) => {

    if (!selectedPlant) return null;

    return (
        <Modal
            visible={showConfirmModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
                setShowConfirmModal(false)
                setSelectedPlant(null)
            }}
        >
            <View className="flex-1 justify-center items-center bg-black/50 gap-4">
                <Text className='text-white font-bold'>
                    Are you sure you want to remove this plant?
                </Text>
                <View className="bg-white w-11/12 rounded-lg p-6 gap-4">
                    <TouchableOpacity
                        className="bg-red-500 p-3 rounded-lg items-center"
                        onPress={handleConfirmRemove}
                    >
                        <Text className="text-white font-bold">Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-green-500 p-3 rounded-lg items-center"
                        onPress={() => {
                            setShowConfirmModal(false)
                            setSelectedPlant(null)
                        }}
                    >
                        <Text className="text-white font-bold">No</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const MainScreen: React.FC = () => {
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const { plants, removePlant } = usePlants();
    const [isPlantDetailsModalVisible, setIsPlantDetailsModalVisible] = useState<boolean>(false)
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const openPlantDetails = (plant: Plant) => {
        setSelectedPlant(plant);
        setIsPlantDetailsModalVisible(true)
    };

    const closePlantDetails = () => {
        setIsPlantDetailsModalVisible(false)
        setSelectedPlant(null);
    };

    const handleRemovePlantRequest = () => {
        setIsPlantDetailsModalVisible(false)
        setTimeout(() => {
            setShowConfirmModal(true)
        }, 300);
    }

    const handleConfirmRemove = () => {
        if(selectedPlant) {
            removePlant(selectedPlant.id);
            setShowConfirmModal(false);
        }
    }

    return (
        <View className="flex-1 bg-green-50">
            {/* Header */}
            <View className="bg-green-600 p-6 pb-4">
                <Text className="text-white text-3xl font-bold mt-6">My Garden</Text>
                <Text className="text-green-100">
                    {plants.length} plants in your collection
                </Text>
            </View>

            {/* Plant Grid */}
            <FlatList
                data={plants}
                numColumns={2}
                columnWrapperStyle={{
                    justifyContent: 'space-between',
                    paddingHorizontal: 8,
                    marginTop: 8
                }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="w-[48%] mb-4"
                        onPress={() => openPlantDetails(item)}
                    >
                        <PlantCard plant={item} />
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View className="items-center justify-center mt-10 p-4">
                        <Text className="text-gray-500 text-center">
                            No plants in your garden yet.
                            Tap the '+' button to add your first plant!
                        </Text>
                    </View>
                }
            />

            {/* Add Plant Button */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 bg-green-500 rounded-full w-16 h-16 items-center justify-center shadow-lg"
                onPress={() => setAddModalVisible(true)}
            >
                <Text className="text-white text-4xl">+</Text>
            </TouchableOpacity>

            {/* Add Plant Modal */}
            <AddPlantModal
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
            />

            {/* Plant Details Modal */}
            <PlantDetailModal
                plant={selectedPlant}
                visible={isPlantDetailsModalVisible}
                onClose={closePlantDetails}
                removePlant={removePlant}
                setShowConfirmModal={(val: boolean) => setShowConfirmModal(val)}
                handleRemoveRequest={handleRemovePlantRequest}
            />

            {/*confirmation modal*/}
           {<ConfirmationModal
                showConfirmModal={showConfirmModal}
                setShowConfirmModal={setShowConfirmModal}
                selectedPlant={selectedPlant}
                removePlant={removePlant}
                setSelectedPlant={setSelectedPlant}
                handleConfirmRemove={handleConfirmRemove}
            />}
        </View>
    );
};

export default MainScreen;