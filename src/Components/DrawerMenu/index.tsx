import React, { useContext } from 'react';
import { View } from 'react-native';
import {
    DrawerContentOptions,
    DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useTheme } from 'styled-components';

import { translate } from '../../Locales';

import PreferencesContext from '../../Contexts/PreferencesContext';

import UserInfo from './UserInfo';

import Logo from '../../Assets/Logo.png';

import {
    Container,
    MenuHeader,
    LogoImage,
    MenuItem,
    Icons,
    DrawerSection,
} from './styles';

const DrawerMenu: React.FC<DrawerContentOptions> = (
    props: DrawerContentOptions
) => {
    const { navigation } = props;
    const theme = useTheme();

    const { userPreferences } = useContext(PreferencesContext);

    return (
        <Container>
            <DrawerContentScrollView {...props}>
                <View>
                    {userPreferences.isUserSignedIn ? (
                        <UserInfo isUserPro={userPreferences.isUserPremium} />
                    ) : (
                        <MenuHeader>
                            <LogoImage resizeMode="center" source={Logo} />
                        </MenuHeader>
                    )}

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

                        {!userPreferences.isUserPremium && (
                            <MenuItem
                                icon={() => (
                                    <Icons name="analytics-outline" size={22} />
                                )}
                                label={translate('Menu_Button_GoToProPage')}
                                onPress={() => {
                                    navigation.navigate('PremiumSubscription');
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
