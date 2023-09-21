import LogRocket from '@logrocket/react-native';
import Config from 'react-native-config';

import { getSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

if (!__DEV__) {
	getSelectedTeam().then(response => {
		if (response) {
			LogRocket.init(Config.LOGROCKET_APP_ID || '');
		}
	});
}
