import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getData, storeData } from '../utils/storage';

export type User = {
    id: string;
    name: string;
    email: string;
    photo: string;
}

interface UserContextType {
    user: User | null;
    addUser: (user: User) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await getData('user');
                if (storedUser) {
                    setUser(user);
                }
            } catch (error) {
                console.error('Error loading plants', error);
            }
        }
        loadUser();
    }, [])

    const addUser = async (user: User) => {
        try {
            await storeData('user', user);
            setUser(user);
            console.log('user set successful')
        } catch (error) {
            console.error('Error adding user to context', error);
        }
    }


    return (
        <UserContext.Provider value={{ user, addUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('usePlants must be used within a PlantProvider');
    }
    return context;
};