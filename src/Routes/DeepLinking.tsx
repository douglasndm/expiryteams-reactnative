import React, { useEffect, useCallback } from 'react';
import { View } from 'react-native';
import dynamicLinks, {
    FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';

const Routes: React.FC = () => {
    const handleDynamicLink = useCallback(
        (link: FirebaseDynamicLinksTypes.DynamicLink) => {
            console.log('link from foreground');
            console.log(link);
            // Handle dynamic link inside your own application
            if (link.url === 'https://invertase.io/offer') {
                // ...navigate to your offers screen
            }
        },
        []
    );

    useEffect(() => {
        dynamicLinks()
            .getInitialLink()
            .then(link => {
                if (link) {
                    console.log('link from background');
                    console.log(link);
                    if (link.url && link.url === 'https://invertase.io/offer') {
                        // ...set initial route as offers screen
                    }
                }
            });
    }, []);

    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

        // When the component is unmounted, remove the listener
        return () => unsubscribe();
    }, []);

    // import { Container } from './styles';
    return <View />;
};

export default Routes;
