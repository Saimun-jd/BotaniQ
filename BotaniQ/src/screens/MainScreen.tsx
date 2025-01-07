import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Modal,
    Alert
} from 'react-native';
import { usePlants } from '../context/PlantContext';
import PlantCard from '../components/PlantCard';
import AddPlantModal from '../components/AddPlantModal';
import { Plant } from '../types/Plant';
import GoogleAuth from '../components/Auth';
import { useUser } from '../context/UserContext';
import ProfileAvatar from '../components/ProfileAvatar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../utils/supabase';

const PlantDetailModal: React.FC<{
    plant: Plant | null;
    visible: boolean;
    onClose: () => void;
    removePlant: (plantId: string) => void;
    setShowConfirmModal: (val: boolean) => void;
    handleRemoveRequest: () => void;
    isDeleting: boolean;
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
    handleConfirmRemove: () => Promise<void>
}> = ({ showConfirmModal, setShowConfirmModal, selectedPlant, removePlant, setSelectedPlant, handleConfirmRemove }) => {

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
    const { plants, removePlant, removeAllPlants } = usePlants();
    const [isPlantDetailsModalVisible, setIsPlantDetailsModalVisible] = useState<boolean>(false)
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const { user, removeUser } = useUser();
    const insets = useSafeAreaInsets()
    const [isDeleting, setIsDeleting] = useState(false);


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

    const handleConfirmRemove = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        if (selectedPlant) {
            const supabaseSession = await supabase.auth.getUser();
            if (supabaseSession) {
                try {
                    const { error } = await supabase.from('Plants').delete().eq('plant_id', selectedPlant.id.toString());
                    if (error) {
                        setIsDeleting(false);
                        // Alert("sorry could not delete the plant");
                        console.log("error removing plant ", error);
                        return;
                    } else {
                        removePlant(selectedPlant.id);
                        setShowConfirmModal(false);
                        // TODO: 1
                        // Remove calender event for this plant
                        console.log("successfully removed plant ", selectedPlant.name);
                    }
                } catch (error) {
                    console.log("error deleting plant ", error);
                } finally {
                    setIsDeleting(false);
                }
                // console.log("selected plant id ", selectedPlant.id);

            }
            // console.log("supabase session ", supabaseSession.data.user?.id)
        }
    }

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();

            removeUser(user);
            removeAllPlants();

            console.log("signout successful")
            //   setState({ user: null }); 
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <View className="flex-1 bg-green-50" style={{ paddingTop: insets.top }}>
            <StatusBar animated={true} backgroundColor='#61dafb' hidden={true} />
            {/* Header */}

            <View className="bg-green-600 p-6 pb-4 flex flex-row justify-between items-center" >
                <View className='pb-6'>
                    <Text className="text-white text-3xl font-bold mt-6">{user != null && user?.name ? `${user?.name.split(' ')[0]}'s Garden` : 'My Garden'}</Text>
                    <Text className="text-green-100">
                        {plants.length} plants in your collection
                    </Text>
                </View>
                {/* <TouchableOpacity className='flex items-center justify-center w-14 h-14 bg-green-600 rounded'>
                    {user? <Text numberOfLines={1} className='font-bold text-lg text-white'>{user.name.split(' ')[0]}</Text> : <GoogleAuth /> }
                </TouchableOpacity> */}
                {
                    user != null ?
                        <ProfileAvatar user={user} onSignOut={signOut} />
                        : <GoogleAuth />
                }

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
                isDeleting={isDeleting}
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