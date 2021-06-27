import React, { useCallback } from 'react';
import { PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import strings from '~/Locales';

import BackButton from '../BackButton';
import StatusBar from '../StatusBar';

import {
    HeaderContainerNoDrawner,
    HeaderContainer,
    TextLogo,
    MenuIcon,
    MenuButton,
} from './styles';

interface RequestProps {
    title?: string;
    noDrawer?: boolean;
}

const Header: React.FC<RequestProps> = ({ title, noDrawer }: RequestProps) => {
    const navigation = useNavigation();

    const titleFontSize = PixelRatio.get() < 1.5 ? 19 : 26;

    const handleOpenMenu = useCallback(() => {
        navigation.toggleDrawer();
    }, [navigation]);

    const handleGoBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }, [navigation]);

    return noDrawer ? (
        <HeaderContainerNoDrawner>
            <BackButton handleOnPress={handleGoBack} />

            <TextLogo noDrawer={noDrawer}>{title}</TextLogo>
        </HeaderContainerNoDrawner>
    ) : (
        <>
            <StatusBar forceWhiteTextIOS />

            <HeaderContainer>
                <MenuButton onPress={handleOpenMenu}>
                    <MenuIcon />
                </MenuButton>

                {title ? (
                    <TextLogo style={{ fontSize: titleFontSize }}>
                        {title}
                    </TextLogo>
                ) : (
                    <TextLogo style={{ fontSize: titleFontSize }}>
                        {strings.AppName}
                    </TextLogo>
                )}
            </HeaderContainer>
        </>
    );
};

export default Header;
