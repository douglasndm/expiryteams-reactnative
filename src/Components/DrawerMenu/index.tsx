import React, { useCallback, useMemo } from 'react';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import {
	Container,
	MainMenuContainer,
	MenuItemContainer,
	MenuContent,
	MenuItemText,
	Icons,
	DrawerSection,
	PageContainer,
} from '@components/Menu/Drawer/styles';

import UserInfo from './UserInfo';

const DrawerMenu: React.FC<DrawerContentComponentProps> = (
	props: DrawerContentComponentProps
) => {
	const { navigation } = props;

	const teamContext = useTeam();

	const isManager = useMemo(() => {
		if (teamContext.roleInTeam)
			if (teamContext.roleInTeam.role.toLowerCase() === 'manager') {
				return true;
			}
		return false;
	}, [teamContext]);

	const navigateToHome = useCallback(() => {
		navigation.navigate('Home', {});
	}, [navigation]);

	const navigateToAddProduct = useCallback(() => {
		navigation.navigate('AddProduct', {});
	}, [navigation]);

	const navigateToCategories = useCallback(() => {
		navigation.navigate('ListCategory');
	}, [navigation]);

	const navigateToBrands = useCallback(() => {
		navigation.navigate('BrandList');
	}, [navigation]);

	const navigateToStores = useCallback(() => {
		navigation.navigate('StoreList');
	}, [navigation]);

	const navigateToExport = useCallback(() => {
		navigation.navigate('Export');
	}, [navigation]);

	const handleNavigateToTeam = useCallback(() => {
		navigation.navigate('ViewTeam');
	}, [navigation]);

	const handleNavigateToTeamLogs = useCallback(() => {
		navigation.navigate('TeamLogs');
	}, [navigation]);

	const handleNavigateToSettings = useCallback(() => {
		navigation.navigate('Settings');
	}, [navigation]);
	const handleNavigateToAbout = useCallback(() => {
		navigation.navigate('About');
	}, [navigation]);

	return (
		<PageContainer>
			<Container>
				<MainMenuContainer>
					<UserInfo navigate={navigation.navigate} />

					<DrawerSection>
						<MenuItemContainer onPress={navigateToHome}>
							<MenuContent>
								<Icons name="home-outline" />
								<MenuItemText>
									{strings.Menu_Button_GoToHome}
								</MenuItemText>
							</MenuContent>
						</MenuItemContainer>

						<MenuItemContainer onPress={navigateToAddProduct}>
							<MenuContent>
								<Icons name="add" />
								<MenuItemText>
									{strings.Menu_Button_GoToAddProduct}
								</MenuItemText>
							</MenuContent>
						</MenuItemContainer>

						<MenuItemContainer onPress={navigateToCategories}>
							<MenuContent>
								<Icons name="file-tray-full-outline" />
								<MenuItemText>
									{strings.Menu_Button_GoToCategories}
								</MenuItemText>
							</MenuContent>
						</MenuItemContainer>

						<MenuItemContainer onPress={navigateToBrands}>
							<MenuContent>
								<Icons name="ribbon-outline" />
								<MenuItemText>
									{strings.Menu_Button_GoToBrands}
								</MenuItemText>
							</MenuContent>
						</MenuItemContainer>

						<MenuItemContainer onPress={navigateToStores}>
							<MenuContent>
								<Icons name="list-outline" />
								<MenuItemText>
									{strings.Menu_Button_GoToStores}
								</MenuItemText>
							</MenuContent>
						</MenuItemContainer>

						<MenuItemContainer onPress={navigateToExport}>
							<MenuContent>
								<Icons name="download-outline" />
								<MenuItemText>
									{strings.Menu_Button_GoToExport}
								</MenuItemText>
							</MenuContent>
						</MenuItemContainer>

						{!!teamContext.id && (
							<MenuItemContainer onPress={handleNavigateToTeam}>
								<MenuContent>
									<Icons name="briefcase-outline" />
									<MenuItemText>
										{teamContext.name}
									</MenuItemText>
								</MenuContent>
							</MenuItemContainer>
						)}

						{isManager && (
							<MenuItemContainer
								onPress={handleNavigateToTeamLogs}
							>
								<MenuContent>
									<Icons name="book-outline" />
									<MenuItemText>
										{strings.Menu_Button_GoToLogs}
									</MenuItemText>
								</MenuContent>
							</MenuItemContainer>
						)}
					</DrawerSection>
				</MainMenuContainer>

				<DrawerSection>
					<MenuItemContainer onPress={handleNavigateToSettings}>
						<MenuContent>
							<Icons name="settings-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToSettings}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer onPress={handleNavigateToAbout}>
						<MenuContent>
							<Icons name="help-circle-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToAbout}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					{__DEV__ && (
						<MenuItemContainer
							onPress={() => navigation.navigate('Test')}
						>
							<MenuContent>
								<Icons name="bug-outline" />
								<MenuItemText>
									{strings.Menu_Button_GoToTest}
								</MenuItemText>
							</MenuContent>
						</MenuItemContainer>
					)}
				</DrawerSection>
			</Container>
		</PageContainer>
	);
};

export default DrawerMenu;
