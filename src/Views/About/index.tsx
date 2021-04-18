import React, { useCallback, useEffect, useState } from 'react';
import { View, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getVersion } from 'react-native-device-info';

import { translate } from '../../Locales';

import StatusBar from '../../Components/StatusBar';
import BackButton from '../../Components/BackButton';

import { getUserId } from '../../Functions/User';

import {
    Container,
    Content,
    PageTitle,
    ApplicationVersion,
    AboutSection,
    ApplicationName,
    UserId,
    Text,
    Link,
} from './styles';

const About: React.FC = () => {
    const { goBack } = useNavigation();
    const [userId, setUserId] = useState<string>('');

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

    const loaddata = useCallback(async () => {
        const id = await getUserId();

        setUserId(id);
    }, []);

    useEffect(() => {
        loaddata();
    }, [loaddata]);

    return (
        <Container>
            <StatusBar />
            <Content>
                <BackButton handleOnPress={goBack} />
                <PageTitle>{translate('View_About_PageTitle')}</PageTitle>
            </Content>

            <AboutSection>
                <ApplicationName>{translate('AppName')}</ApplicationName>
                <UserId>
                    {translate('View_About_UID')} {userId}
                </UserId>
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
