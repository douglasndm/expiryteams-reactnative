import React, { useCallback, useContext, useMemo } from 'react';
import { View, Linking } from 'react-native';
import {
    DrawerContentOptions,
    DrawerContentScrollView,
} from '@react-navigation/drawer';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import UserInfo from './UserInfo';

import {
    Container,
    MenuItemContainer,
    MenuContent,
    MenuItemText,
    Icons,
    DrawerSection,
    LabelGroup,
    LabelContainer,
    Label,
} from './styles';

const DrawerMenu: React.FC<DrawerContentOptions> = (
    props: DrawerContentOptions
) => {
    const { navigation } = props;

    const { userPreferences } = useContext(PreferencesContext);

    const shouldShowMultiplesStores = useMemo(() => {
        if (!userPreferences.isUserPremium) {
            return true;
        }

        if (userPreferences.isUserPremium && userPreferences.multiplesStores) {
            return true;
        }

        return false;
    }, [userPreferences]);

    const navigateToAddProduct = useCallback(() => {
        navigation.navigate('AddProduct');
    }, [navigation]);

    const navigateToAllProducts = useCallback(() => {
        navigation.navigate('AllProducts');
    }, [navigation]);

    const navigateToAllProductsByStore = useCallback(() => {
        navigation.navigate('AllProductsByStore');
    }, [navigation]);

    const navigateToCategories = useCallback(() => {
        navigation.navigate('ListCategory');
    }, [navigation]);

    const navigateToPRO = useCallback(() => {
        navigation.navigate('Pro');
    }, [navigation]);

    const handleNavigateToSite = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev');
    }, []);

    return (
        <Container>
            <DrawerContentScrollView {...props}>
                <View>
                    <UserInfo
                        isUserPro={userPreferences.isUserPremium}
                        navigate={navigation.navigate}
                    />

                    <DrawerSection>
                        <MenuItemContainer
                            onPress={() => navigation.navigate('Home')}
                        >
                            <MenuContent>
                                <Icons name="home-outline" />
                                <MenuItemText>
                                    {translate('Menu_Button_GoToHome')}
                                </MenuItemText>
                            </MenuContent>
                        </MenuItemContainer>

                        <MenuItemContainer onPress={navigateToAddProduct}>
                            <MenuContent>
                                <Icons name="add" />
                                <MenuItemText>
                                    {translate('Menu_Button_GoToAddProduct')}
                                </MenuItemText>
                            </MenuContent>
                        </MenuItemContainer>

                        <MenuItemContainer onPress={navigateToAllProducts}>
                            <MenuContent>
                                <Icons name="apps-outline" />
                                <MenuItemText>
                                    {translate('Menu_Button_GoToAllProducts')}
                                </MenuItemText>
                            </MenuContent>
                        </MenuItemContainer>

                        {shouldShowMultiplesStores && (
                            <MenuItemContainer
                                onPress={
                                    userPreferences.isUserPremium
                                        ? navigateToAllProductsByStore
                                        : navigateToPRO
                                }
                            >
                                <MenuContent>
                                    <Icons name="list-outline" />
                                    <MenuItemText>
                                        {translate(
                                            'Menu_Button_GoToAllProductsByStore'
                                        )}
                                    </MenuItemText>
                                </MenuContent>

                                <LabelGroup>
                                    <LabelContainer>
                                        <Label>
                                            {translate('Menu_Label_PRO')}
                                        </Label>
                                    </LabelContainer>
                                </LabelGroup>
                            </MenuItemContainer>
                        )}

                        <MenuItemContainer
                            onPress={
                                userPreferences.isUserPremium
                                    ? navigateToCategories
                                    : navigateToPRO
                            }
                        >
                            <MenuContent>
                                <Icons name="file-tray-full-outline" />
                                <MenuItemText>
                                    {translate('Menu_Button_GoToCategories')}
                                </MenuItemText>
                            </MenuContent>

                            <LabelGroup>
                                <LabelContainer>
                                    <Label>{translate('Menu_Label_PRO')}</Label>
                                </LabelContainer>
                                <LabelContainer>
                                    <Label>
                                        {translate('Menu_Label_Beta')}
                                    </Label>
                                </LabelContainer>
                            </LabelGroup>
                        </MenuItemContainer>

                        {!userPreferences.isUserPremium && (
                            <MenuItemContainer
                                onPress={() => navigation.navigate('Pro')}
                            >
                                <MenuContent>
                                    <Icons name="analytics-outline" />
                                    <MenuItemText>
                                        {translate('Menu_Button_GoToProPage')}
                                    </MenuItemText>
                                </MenuContent>
                            </MenuItemContainer>
                        )}
                    </DrawerSection>
                </View>
            </DrawerContentScrollView>

            <DrawerSection>
                <MenuItemContainer
                    onPress={() => navigation.navigate('Settings')}
                >
                    <MenuContent>
                        <Icons name="settings-outline" />
                        <MenuItemText>
                            {translate('Menu_Button_GoToSettings')}
                        </MenuItemText>
                    </MenuContent>
                </MenuItemContainer>

                <MenuItemContainer onPress={handleNavigateToSite}>
                    <MenuContent>
                        <Icons name="globe-outline" />
                        <MenuItemText>
                            {translate('Menu_Button_KnowOthersApps')}
                        </MenuItemText>
                    </MenuContent>
                </MenuItemContainer>

                <MenuItemContainer onPress={() => navigation.navigate('About')}>
                    <MenuContent>
                        <Icons name="help-circle-outline" />
                        <MenuItemText>
                            {translate('Menu_Button_GoToAbout')}
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
                                {translate('Menu_Button_GoToTest')}
                            </MenuItemText>
                        </MenuContent>
                    </MenuItemContainer>
                )}
            </DrawerSection>
        </Container>
    );
};

export default DrawerMenu;
