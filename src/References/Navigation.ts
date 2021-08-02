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

interface ResetProps {
    routeHandler?: 'Routes' | 'Auth';
    routesNames: string[];
}

export function reset({
    routeHandler = 'Routes',
    routesNames,
}: ResetProps): void {
    interface Props {
        name: string;
    }

    const routes: Array<Props> = [];

    routesNames.forEach(route => {
        routes.push({
            name: route,
        });
    });

    navigationRef.current?.reset({
        routes: [
            {
                name: routeHandler,
                state: {
                    routes,
                },
            },
        ],
    });
}
