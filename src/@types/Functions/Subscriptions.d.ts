import { PurchasesPackage } from 'react-native-purchases';

interface CatPackage {
    type:
        | '1 person'
        | '2 people'
        | '3 people'
        | '5 people'
        | '10 people'
        | '15 people';
    package: PurchasesPackage;
}

interface makePurchaseProps {
    pack: PurchasesPackage;
    team_id: string;
}

interface getTeamSubscriptionsProps {
    team_id: string;
}
