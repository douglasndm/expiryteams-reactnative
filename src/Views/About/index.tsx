import React, { useState, useCallback } from 'react';
import { View, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    getVersion,
    getBuildNumber,
    getSystemName,
    getSystemVersion,
} from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import Purchases from 'react-native-purchases';

import strings from '~/Locales';

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
    SocialContainer,
    SocialIcon,
} from './styles';

const About: React.FC = () => {
    const { goBack } = useNavigation();

    const [tapsCount, setTapsCount] = useState<number>(0);

    const handleNavigateToSite = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev');
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

    const handleNaviTwitter = useCallback(async () => {
        await Linking.openURL('https://www.twitter.com/douglasndmdev/');
    }, []);

    const handleNaviFB = useCallback(async () => {
        await Linking.openURL('https://www.facebook.com/douglasndmdev/');
    }, []);

    const handleNaviMail = useCallback(async () => {
        await Linking.openURL('mailto:suporte@douglasndm.dev');
    }, []);

    const handleFlatIconPress = useCallback(async () => {
        await Linking.openURL('https://www.flaticon.com/authors/srip');
    }, []);

    const handleShareIdInfo = useCallback(async () => {
        setTapsCount(tapsCount + 1);
        if (tapsCount > 15) {
            const revenueCatId = await Purchases.getAppUserID();
            const token = await messaging().getToken();

            const userInfo = {
                purchase_idetinfy: revenueCatId,
                firebase_messaging: token,
            };
            // shareText({
            //    title: 'User informations',
            //    text: JSON.stringify(userInfo),
            // });
        }
    }, [tapsCount]);

    return (
        <Container>
            <StatusBar />
            <Content>
                <BackButton handleOnPress={goBack} />
                <PageTitle>{strings.View_About_PageTitle}</PageTitle>
            </Content>

            <AboutSection>
                <ApplicationName>{strings.AppName}</ApplicationName>

                <ApplicationVersion>
                    {`${
                        strings.View_About_AppVersion
                    } ${getVersion()} (Build: ${getBuildNumber()})`}
                </ApplicationVersion>
                <ApplicationVersion>{`${getSystemName()} ${getSystemVersion()}`}</ApplicationVersion>
            </AboutSection>

            <AboutSection>
                <Link onPress={handleNavigateToSite}>
                    {strings.Menu_Button_KnowOthersApps}
                </Link>
            </AboutSection>

            <AboutSection>
                <Text>
                    {strings.BeforeTermsAndPrivacy}
                    <Link onPress={navigateToTerms}>{strings.Terms}</Link>
                    {strings.BetweenTermsAndPrivacy}
                    <Link onPress={navigateToPrivacy}>
                        {strings.PrivacyPolicy}
                    </Link>
                    .
                </Text>
            </AboutSection>

            <AboutSection>
                <Text>{strings.View_About_LogoMadeBy}</Text>

                <View>
                    <Link onPress={handleFlatIconPress}>
                        https://www.flaticon.com/authors/srip
                    </Link>
                </View>
            </AboutSection>

            <AboutSection>
                <Text onPress={handleShareIdInfo}>
                    {strings.View_About_DevelopedBy}
                </Text>
            </AboutSection>

            <SocialContainer>
                <SocialIcon
                    name="logo-linkedin"
                    onPress={handleLinkedinPress}
                />
                <SocialIcon name="logo-twitter" onPress={handleNaviTwitter} />
                <SocialIcon name="logo-facebook" onPress={handleNaviFB} />
                <SocialIcon name="mail-outline" onPress={handleNaviMail} />
            </SocialContainer>
        </Container>
    );
};

export default About;
