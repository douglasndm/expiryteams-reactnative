import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import strings from '~/Locales';

import SubscriptionsList from './SubscriptionsList';

import {
    Container,
    HeaderContainer,
    TitleContainer,
    IntroductionText,
    AppNameTitle,
    PremiumTitle,
    Content,
    AdvantagesGroup,
    AdvantageContainer,
    AdvantageText,
    ButtonSubscription,
    TextSubscription,
    TermsPrivacyContainer,
    TermsPrivacyText,
    TermsPrivacyLink,
} from './styles';

const Subscription: React.FC = () => {
    const { navigate } = useNavigation();

    const handleNavigateHome = useCallback(() => {
        navigate('Routes', { screen: 'Home' });
    }, [navigate]);

    const navigateToTerms = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/terms');
    }, []);

    const navigateToPrivacy = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/privacy');
    }, []);

    return (
        <Container>
            <HeaderContainer>
                <TitleContainer>
                    <AppNameTitle>VALIDADES PARA EMPRESAS</AppNameTitle>
                    <IntroductionText>
                        CONHEÇA AS VANTAGENS DAS
                    </IntroductionText>
                    <PremiumTitle>ASSINATURAS</PremiumTitle>
                </TitleContainer>
            </HeaderContainer>

            <Content>
                <AdvantagesGroup>
                    <AdvantageContainer>
                        <AdvantageText>
                            Produtos sincronizados com todo seu time.
                        </AdvantageText>
                    </AdvantageContainer>

                    <AdvantageContainer>
                        <AdvantageText>
                            Melhor controle do estoque.
                        </AdvantageText>
                    </AdvantageContainer>

                    <AdvantageContainer>
                        <AdvantageText>Notificações diárias</AdvantageText>
                    </AdvantageContainer>

                    <AdvantageContainer>
                        <AdvantageText>
                            Exporte seus produtos para Excel
                        </AdvantageText>
                    </AdvantageContainer>
                </AdvantagesGroup>

                <SubscriptionsList />

                <ButtonSubscription onPress={handleNavigateHome}>
                    <TextSubscription>Voltar</TextSubscription>
                </ButtonSubscription>
            </Content>
            <TermsPrivacyContainer>
                <TermsPrivacyText>
                    Continuando com a assinatura você está concordando com
                    nossos
                    <TermsPrivacyLink onPress={navigateToTerms}>
                        {` ${strings.Terms}`}
                    </TermsPrivacyLink>
                    {strings.BetweenTermsAndPrivacy}
                    <TermsPrivacyLink onPress={navigateToPrivacy}>
                        {strings.PrivacyPolicy}
                    </TermsPrivacyLink>
                    .
                </TermsPrivacyText>
            </TermsPrivacyContainer>
        </Container>
    );
};

export default Subscription;
