// navigation.ts

import {
	CommonActions,
	NavigationContainerRef,
} from '@react-navigation/native';

type RootNavigationParamList = {
	[key: string]: undefined;
	// Defina as rotas disponíveis aqui
};

let navigatorRef: NavigationContainerRef<RootNavigationParamList>;

function setTopLevelNavigator(
	ref: NavigationContainerRef<RootNavigationParamList>
) {
	navigatorRef = ref;
}

function navigate(
	routeName: keyof RootNavigationParamList,
	params?: RootNavigationParamList[keyof RootNavigationParamList]
) {
	navigatorRef?.navigate(routeName, params);
}

function reset(
	routeName: keyof RootNavigationParamList,
	params?: RootNavigationParamList[keyof RootNavigationParamList]
) {
	navigatorRef?.dispatch(
		CommonActions.reset({
			index: 0,
			routes: [{ name: routeName, params }],
		})
	);
}
// Adicione outras funções de navegação conforme necessário

export default {
	navigate,
	reset,
	setTopLevelNavigator,
};
