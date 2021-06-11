import React, { useCallback } from 'react';
import { View, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getVersion } from 'react-native-device-info';

import { translate } from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';

import {
    Container,
    Content,
    PageTitle,
    ApplicationVersion,
    AboutSection,
    ApplicationName,
    Text,
    Link,
} from './styles';

const About: React.FC = () => {
    const { goBack } = useNavigation();

    const navigateToTelegram = useCallback(async () => {
        await Linking.openURL('https://t.me/douglasdev');
    }, []);

    const navigateToTerms = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/terms');
    }, []);

    const navigateToPrivacy = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/privacy');
    }, []);

    const handleLinkedinPress = useCallback(async () => {
        await Linking.openURL('https://www.linkedin.com/in/douglasndm/');
    }, []);

    const handleFlatIconPress = useCallback(async () => {
        await Linking.openURL('https://www.flaticon.com/authors/srip');
    }, []);

    return (
        <Container>
            <StatusBar />
            <Content>
                <BackButton handleOnPress={goBack} />
                <PageTitle>{translate('View_About_PageTitle')}</PageTitle>
            </Content>

            <AboutSection>
                <ApplicationName>{translate('AppName')}</ApplicationName>

                <ApplicationVersion>
                    {translate('View_About_AppVersion') + getVersion()}
                </ApplicationVersion>
            </AboutSection>

            <AboutSection>
                <Text>
                    {translate('BeforeTermsAndPrivacy')}
                    <Link onPress={navigateToTerms}>{translate('Terms')}</Link>
                    {translate('BetweenTermsAndPrivacy')}
                    <Link onPress={navigateToPrivacy}>
                        {translate('PrivacyPolicy')}
                    </Link>
                    .
                </Text>
            </AboutSection>

            <AboutSection>
                <Text>{translate('View_About_DevelopedBy')}</Text>
                <Link onPress={handleLinkedinPress}>Linkedin</Link>
            </AboutSection>

            <AboutSection>
                <Text>{translate('View_About_NeedHelp')}</Text>
                <Link onPress={navigateToTelegram}>
                    {translate('View_About_HelpTelegram')}
                </Link>
            </AboutSection>

            <AboutSection>
                <Text>{translate('View_About_LogoMadeBy')}</Text>

                <View>
                    <Link onPress={handleFlatIconPress}>
                        https://www.flaticon.com/authors/srip
                    </Link>
                </View>
            </AboutSection>
        </Container>
    );
};

export default About;
