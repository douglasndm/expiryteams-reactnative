import auth from '@react-native-firebase/auth';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import EnvConfig from 'react-native-config';

import api from '~/Services/API';

Purchases.setDebugLogsEnabled(true);
Purchases.setup(EnvConfig.REVENUECAT_PUBLIC_APP_ID);

export async function getOfferings(): Promise<PurchasesPackage[]> {
    try {
        const offerings = await Purchases.getOfferings();

        if (
            offerings.current !== null &&
            offerings.current.availablePackages.length !== 0
        ) {
            return offerings.current.availablePackages;
        }
        return [];
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function makePurchase(
    purchasePackage: PurchasesPackage
): Promise<void> {
    try {
        const {
            purchaserInfo,
            // productIdentifier,
        } = await Purchases.purchasePackage(purchasePackage);

        // Verificar com o servidor se a compra foi concluida
        // Liberar funções no app
    } catch (err) {
        if (!err.userCancelled) {
            throw new Error(err);
        }
    }
}

interface getTeamSubscriptionsProps {
    team_id: string;
}

export async function getTeamSubscriptions({
    team_id,
}: getTeamSubscriptionsProps): Promise<Array<ITeamSubscription>> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        const response = await api.get<Array<ITeamSubscription>>(
            `/team/${team_id}/subscriptions`,
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
}
