import Purchases, { PurchasesOfferings } from 'react-native-purchases';
import EnvConfig from 'react-native-config';

Purchases.setDebugLogsEnabled(true);
Purchases.setup(EnvConfig.REVENUECAT_PUBLIC_APP_ID);

export async function getOfferings(): Promise<PurchasesOfferings | null> {
    try {
        const offerings = await Purchases.getOfferings();

        console.log(offerings);
        if (
            offerings.current !== null &&
            offerings.current.availablePackages.length !== 0
        ) {
            return offerings;
        }
        return null;
    } catch (err) {
        throw new Error(err.message);
    }
}
