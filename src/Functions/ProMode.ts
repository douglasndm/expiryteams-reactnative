import { Platform } from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import Analytics from '@react-native-firebase/analytics';
import EnvConfig from 'react-native-config';

import { isUserSignedIn } from './Auth';
import { getUserId } from './User';
import { setEnableProVersion } from './Settings';

Purchases.setDebugLogsEnabled(true);
Purchases.setup(EnvConfig.REVENUECAT_PUBLIC_APP_ID);

export async function isSubscriptionActive(): Promise<boolean> {
    const userSigned = await isUserSignedIn();

    if (!userSigned && Platform.OS !== 'ios') {
        throw new Error('User is not logged');
    }

    try {
        if (userSigned) {
            const localUserId = await getUserId();

            if (!localUserId) {
                throw new Error('User is not signed');
            }

            Purchases.identify(localUserId);
        }

        const purchaserInfo = await Purchases.getPurchaserInfo();

        if (typeof purchaserInfo.entitlements.active.pro !== 'undefined') {
            await setEnableProVersion(true);
            return true;
        }
        await setEnableProVersion(false);
        return false;
    } catch (e) {
        throw new Error(e);
    }
}

export async function getSubscriptionDetails(): Promise<
    Array<PurchasesPackage>
> {
    const userSigned = await isUserSignedIn();

    if (!userSigned && Platform.OS !== 'ios') {
        throw new Error('User is not logged');
    }

    try {
        if (userSigned) {
            const userId = await getUserId();
            await Purchases.identify(userId);
        }
        const offerings = await Purchases.getOfferings();

        const packages: Array<PurchasesPackage> = [];

        if (offerings.current && offerings.current.monthly !== null) {
            packages.push(offerings.current.monthly);
        }

        if (offerings.current && offerings.current.threeMonth !== null) {
            packages.push(offerings.current.threeMonth);
        }

        if (offerings.current && offerings.current.annual !== null) {
            packages.push(offerings.current.annual);
        }

        return packages;
    } catch (err) {
        throw new Error(err);
    }
}

export async function makeSubscription(
    purchasePackage: PurchasesPackage
): Promise<void> {
    if (!__DEV__) {
        await Analytics().logEvent('started_susbscription_process');
    }

    const userSigned = await isUserSignedIn();

    if (!userSigned && Platform.OS !== 'ios') {
        throw new Error('User is not logged');
    }

    try {
        if (userSigned) {
            const userId = await getUserId();

            await Purchases.identify(userId);
        }

        const {
            purchaserInfo,
            // productIdentifier,
        } = await Purchases.purchasePackage(purchasePackage);

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

export async function RestorePurchasers(): Promise<void> {
    try {
        const restore = await Purchases.restoreTransactions();
        // ... check restored purchaserInfo to see if entitlement is now active

        if (restore.activeSubscriptions.length > 0) {
            await setEnableProVersion(true);
        }

        console.log(restore);
    } catch (e) {
        throw new Error(e.message);
    }
}

// Chama a função para verificar se usuário tem inscrição ativa (como o arquivo é importado
// na home ele verifica e já marca nas configurações a resposta)
isSubscriptionActive()
    .then(() => console.log('Subscription checked'))
    .catch(() => console.log('User is not signed in'));
