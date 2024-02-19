import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import {
	getFormattedLogText,
	getTeamLogs,
} from '@teams/Functions/Team/Management/Logs';

import Header from '@components/Header';
import Loading from '@components/Loading';
import PaddingComponent from '@components/PaddingComponent';

import { Container, Content, LogCard, LogText } from './styles';

const Logs: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [logs, setLogs] = useState<ILog[]>([]);

	const loadData = useCallback(async () => {
		try {
			setRefreshing(true);
			const response = await getTeamLogs();

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
	}, []);

	useEffect(() => {
		loadData();
	}, []);

	const handleNavigateToDetails = useCallback(
		(item: ILog) => {
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

	return (
		<Container>
			<Header
				title="Logs"
				noDrawer
				appBarActions={[
					{
						icon: 'update',
						onPress: loadData,
						disabled: refreshing,
					},
				]}
			/>

			{refreshing ? (
				<Loading />
			) : (
				<Content>
					{logs.map(log => (
						<LogCard
							key={log.id}
							onPress={() => handleNavigateToDetails(log)}
						>
							<LogText>{`${getFormattedLogText(log)}`}</LogText>
						</LogCard>
					))}

					<PaddingComponent />
				</Content>
			)}
		</Container>
	);
};

export default Logs;
