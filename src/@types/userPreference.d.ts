import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { DefaultTheme } from 'styled-components';

interface IUserPreferences {
    howManyDaysToBeNextToExpire: number;
    appTheme: DefaultTheme;
    enableNotifications: boolean;
    notificationCadency: NotificationCadency;
    user: FirebaseAuthTypes.User | null;
    selectedTeam: IUserRoles;
}
