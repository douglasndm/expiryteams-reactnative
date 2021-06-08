import auth from '@react-native-firebase/auth';
import Purchases, {
    PurchasesPackage,
    UpgradeInfo,
} from 'react-native-purchases';
import EnvConfig from 'react-native-config';
import { compareAsc, parseISO } from 'date-fns';

import api from '~/Services/API';

async function setup() {
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup(EnvConfig.REVENUECAT_PUBLIC_APP_ID);

    const user = auth().currentUser;

    if (user) {
        await Purchases.identify(user.uid);
    }
}

export interface CatPackage {
    type: '1 person' | '3 people' | '5 people' | '10 people' | '15 people';
    package: PurchasesPackage;
}

export async function getOfferings(): Promise<Array<CatPackage>> {
    const packages: Array<CatPackage> = [];

    try {
        const offerings = await Purchases.getOfferings();

        if (!offerings.current) {
            return [];
        }

        if (offerings.current.availablePackages.length !== 0) {
            if (!!offerings.all.TeamWith1 && offerings.all.TeamWith1.monthly) {
                packages.push({
                    type: '1 person',
                    package: offerings.all.TeamWith1.monthly,
                });
            }
            if (!!offerings.all.TeamWith3 && offerings.all.TeamWith3.monthly) {
                packages.push({
                    type: '3 people',
                    package: offerings.all.TeamWith3.monthly,
                });
            }
            if (!!offerings.all.TeamWith5 && offerings.all.TeamWith5.monthly) {
                packages.push({
                    type: '5 people',
                    package: offerings.all.TeamWith5.monthly,
                });
            }
            if (
                !!offerings.all.TeamWith10 &&
                offerings.all.TeamWith10.monthly
            ) {
                packages.push({
                    type: '10 people',
                    package: offerings.all.TeamWith10.monthly,
                });
            }
            if (
                !!offerings.all.TeamWith15 &&
                offerings.all.TeamWith15.monthly
            ) {
                packages.push({
                    type: '15 people',
                    package: offerings.all.TeamWith15.monthly,
                });
            }
        }
        return packages;
    } catch (err) {
        throw new Error(err.message);
    }
}

interface makePurchaseProps {
    pack: PurchasesPackage;
    team_id: string;
    old_sku?: string;
}

export async function makePurchase({
    pack,
    team_id,
    old_sku,
}: makePurchaseProps): Promise<ITeamSubscription | null> {
    try {
        if (!team_id) {
            throw new Error('Provider team id');
        }

        const upgrade: UpgradeInfo | null = old_sku
            ? {
                  oldSKU: old_sku,
              }
            : null;

        await Purchases.identify(team_id);
        const {
            purchaserInfo,
            // productIdentifier,
        } = await Purchases.purchasePackage(pack, upgrade);

        const { currentUser } = auth();
        const token = await currentUser?.getIdTokenResult();

        // Verificar com o servidor se a compra foi concluida
        // Liberar funções no app
        const apiCheck = await api.get<ITeamSubscription>(
            `/team/${team_id}/subscriptions/check`,
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        if (!apiCheck.data) {
            return null;
        }

        const sub = apiCheck.data;

        // Verifica se a primeira assinatura retornada da API já venceu
        // O esperado é que a primeira assinatura retornada
        // seja a mais recente, no caso a que acabou de realizar
        if (compareAsc(new Date(), parseISO(String(sub.expireIn))) === 1) {
            return null;
        }

        return sub;
    } catch (err) {
        if (err.userCancelled) {
            return null;
        }
        throw new Error(err.message);
    }
}

interface getTeamSubscriptionsProps {
    team_id: string;
}

export async function getTeamSubscriptions({
    team_id,
}: getTeamSubscriptionsProps): Promise<ITeamSubscription> {
    try {
        const { currentUser } = auth();

        const token = await currentUser?.getIdTokenResult();

        const response = await api.get<ITeamSubscription>(
            `/team/${team_id}/subscriptions`,
            {
                headers: {
                    Authorization: `Bearer ${token?.token}`,
                },
            }
        );

        return response.data;
    } catch (err) {
        if (err.response.data.error) {
            throw new Error(err.response.data.error);
        }
        throw new Error(err.message);
    }
}

setup();
