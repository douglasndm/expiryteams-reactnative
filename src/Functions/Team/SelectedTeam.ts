import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getSelectedTeam(): Promise<IUserRoles> {
    const selectedTeamAsString = await AsyncStorage.getItem('selectedTeam');

    if (!selectedTeamAsString) {
        throw new Error('Selected team was not found');
    }
    const selectedTeam: IUserRoles = JSON.parse(selectedTeamAsString);

    return selectedTeam;
}

export async function setSelectedTeam(userRole: IUserRoles): Promise<void> {
    await AsyncStorage.setItem('selectedTeam', JSON.stringify(userRole));
}

export async function clearSelectedteam(): Promise<void> {
    await AsyncStorage.removeItem('selectedTeam');
}
