import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
    isSuccessResponse,
    isErrorWithCode
} from '@react-native-google-signin/google-signin'
import { supabase } from '../utils/supabase'
import { useUser, type User } from '../context/UserContext';
import { usePlants } from '../context/PlantContext';

const signIn = async (addUser: (user: User) => Promise<void>, fetchAllPlants: () => Promise<void> ) => {
    
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            console.log(response.data)
            if (response.data.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: "google",
                    token: response.data.idToken
                })
                console.log("printng user data ", response.data.user.name)
                const tokens = await GoogleSignin.getTokens();
                console.log("tokens are ", tokens)

                const user: User = {
                    id: response.data.user.id ?? 'no id',
                    name: response.data.user.name ?? 'no name',
                    email: response.data.user.email,
                    photo: response.data.user.photo ?? 'no photo',
                    provider_token: tokens.accessToken ?? 'no provider token'
                }
                await addUser(user);
                await fetchAllPlants();

            } else {
                throw new Error("no Id token present!")
            }
        } else {
            // sign in was cancelled by user
            console.log("sign in cancelled by user")
        }
    } catch (error) {
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // Android only, play services not available or outdated
                    break;
                default:
                // some other error happened
            }
        } else {
            // an error that's not related to google sign in occurred
        }
    }
};


export default function GoogleAuth() {
    const {addUser} = useUser();
    const {fetchAllPlants} = usePlants();
    GoogleSignin.configure({
        webClientId: '870973181283-qeu6tqc10rrqif7eblrib2umtj31nr41.apps.googleusercontent.com',
        scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Icon}
            color={GoogleSigninButton.Color.Light}
            onPress={() => signIn(addUser, fetchAllPlants)}
        />
    )
}