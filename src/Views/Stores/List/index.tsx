import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '@teams/Contexts/TeamContext';

import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';
import { createStore } from '@teams/Functions/Team/Stores/Create';

import List from '@views/Store/List';

const ListView: React.FC = () => {
	const teamContext = useTeam();

	const [stores, setStores] = useState<Array<IStore>>([]);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isAdding, setIsAdding] = useState<boolean>(false);

	const isManager = useMemo(() => {
		if (teamContext.roleInTeam) {
			const role = teamContext.roleInTeam.role.toLowerCase();
			if (role === 'manager') {
				return true;
			}
		}
		return false;
	}, [teamContext.roleInTeam]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await getAllStoresFromTeam();

			setStores(response);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleSave = useCallback(
		async (storeName: string) => {
			try {
				setIsAdding(true);

				const store = await createStore({
					name: storeName,
				});

				setStores([...stores, store]);
			} catch (err) {
				if (err instanceof Error)
					showMessage({
						message: err.message,
						type: 'danger',
					});
			} finally {
				setIsAdding(false);
			}
		},
		[stores]
	);

	return (
		<List
			stores={stores}
			isLoading={isLoading}
			isAdding={isAdding}
			allowCreate={isManager}
			showNoStore={false}
			createStore={handleSave}
		/>
	);
};

export default ListView;
