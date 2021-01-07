import Purchases, { PurchasesPackage } from 'react-native-purchases';
import Analytics from '@react-native-firebase/analytics';
import EnvConfig from 'react-native-config';

import { isUserSignedIn } from './Auth/Google';
import { getUserId } from './User';
import { setEnableProVersion } from './Settings';

Purchases.setDebugLogsEnabled(true);
Purchases.setup(EnvConfig.REVENUECAT_PUBLIC_APP_ID);

export async function isSubscriptionActive(): Promise<boolean> {
    const userSigned = await isUserSignedIn();

    if (!userSigned) {
        return false;
    }

    try {
        const localUserId = await getUserId();

        if (!localUserId) {
            throw new Error('User is not signed');
        }

        const purchaserInfo = await Purchases.identify(localUserId);
        // access latest purchaserInfo

        if (purchaserInfo.activeSubscriptions.length > 0) {
            await setEnableProVersion(true);
            return true;
        }
        await setEnableProVersion(false);
        return false;
    } catch (e) {
        throw new Error(e);
    }
}

export async function getSubscriptionDetails(): Promise<PurchasesPackage> {
    const userSigned = await isUserSignedIn();

    if (!userSigned) {
        throw new Error('User is not logged');
    }

    try {
        const userId = await getUserId();
        await Purchases.identify(userId);

        const offerings = await Purchases.getOfferings();

        if (offerings.current && offerings.current.monthly !== null) {
            await Analytics().logEvent('user_get_offerings_monthly');

            return offerings.current.monthly;
        }

        if (offerings.current && offerings.current.threeMonth !== null) {
            await Analytics().logEvent('user_get_offerings_three_month');

            return offerings.current.threeMonth;
        }

        await Analytics().logEvent('app_didnt_show_any_offerings');
        throw new Error('We didt find any offers');
    } catch (err) {
        throw new Error(err);
    }
}

export async function makeSubscription(): Promise<void> {
    await Analytics().logEvent('started_susbscription_process');

    const userSigned = await isUserSignedIn();

    if (!userSigned) {
        await Analytics().logEvent(
            'started_susbscription_process_but_user_not_signed'
        );

        throw new Error('User is not logged');
    }

    try {
        const userId = await getUserId();

        await Purchases.identify(userId);

        const offerings = await getSubscriptionDetails();

        const {
            purchaserInfo,
            // productIdentifier,
        } = await Purchases.purchasePackage(offerings);

        // console.log(productIdentifier);
        // console.log(purchaserInfo);
        if (typeof purchaserInfo.entitlements.active.pro !== 'undefined') {
            await Analytics().logEvent('user_subscribed_successfully');

            await setEnableProVersion(true);
        }
    } catch (e) {
        if (e.userCancelled) {
            await Analytics().logEvent('user_cancel_subscribe_process');
            throw new Error('User cancel payment');
        }
        if (!e.userCancelled) {
            await Analytics().logEvent('error_in_subscribe_process');
            throw new Error(e);
        }
    }
}

// Chama a função para verificar se usuário tem inscrição ativa (como o arquivo é importado
// na home ele verifica e já marca nas configurações a resposta)
isSubscriptionActive()
    .then(() => console.log('Subscription checked'))
    .catch(() => console.log('User is not signed in'));
