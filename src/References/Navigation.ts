import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createRef<NavigationContainerRef<RoutesParams>>();

interface NavigateProps {
	routeName: string;
	params?: any;
}

export function navigate({ routeName, params }: NavigateProps): void {
	navigationRef.current?.navigate({
		screen: routeName,
		params,
	});
}

interface ResetProps {
	routesNames: string[];
}

export function reset({ routesNames }: ResetProps): void {
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
		routes,
	});
}
