import React, { useCallback, useContext } from 'react';
import { View, Linking } from 'react-native';
import {
    DrawerContentOptions,
    DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useTheme } from 'styled-components';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import UserInfo from './UserInfo';

import {
    Container,
    MenuItemContainer,
    MenuItem,
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
    const theme = useTheme();

    const { userPreferences } = useContext(PreferencesContext);

    const navigteToCategories = useCallback(() => {
        navigation.navigate('ListCategory');
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
                        <MenuItem
                            icon={() => <Icons name="home-outline" size={22} />}
                            label={translate('Menu_Button_GoToHome')}
                            onPress={() => navigation.navigate('Home')}
                        />
                        <MenuItem
                            icon={() => (
                                <Icons
                                    name="add"
                                    color={theme.colors.text}
                                    size={22}
                                />
                            )}
                            label={translate('Menu_Button_GoToAddProduct')}
                            onPress={() => navigation.navigate('AddProduct')}
                        />
                        <MenuItem
                            icon={() => <Icons name="apps-outline" size={22} />}
                            label={translate('Menu_Button_GoToAllProducts')}
                            onPress={() => navigation.navigate('AllProducts')}
                        />

                        {userPreferences.multiplesStores && (
                            <MenuItem
                                icon={() => (
                                    <Icons name="list-outline" size={22} />
                                )}
                                label={translate(
                                    'Menu_Button_GoToAllProductsByStore'
                                )}
                                onPress={() =>
                                    navigation.navigate('AllProductsByStore')
                                }
                            />
                        )}

                        <MenuItemContainer onPress={navigteToCategories}>
                            <Icons name="filter-outline" />
                            <MenuItemText>
                                {translate('Menu_Button_GoToCategories')}
                            </MenuItemText>

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
                            <MenuItem
                                icon={() => (
                                    <Icons name="analytics-outline" size={22} />
                                )}
                                label={translate('Menu_Button_GoToProPage')}
                                onPress={() => {
                                    navigation.navigate('Pro');
                                }}
                            />
                        )}
                    </DrawerSection>
                </View>
            </DrawerContentScrollView>

            <DrawerSection>
                <MenuItem
                    icon={() => <Icons name="settings-outline" size={22} />}
                    label={translate('Menu_Button_GoToSettings')}
                    onPress={() => navigation.navigate('Settings')}
                />
                <MenuItem
                    icon={() => <Icons name="globe-outline" size={22} />}
                    label={translate('Menu_Button_KnowOthersApps')}
                    onPress={handleNavigateToSite}
                />
                <MenuItem
                    icon={() => <Icons name="help-circle-outline" size={22} />}
                    label={translate('Menu_Button_GoToAbout')}
                    onPress={() => navigation.navigate('About')}
                />

                {__DEV__ && (
                    <MenuItem
                        icon={() => <Icons name="bug-outline" size={22} />}
                        label={translate('Menu_Button_GoToTest')}
                        onPress={() => navigation.navigate('Test')}
                    />
                )}
            </DrawerSection>
        </Container>
    );
};

export default DrawerMenu;
