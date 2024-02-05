import AsyncStorage from '@react-native-async-storage/async-storage';

async function getCurrentTeam(): Promise<ITeam | null> {
	const selectedTeamAsString = await AsyncStorage.getItem('currentTeam');

	if (selectedTeamAsString) {
		return JSON.parse(selectedTeamAsString);
	}

	return null;
}

async function setCurrentTeam(currentTeam: ITeam): Promise<void> {
	await AsyncStorage.setItem('currentTeam', JSON.stringify(currentTeam));
}

async function clearCurrentTeam(): Promise<void> {
	await AsyncStorage.removeItem('currentTeam');
}

export { getCurrentTeam, setCurrentTeam, clearCurrentTeam };
