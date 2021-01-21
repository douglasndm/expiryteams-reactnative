import React, { useState, useEffect, useCallback } from 'react';
import { View, Platform } from 'react-native';
import {
    RewardedAd,
    RewardedAdEventType,
    TestIds,
} from '@react-native-firebase/admob';
import Analytics from '@react-native-firebase/analytics';
import EnvConfig from 'react-native-config';

import { setProThemesByRewards } from '~/Functions/Pro/Rewards/Themes';

let adUnit = TestIds.REWARDED;

if (!__DEV__) {
    if (Platform.OS === 'android')
        adUnit = EnvConfig.ANDROID_ADMOB_ADUNITID_REWARD_PROTEST;

    if (Platform.OS === 'ios')
        adUnit = EnvConfig.IOS_ADMOB_ADUNITID_REWARD_PROTEST;
}

const rewardedAd = RewardedAd.createForAdRequest(adUnit);

interface Props {
    show: boolean;
    rewardFor: 'Themes' | 'Ads' | 'Images';
    onRewardClaimed: () => void;
}

const RewardAds: React.FC<Props> = ({
    show = false,
    rewardFor,
    onRewardClaimed,
}: Props) => {
    const [loaded, setLoaded] = useState(false);

    const setReward = useCallback(async () => {
        if (rewardFor === 'Themes') {
            await setProThemesByRewards();

            if (!__DEV__) {
                await Analytics().logEvent(
                    'user_claimed_proThemes_by_AdReward'
                );
            }
        }

        if (rewardFor === 'Ads') {
            if (!__DEV__) {
                await Analytics().logEvent('user_claimed_noAds_by_AdReward');
            }
        }

        if (rewardFor === 'Images') {
            if (!__DEV__) {
                await Analytics().logEvent(
                    'user_claimed_proImages_by_AdReward'
                );
            }
        }
        onRewardClaimed();
    }, [rewardFor, onRewardClaimed]);

    useEffect(() => {
        const eventListener = rewardedAd.onAdEvent((type, error, reward) => {
            if (type === RewardedAdEventType.LOADED) {
                setLoaded(true);
            }

            if (type === RewardedAdEventType.EARNED_REWARD) {
                console.log('User earned reward of ', reward);
                setLoaded(false);

                setReward();
                rewardedAd.load();
            }
        });

        // Start loading the rewarded ad straight away
        rewardedAd.load();

        // Unsubscribe from events on unmount
        return () => {
            eventListener();
        };
    }, [setReward]);

    useEffect(() => {
        if (show && loaded) {
            rewardedAd.show();
        }
    }, [show, loaded]);

    return <View />;
};

export default RewardAds;
