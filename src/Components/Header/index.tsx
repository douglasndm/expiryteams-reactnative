import React, { useCallback } from 'react';
import { PixelRatio, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

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
    listRef?: React.RefObject<FlatList<IProduct>>;
}

const Header: React.FC<RequestProps> = ({
    title,
    noDrawer,
    listRef,
}: RequestProps) => {
    const navigation = useNavigation<DrawerNavigationProp<RoutesParams>>();

    const titleFontSize = PixelRatio.get() < 1.5 ? 19 : 26;

    const handleOpenMenu = useCallback(() => {
        navigation.toggleDrawer();
    }, [navigation]);

    const handleGoBack = useCallback(() => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
    }, [navigation]);

    let lastPress = 0;

    const onDoublePress = useCallback(() => {
        const time = new Date().getTime();
        const delta = time - lastPress;

        const DOUBLE_PRESS_DELAY = 400;
        if (delta < DOUBLE_PRESS_DELAY) {
            // Success double press

            if (listRef && listRef.current) {
                listRef.current.scrollToIndex({
                    animated: true,
                    index: 0,
                });
            }
        }
        lastPress = time;
    }, []);

    return noDrawer ? (
        <HeaderContainerNoDrawner>
            <BackButton handleOnPress={handleGoBack} />

            <TextLogo noDrawer={noDrawer}>{title}</TextLogo>
        </HeaderContainerNoDrawner>
    ) : (
        <>
            <StatusBar forceWhiteTextIOS />

            <HeaderContainer onPress={onDoublePress}>
                <>
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
                </>
            </HeaderContainer>
        </>
    );
};

export default Header;
