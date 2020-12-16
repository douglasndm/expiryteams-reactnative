import React, { useCallback, useEffect, useState } from 'react';
import { View, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getVersion } from 'react-native-device-info';

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
            <Content>
                <BackButton handleOnPress={goBack} />
                <PageTitle>Sobre</PageTitle>
            </Content>

            <AboutSection>
                <ApplicationName>Controle de Validade</ApplicationName>
                <UserId>UID: {userId}</UserId>
                <ApplicationVersion>{getVersion()}</ApplicationVersion>
            </AboutSection>

            <AboutSection>
                <Text>Desenvolvido por Douglas Nunes de Mattos</Text>
                <Link onPress={handleLinkedinPress}>Linkedin</Link>
            </AboutSection>

            <AboutSection>
                <Text>Logo só possível por</Text>

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
