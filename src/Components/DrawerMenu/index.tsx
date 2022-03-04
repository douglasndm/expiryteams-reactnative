import React, { useCallback } from 'react';
import { DrawerContentOptions } from '@react-navigation/drawer';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import UserInfo from './UserInfo';

import {
    Container,
    MainMenuContainer,
    MenuItemContainer,
    MenuContent,
    MenuItemText,
    Icons,
    DrawerSection,
} from './styles';

const DrawerMenu: React.FC<DrawerContentOptions> = (
    props: DrawerContentOptions
) => {
    const { navigation } = props;

    const teamContext = useTeam();

    const navigateToAddProduct = useCallback(() => {
        navigation.navigate('AddProduct');
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

    return (
        <Container>
            <MainMenuContainer>
                <UserInfo navigate={navigation.navigate} />

                <DrawerSection>
                    <MenuItemContainer
                        onPress={() => navigation.navigate('Home')}
                    >
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
                            <MenuItemText>Marcas</MenuItemText>
                        </MenuContent>
                    </MenuItemContainer>

                    {teamContext.roleInTeam?.role.toLowerCase() ===
                        'manager' && (
                        <MenuItemContainer onPress={navigateToStores}>
                            <MenuContent>
                                <Icons name="list-outline" />
                                <MenuItemText>Lojas</MenuItemText>
                            </MenuContent>
                        </MenuItemContainer>
                    )}

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
                                <MenuItemText>{teamContext.name}</MenuItemText>
                            </MenuContent>
                        </MenuItemContainer>
                    )}
                </DrawerSection>
            </MainMenuContainer>

            <DrawerSection>
                <MenuItemContainer
                    onPress={() => navigation.navigate('Settings')}
                >
                    <MenuContent>
                        <Icons name="settings-outline" />
                        <MenuItemText>
                            {strings.Menu_Button_GoToSettings}
                        </MenuItemText>
                    </MenuContent>
                </MenuItemContainer>

                <MenuItemContainer onPress={() => navigation.navigate('About')}>
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
    );
};

export default DrawerMenu;
