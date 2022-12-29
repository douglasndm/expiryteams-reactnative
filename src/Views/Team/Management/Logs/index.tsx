import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '@teams/Contexts/TeamContext';

import {
	getFormattedLogText,
	getTeamLogs,
} from '@teams/Functions/Team/Management/Logs';

import Header from '@components/Header';
import Loading from '@components/Loading';

import { Container, List, LogCard, LogText } from './styles';

const Logs: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();
	const teamContext = useTeam();

	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [logs, setLogs] = useState<ILog[]>([]);

	const loadData = useCallback(async () => {
		if (!teamContext.id) return;

		try {
			setRefreshing(true);
			const response = await getTeamLogs({ team_id: teamContext.id });

			setLogs(response);
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setRefreshing(false);
		}
	}, [teamContext.id]);

	useEffect(() => {
		loadData();
	}, []);

	const handleNavigateToDetails = useCallback(
		item => {
			const log: ILog = item as ILog;

			if (log.batch && log.product) {
				navigate('BatchView', {
					batch: JSON.stringify(log.batch),
					product: JSON.stringify(log.product),
				});
			} else if (!log.batch && log.product) {
				navigate('ProductDetails', {
					id: log.product.id,
				});
			}
		},
		[navigate]
	);

	const renderItem = useCallback(({ item }) => {
		const log: ILog = item as ILog;

		return (
			<LogCard onPress={() => handleNavigateToDetails(item)}>
				<LogText>{`${getFormattedLogText(log)}`}</LogText>
			</LogCard>
		);
	}, []);
	return refreshing ? (
		<Loading />
	) : (
		<Container>
			<Header title="Logs" noDrawer />

			<List
				data={logs}
				keyExtractor={(_, index) => String(index)}
				renderItem={renderItem}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={loadData}
					/>
				}
			/>
		</Container>
	);
};

export default Logs;
