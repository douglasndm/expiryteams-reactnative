import Purchases, { UpgradeInfo } from 'react-native-purchases';
import EnvConfig from 'react-native-config';
import { compareAsc, parseISO } from 'date-fns';

import api from '~/Services/API';
import { getSelectedTeam } from './SelectedTeam';

async function setup() {
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup(EnvConfig.REVENUECAT_PUBLIC_APP_ID);

    const selectedTeam = await getSelectedTeam();

    if (selectedTeam) {
        await Purchases.logIn(selectedTeam.team.id);
    }
}

export async function getOfferings(): Promise<Array<CatPackage>> {
    const packages: Array<CatPackage> = [];

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
    }
    return packages;
}

export async function makePurchase({
    pack,
    team_id,
}: makePurchaseProps): Promise<ITeamSubscription | null> {
    try {
        await Purchases.logIn(team_id);

        const prevPurchases = await Purchases.getPurchaserInfo();

        const upgrade: UpgradeInfo | null =
            prevPurchases.activeSubscriptions.length > 0
                ? {
                      oldSKU: prevPurchases.activeSubscriptions[0],
                  }
                : null;

        const {
            purchaserInfo,
            // productIdentifier,
        } = await Purchases.purchasePackage(pack, upgrade);

        // Verificar com o servidor se a compra foi concluida
        // Liberar funções no app
        const apiCheck = await api.get<ITeamSubscription>(
            `/team/${team_id}/subscriptions/check`
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
        if (!err.userCancelled) {
            throw new Error(err.message);
        }
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
