import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import { getTeamSubscription } from '@teams/Functions/Team/Subscriptions';

import Button from '@components/Button';
import Loading from '@components/Loading';

import { handlePurchase } from '@teams/Utils/Purchases/HandlePurchase';
import { Section, SectionTitle } from '../../styles';

import {
	SubscriptionDescription,
	SubscriptionTableTitle,
	SubscriptionContainer,
	SubscriptionInformations,
} from './styles';

const Subscriptions: React.FC = () => {
	const [subscription, setSubscription] =
		useState<ITeamSubscription | null>();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const dateFormat = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'MM/dd/yyyy';
		}
		return 'dd/MM/yyyy';
	}, []);

	const subExpDate = useMemo(() => {
		if (subscription) {
			return format(parseISO(String(subscription.expireIn)), dateFormat);
		}
		return null;
	}, [dateFormat, subscription]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const sub = await getTeamSubscription();

			setSubscription(sub);
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
	}, []);

	const handleNavigatePurchase = useCallback(async () => {
		await handlePurchase();
	}, []);

	return isLoading ? (
		<Loading />
	) : (
		<Section>
			<SectionTitle>
				{strings.View_TeamView_Subscription_Title}
			</SectionTitle>

			<SubscriptionDescription>
				{strings.View_TeamView_Subscription_Description}
			</SubscriptionDescription>

			<Button
				title={
					!subscription
						? strings.View_TeamView_Subscription_Button_SeePlans
						: strings.View_TeamView_Subscription_Button_ChangePlans
				}
				onPress={handleNavigatePurchase}
			/>

			{subscription && !!subExpDate && (
				<>
					<SubscriptionTableTitle>
						{
							strings.View_TeamView_Subscription_CurrentSubscription_Title
						}
					</SubscriptionTableTitle>

					<SubscriptionContainer>
						<SubscriptionInformations>
							{strings.View_TeamView_Subscription_CurrentSubscription_Description.replace(
								'{MEMBERS}',
								String(subscription.membersLimit)
							).replace('{DATE}', subExpDate)}
						</SubscriptionInformations>
					</SubscriptionContainer>
				</>
			)}
		</Section>
	);
};

export default React.memo(Subscriptions);
