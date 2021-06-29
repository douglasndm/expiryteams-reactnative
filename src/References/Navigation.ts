import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createRef<NavigationContainerRef>();

interface NavigateProps {
    routeHandler?: 'Routes' | 'Auth';
    routeName: string;
    params?: any;
}

export function navigate({
    routeHandler = 'Routes',
    routeName,
    params,
}: NavigateProps): void {
    navigationRef.current?.navigate(routeHandler, {
        screen: routeName,
        params,
    });
}

export function reset({
    routeHandler = 'Routes',
    routeName,
}: NavigateProps): void {
    navigationRef.current?.reset({
        routes: [
            {
                name: routeHandler,
                state: {
                    routes: [
                        {
                            name: routeName,
                        },
                    ],
                },
            },
        ],
    });
}
