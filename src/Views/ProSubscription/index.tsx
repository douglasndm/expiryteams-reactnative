import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { PurchasesPackage } from 'react-native-purchases';

import { translate } from '../../Locales';

import {
    getSubscriptionDetails,
    makeSubscription,
    isSubscriptionActive,
} from '../../Functions/ProMode';
import { isUserSignedIn } from '~/Functions/Auth';

import Loading from '../../Components/Loading';
import Notification from '../../Components/Notification';

import PreferencesContext from '../../Contexts/PreferencesContext';

import {
    Container,
    Scroll,
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

const Pro: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

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

            if (alreaderSignedIn !== true) return;

            const alreadyProUser = await isSubscriptionActive();
            setAlreadyPremium(alreadyProUser);

            const response = await getSubscriptionDetails();

            if (!response) {
                setPackageSubscription(null);
                return;
            }

            setPackageSubscription(response);
        } catch (err) {
            // setError(err.message);
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

    const subscribeButtonString = useMemo(() => {
        const period =
            packageSubscription?.packageType === 'THREE_MONTH'
                ? translate('View_ProPage_SubscribePeriod_Quarterly')
                : translate('View_ProPage_SubscribePeriod_Monthly');

        if (!packageSubscription?.product.intro_price_string) {
            return `${translate('View_ProPage_BeforeIntroPrice')} ${
                packageSubscription?.product.price_string
            } ${period}`;
        }

        return `${translate('View_ProPage_BeforeIntroPrice')} ${
            packageSubscription.product.intro_price_string
        } ${translate('View_ProPage_AfterIntroPrice')} ${
            packageSubscription?.product?.price_string
        } ${period}`;
    }, [packageSubscription]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <Scroll>
                    <HeaderContainer>
                        <TitleContainer>
                            <IntroductionText>
                                {translate('View_ProPage_MeetPRO')}
                            </IntroductionText>
                            <AppNameTitle>{translate('AppName')}</AppNameTitle>
                            <PremiumTitle>
                                {translate('View_ProPage_ProLabel')}
                            </PremiumTitle>
                        </TitleContainer>
                    </HeaderContainer>

                    <AdvantagesGroup>
                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageOne')}
                            </AdvantageText>
                        </AdvantageContainer>

                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageSeven')}
                            </AdvantageText>
                        </AdvantageContainer>

                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageTwo')}
                            </AdvantageText>
                        </AdvantageContainer>

                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageThree')}
                            </AdvantageText>
                        </AdvantageContainer>
                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageFour')}
                            </AdvantageText>
                        </AdvantageContainer>
                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageSix')}
                            </AdvantageText>
                        </AdvantageContainer>
                        <AdvantageContainer>
                            <AdvantageText>
                                {translate('View_ProPage_AdvantageFive')}
                            </AdvantageText>
                        </AdvantageContainer>
                    </AdvantagesGroup>

                    {userPreferences.isUserSignedIn ? (
                        <>
                            {alreadyPremium ? (
                                <ButtonSubscription>
                                    <TextSubscription>
                                        {translate(
                                            'View_ProPage_UserAlreadyPro'
                                        )}
                                    </TextSubscription>
                                </ButtonSubscription>
                            ) : (
                                <>
                                    {packageSubscription ? (
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
                                                        {subscribeButtonString}
                                                    </TextSubscription>
                                                </>
                                            )}
                                        </ButtonSubscription>
                                    ) : (
                                        <ButtonSubscription disabled>
                                            <TextSubscription>
                                                {translate(
                                                    'View_ProPage_SubscriptionNotAvailable'
                                                )}
                                            </TextSubscription>
                                        </ButtonSubscription>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <ButtonSubscription
                                onPress={handleNavigateToSignIn}
                            >
                                <TextSubscription>
                                    {translate(
                                        'View_ProPage_Button_ClickToSignIn'
                                    )}
                                </TextSubscription>
                            </ButtonSubscription>
                        </>
                    )}

                    <ButtonSubscription onPress={handleNavigateHome}>
                        <TextSubscription>
                            {translate('View_ProPage_Button_GoBackToHome')}
                        </TextSubscription>
                    </ButtonSubscription>
                </Scroll>
            </Container>
            {!!error && (
                <Notification
                    NotificationMessage={error}
                    NotificationType="error"
                    onPress={handleDimissNotification}
                />
            )}
        </>
    );
};

export default Pro;
