import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { type User } from '../context/UserContext';

const ProfileAvatar: React.FC<{
    user: User,
    onSignOut: () => Promise<void>
}> = ({ user, onSignOut }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={() => setIsMenuVisible(true)}
        className="rounded-full overflow-hidden h-14 w-14 border-2 border-gray-200"
      >
        {user?.photo ? (
          <Image
            source={{ uri: user.photo }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full bg-blue-500 items-center justify-center">
            <Text className="text-white text-lg font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setIsMenuVisible(false)}
        >
          <View className="absolute top-14 right-4 bg-white rounded-lg shadow-lg w-64 overflow-hidden">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">
                {user?.name || 'User Name'}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {user?.email || 'user@example.com'}
              </Text>
            </View>

            <View className="p-2">
              <TouchableOpacity
                className="p-3 flex-row items-center"
                onPress={() => {
                  setIsMenuVisible(false);
                  onSignOut?.();
                }}
              >
                <Text className="text-red-500 font-medium">Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ProfileAvatar;