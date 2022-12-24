import React, { useCallback, useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';

import { clearSelectedteam } from '@teams/Functions/Team/SelectedTeam';
import { logoutFirebase } from '@teams/Functions/Auth/Firebase';

import Loading from '@components/Loading';

import { useTeam } from '@teams/Contexts/TeamContext';

import { reset } from '@teams/References/Navigation';

const Logout: React.FC = () => {
	const teamContext = useTeam();

	const handleLogout = useCallback(async () => {
		try {
			await logoutFirebase();
			await clearSelectedteam();

			if (teamContext.reload) {
				teamContext.reload();
			}

			reset({
				routeHandler: 'Auth',
				routesNames: ['Login'],
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [teamContext]);

	useEffect(() => {
		handleLogout();
	}, [handleLogout]);
	return <Loading />;
};

export default Logout;
