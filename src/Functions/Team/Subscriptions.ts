import Purchases, { UpgradeInfo } from 'react-native-purchases';
import Auth from '@react-native-firebase/auth';
import EnvConfig from 'react-native-config';

import api from '~/Services/API';

import { getSelectedTeam } from './SelectedTeam';

import { CatPackage } from '~/@types/Functions/Subscriptions';

async function setup() {
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup(EnvConfig.REVENUECAT_PUBLIC_APP_ID);

    const selectedTeam = await getSelectedTeam();

    if (selectedTeam) {
        await Purchases.logIn(selectedTeam.userRole.team.id);
    }
}

export async function getOfferings(): Promise<Array<CatPackage>> {
    const packages: Array<CatPackage> = [];

    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
        return [];
    }

    if (offerings.current.availablePackages.length !== 0) {
        /*
        if (!!offerings.all.TeamWith1 && offerings.all.TeamWith1.monthly) {
            packages.push({
                type: '1 person',
                package: offerings.all.TeamWith1.monthly,
            });
        }
        */
        if (!!offerings.all.TeamWith2 && offerings.all.TeamWith2.monthly) {
            packages.push({
                type: '2 people',
                package: offerings.all.TeamWith2.monthly,
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
        if (!!offerings.all.TeamWith10 && offerings.all.TeamWith10.monthly) {
            packages.push({
                type: '10 people',
                package: offerings.all.TeamWith10.monthly,
            });
        }
        if (!!offerings.all.TeamWith15 && offerings.all.TeamWith15.monthly) {
            packages.push({
                type: '15 people',
                package: offerings.all.TeamWith15.monthly,
            });
        }
        if (!!offerings.all.TeamWith30 && offerings.all.TeamWith30.monthly) {
            packages.push({
                type: '30 people',
                package: offerings.all.TeamWith30.monthly,
            });
        }
        if (!!offerings.all.TeamWith45 && offerings.all.TeamWith45.monthly) {
            packages.push({
                type: '45 people',
                package: offerings.all.TeamWith45.monthly,
            });
        }
        if (!!offerings.all.TeamWith60 && offerings.all.TeamWith60.monthly) {
            packages.push({
                type: '60 people',
                package: offerings.all.TeamWith60.monthly,
            });
        }
    }
    return packages;
}

export async function makePurchase({
    pack,
    team_id,
}: makePurchaseProps): Promise<ITeamSubscription> {
    try {
        const { currentUser } = Auth();

        if (currentUser && currentUser.uid) {
            await Purchases.logIn(currentUser.uid);
        } else {
            await Purchases.logIn(team_id);
        }

        Purchases.setAttributes({
            team_id,
        });

        const prevPurchases = await Purchases.getPurchaserInfo();

        const upgrade: UpgradeInfo | null =
            prevPurchases.activeSubscriptions.length > 0
                ? {
                      oldSKU: prevPurchases.activeSubscriptions[0],
                  }
                : null;

        await Purchases.purchasePackage(pack, upgrade);

        // Verificar com o servidor se a compra foi concluida
        // Liberar funções no app
        const response = await api.get<ITeamSubscription>(
            `/team/${team_id}/subscriptions`
        );

        return response.data;
    } catch (err) {
        if (!err.userCancelled) {
            throw new Error(err.message);
        } else throw new Error(err.message);
    }
}

export async function getTeamSubscriptions({
    team_id,
}: getTeamSubscriptionsProps): Promise<ITeamSubscription | null> {
    const response = await api.get<ITeamSubscription>(
        `/team/${team_id}/subscriptions`
    );

    if (response.data) return response.data;

    return null;
}

export async function getAllSubscriptionsFromRevenue({
    team_id,
}: getTeamSubscriptionsProps): Promise<Subscription[]> {
    const response = await api.get<Subscription[]>(
        `/team/${team_id}/subscriptions/recheck`
    );

    return response.data;
}

setup();
