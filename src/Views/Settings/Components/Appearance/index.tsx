import React, {
    useState,
    useCallback,
    useContext,
    useMemo,
    useEffect,
} from 'react';

import { translate } from '~/Locales';
import { getActualAppTheme } from '~/Themes';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Button from '~/Components/Button';
import RewardAds from '~/Components/RewardAds';

import { isProThemeByRewards } from '~/Functions/Pro/Rewards/Themes';
import { setAppTheme, getAppTheme } from '~/Functions/Themes';

import { Category, CategoryOptions, CategoryTitle, Picker } from '../../styles';
import { Text, PickerContainer } from './styles';

interface IThemeItem {
    label: string;
    value: string;
    key: string;
}

const Appearance: React.FC = () => {
    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );
    const [isProByReward, setIsProByReward] = useState<boolean>(false);

    const [selectedTheme, setSelectedTheme] = useState<string>('system');
    const [showRewardAd, setShowRewardAd] = useState<boolean>(false);
    const [adLoaded, setAdLoaded] = useState<boolean>(false);

    const data = useMemo(() => {
        const availableThemes: Array<IThemeItem> = [];

        availableThemes.push({
            label: translate('View_Settings_Appearance_Theme_System'),
            value: 'system',
            key: 'system',
        });
        availableThemes.push({
            label: translate('View_Settings_Appearance_Theme_Light'),
            value: 'light',
            key: 'light',
        });
        availableThemes.push({
            label: translate('View_Settings_Appearance_Theme_Dark'),
            value: 'dark',
            key: 'dark',
        });

        if (userPreferences.isUserPremium || isProByReward) {
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_UltraViolet'),
                value: 'ultraviolet',
                key: 'ultraviolet',
            });
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_DarkGreen'),
                value: 'darkgreen',
                key: 'darkgreen',
            });
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_HappyPink'),
                value: 'happypink',
                key: 'happypink',
            });
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_OceanBlue'),
                value: 'oceanblue',
                key: 'oceanblue',
            });
            availableThemes.push({
                label: translate('View_Settings_Appearance_Theme_Relax'),
                value: 'relax',
                key: 'relax',
            });
        }

        return availableThemes;
    }, [userPreferences.isUserPremium, isProByReward]);

    useEffect(() => {
        getAppTheme().then((response) => setSelectedTheme(response));
        isProThemeByRewards().then((response) => setIsProByReward(response));
    }, []);

    const handleThemeChange = useCallback(
        async (themeName: string) => {
            if (themeName === 'null') {
                return;
            }
            setSelectedTheme(themeName);
            await setAppTheme(themeName);

            const changeToTheme = await getActualAppTheme();

            setUserPreferences({
                ...userPreferences,
                appTheme: changeToTheme,
            });
        },
        [setUserPreferences, userPreferences]
    );

    const handleShowAd = useCallback(() => {
        setShowRewardAd(true);
    }, []);

    const onRewardClaimed = useCallback(() => {
        setIsProByReward(true);
    }, []);

    const onAdLoadedChange = useCallback((loaded: boolean) => {
        setAdLoaded(loaded);
    }, []);

    return (
        <Category>
            <CategoryTitle>
                {translate('View_Settings_CategoryName_Appearance')}
            </CategoryTitle>

            <CategoryOptions>
                <Text>{translate('View_Settings_SettingName_AppTheme')}</Text>
                <PickerContainer>
                    <Picker
                        items={data}
                        onValueChange={handleThemeChange}
                        value={selectedTheme}
                        placeholder={{
                            label: 'Selecione um item',
                            value: 'null',
                        }}
                    />
                </PickerContainer>

                {!userPreferences.isUserPremium && !isProByReward && (
                    <>
                        {adLoaded && (
                            <Button
                                text={translate('RewardAd_Button_AdForTheme')}
                                onPress={handleShowAd}
                            />
                        )}

                        <RewardAds
                            rewardFor="Themes"
                            show={showRewardAd}
                            onRewardClaimed={onRewardClaimed}
                            onLoadedChange={onAdLoadedChange}
                        />
                    </>
                )}
            </CategoryOptions>
        </Category>
    );
};

export default Appearance;
