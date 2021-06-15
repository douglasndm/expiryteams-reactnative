import React, { useCallback, useContext } from 'react';
import { View, Linking } from 'react-native';
import {
    DrawerContentOptions,
    DrawerContentScrollView,
} from '@react-navigation/drawer';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import UserInfo from './UserInfo';

import {
    Container,
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

    const { preferences } = useContext(PreferencesContext);

    const navigateToAddProduct = useCallback(() => {
        navigation.navigate('AddProduct');
    }, [navigation]);

    const navigateToCategories = useCallback(() => {
        navigation.navigate('ListCategory');
    }, [navigation]);

    const navigateToTeamList = useCallback(() => {
        navigation.navigate('TeamList');
    }, [navigation]);

    const navigateToExport = useCallback(() => {
        navigation.navigate('Export');
    }, [navigation]);

    const handleNavigateToTeam = useCallback(() => {
        navigation.navigate('ViewTeam');
    }, [navigation]);

    const handleNavigateToSite = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev');
    }, []);

    return (
        <Container>
            <DrawerContentScrollView {...props}>
                <View>
                    <UserInfo />

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

                        <MenuItemContainer onPress={navigateToExport}>
                            <MenuContent>
                                <Icons name="download-outline" />
                                <MenuItemText>
                                    {strings.Menu_Button_GoToExport}
                                </MenuItemText>
                            </MenuContent>
                        </MenuItemContainer>

                        {!!preferences.selectedTeam && (
                            <MenuItemContainer onPress={handleNavigateToTeam}>
                                <MenuContent>
                                    <Icons name="briefcase-outline" />
                                    <MenuItemText>
                                        {preferences.selectedTeam.team.name}
                                    </MenuItemText>
                                </MenuContent>
                            </MenuItemContainer>
                        )}
                    </DrawerSection>
                </View>
            </DrawerContentScrollView>

            <DrawerSection>
                <MenuItemContainer onPress={navigateToTeamList}>
                    <MenuContent>
                        <Icons name="list-outline" />
                        <MenuItemText>
                            {strings.Menu_Button_GoToTeamSelect}
                        </MenuItemText>
                    </MenuContent>
                </MenuItemContainer>

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

                <MenuItemContainer onPress={handleNavigateToSite}>
                    <MenuContent>
                        <Icons name="globe-outline" />
                        <MenuItemText>
                            {strings.Menu_Button_KnowOthersApps}
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
