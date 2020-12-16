import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PurchasesPackage } from 'react-native-purchases';

import {
    getSubscriptionDetails,
    makeSubscription,
    isSubscriptionActive,
} from '../../Functions/ProMode';
import { isUserSignedIn } from '../../Functions/Auth/Google';

import Loading from '../../Components/Loading';
import Notification from '../../Components/Notification';

import PreferencesContext from '../../Contexts/PreferencesContext';

import {
    Container,
    HeaderContainer,
    TitleContainer,
    IntroductionText,
    AppNameTitle,
    PremiumTitle,
    AdvantagesGroup,
    AdvantageContainer,
    AdvantageText,
    ButtonSubscription,
    TextSubscription,
    LoadingIndicator,
} from './styles';

const PremiumSubscription: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [isUserAlreadySignedIn, setIsUserAlreadySignedIn] = useState<boolean>(
        false
    );

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [isLoadingMakeSubscription, setIsLoadingMakeSubscription] = useState<
        boolean
    >(false);

    const [
        packageSubscription,
        setPackageSubscription,
    ] = useState<PurchasesPackage | null>(null);

    const [alreadyPremium, setAlreadyPremium] = useState(false);

    const { navigate } = useNavigation();

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const alreaderSignedIn = await isUserSignedIn();

            setIsUserAlreadySignedIn(alreaderSignedIn);

            const alreadyProUser = await isSubscriptionActive();
            setAlreadyPremium(alreadyProUser);

            const response = await getSubscriptionDetails();

            if (!response.availablePackages[0]) {
                setPackageSubscription(null);
                return;
            }

            setPackageSubscription(response.availablePackages[0]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleMakeSubscription = useCallback(async () => {
        try {
            setIsLoadingMakeSubscription(true);
            await makeSubscription();

            setUserPreferences({
                ...userPreferences,
                isUserPremium: true,
            });

            navigate('Home');
        } catch (err) {
            if (err.message === 'User cancel payment') {
                return;
            }
            setError(err.message);
        } finally {
            setIsLoadingMakeSubscription(false);
        }
    }, [setUserPreferences, userPreferences, navigate]);

    const handleNavigateHome = useCallback(() => {
        navigate('Home');
    }, [navigate]);

    const handleNavigateToSignIn = useCallback(() => {
        navigate('SignIn');
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <ScrollView>
                <HeaderContainer>
                    <TitleContainer>
                        <IntroductionText>Conheça o</IntroductionText>
                        <AppNameTitle>Controle de validade</AppNameTitle>
                        <PremiumTitle>Premium</PremiumTitle>
                    </TitleContainer>
                </HeaderContainer>

                <AdvantagesGroup>
                    <AdvantageContainer>
                        <AdvantageText>SEM ANÚNCIOS</AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <AdvantageText>
                            OPÇÃO PARA SALVAR SEU BANCO DE DADOS EM CASO DE
                            FORMATAÇÃO OU PERDA DO TELEFONE
                        </AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <AdvantageText>TEMAS EXCLUSIVOS</AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <AdvantageText>
                            PEQUENO VALOR A CADA TRÊS MESES
                        </AdvantageText>
                    </AdvantageContainer>
                </AdvantagesGroup>

                {isUserAlreadySignedIn ? (
                    <>
                        {alreadyPremium ? (
                            <ButtonSubscription>
                                <TextSubscription>
                                    VOCÊ JÁ É PREMIUM
                                </TextSubscription>
                            </ButtonSubscription>
                        ) : (
                            <ButtonSubscription
                                onPress={handleMakeSubscription}
                                disabled={isLoadingMakeSubscription}
                            >
                                {isLoadingMakeSubscription && (
                                    <LoadingIndicator />
                                )}
                                {!isLoadingMakeSubscription && (
                                    <>
                                        <TextSubscription>
                                            ASSINAR POR
                                        </TextSubscription>
                                        <TextSubscription>
                                            {`${packageSubscription?.product.price_string} TRIMESTRAIS`}
                                        </TextSubscription>
                                    </>
                                )}
                            </ButtonSubscription>
                        )}
                    </>
                ) : (
                    <>
                        <ButtonSubscription onPress={handleNavigateToSignIn}>
                            <TextSubscription>
                                Você precisar entrar com sua conta primeiro.
                            </TextSubscription>
                            <TextSubscription>
                                Clique aqui para entrar.
                            </TextSubscription>
                        </ButtonSubscription>
                    </>
                )}

                <ButtonSubscription onPress={handleNavigateHome}>
                    <TextSubscription>Voltar ao início</TextSubscription>
                </ButtonSubscription>
            </ScrollView>

            {!!error && (
                <Notification
                    NotificationMessage={error}
                    NotificationType="error"
                    onPress={handleDimissNotification}
                />
            )}
        </Container>
    );
};

export default PremiumSubscription;
