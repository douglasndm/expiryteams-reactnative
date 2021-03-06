import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions = {
    prefixes: ['expiryteams://'],
    config: {
        screens: {
            Routes: {
                screens: {
                    About: 'about',
                    ProductDetails: 'product/:id',
                },
            },
        },
    },
};

export default linking;
