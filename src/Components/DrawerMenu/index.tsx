import React, { useCallback } from 'react';
import { View, Linking } from 'react-native';
import {
    DrawerContentOptions,
    DrawerContentScrollView,
} from '@react-navigation/drawer';

import { translate } from '~/Locales';

import {
    Container,
    LogoContainer,
    Logo,
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

    const navigateToAddProduct = useCallback(() => {
        navigation.navigate('AddProduct');
    }, [navigation]);

    const navigateToAllProducts = useCallback(() => {
        navigation.navigate('AllProducts');
    }, [navigation]);

    const navigateToCategories = useCallback(() => {
        navigation.navigate('ListCategory');
    }, [navigation]);

    const navigateToAllProductsByStore = useCallback(() => {
        navigation.navigate('TeamList');
    }, [navigation]);

    const navigateToExport = useCallback(() => {
        navigation.navigate('Export');
    }, [navigation]);

    const handleNavigateToSite = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev');
    }, []);

    return (
        <Container>
            <DrawerContentScrollView {...props}>
                <View>
                    <LogoContainer>
                        <Logo />
                    </LogoContainer>
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

                        <MenuItemContainer onPress={navigateToCategories}>
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
                            </LabelGroup>
                        </MenuItemContainer>

                        <MenuItemContainer
                            onPress={navigateToAllProductsByStore}
                        >
                            <MenuContent>
                                <Icons name="list-outline" />
                                <MenuItemText>
                                    {translate('Menu_Button_GoToTeamSelect')}
                                </MenuItemText>
                            </MenuContent>

                            <LabelGroup>
                                <LabelContainer>
                                    <Label>{translate('Menu_Label_PRO')}</Label>
                                </LabelContainer>
                            </LabelGroup>
                        </MenuItemContainer>

                        <MenuItemContainer onPress={navigateToExport}>
                            <MenuContent>
                                <Icons name="download-outline" />
                                <MenuItemText>
                                    {translate('Menu_Button_GoToExport')}
                                </MenuItemText>
                            </MenuContent>

                            <LabelGroup>
                                <LabelContainer>
                                    <Label>{translate('Menu_Label_PRO')}</Label>
                                </LabelContainer>
                            </LabelGroup>
                        </MenuItemContainer>
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
