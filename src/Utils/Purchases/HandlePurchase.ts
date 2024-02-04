import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

async function handlePurchase(): Promise<boolean> {
	if (!__DEV__) {
		Analytics().logEvent('started_susbscription_process');
	}

	const paywallResult: PAYWALL_RESULT =
		await RevenueCatUI.presentPaywallIfNeeded({});

	if (
		paywallResult === PAYWALL_RESULT.PURCHASED ||
		paywallResult === PAYWALL_RESULT.RESTORED
	) {
		if (paywallResult === PAYWALL_RESULT.PURCHASED) {
			showMessage({
				message: strings.Util_HandlePurchase_Alert_Subscription_Success,
				type: 'info',
			});

			if (!__DEV__) {
				Analytics().logEvent('user_subscribed_successfully');
			}
		} else if (paywallResult === PAYWALL_RESULT.RESTORED) {
			showMessage({
				message: strings.Util_HandlePurchase_Alert_Restore_Success,
				type: 'info',
			});
		}

		return true;
	}

	if (paywallResult === PAYWALL_RESULT.CANCELLED) {
		if (!__DEV__) {
			Analytics().logEvent('user_cancel_subscribe_process');
		}
	}

	return false;
}

export { handlePurchase };