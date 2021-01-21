import React, { useState, useCallback } from 'react';
import { View } from 'react-native';

import { translate } from '~/Locales';

import Button from '~/Components/Button';
import RewardAds from '~/Components/RewardAds';

interface Props {
    setIsProByReward: (enable: boolean) => void;
}

const Components: React.FC<Props> = ({ setIsProByReward }: Props) => {
    const [showRewardAd, setShowRewardAd] = useState<boolean>(false);
    const [adLoaded, setAdLoaded] = useState<boolean>(false);

    const handleShowAd = useCallback(() => {
        setShowRewardAd(true);
    }, []);

    const onRewardClaimed = useCallback(() => {
        setIsProByReward(true);
    }, [setIsProByReward]);

    const onAdLoadedChange = useCallback((loaded: boolean) => {
        setAdLoaded(loaded);
    }, []);

    return (
        <View>
            <>
                {adLoaded && (
                    <Button
                        text={translate('RewardAd_Button_AdForImage')}
                        onPress={handleShowAd}
                    />
                )}

                <RewardAds
                    rewardFor="Images"
                    show={showRewardAd}
                    onRewardClaimed={onRewardClaimed}
                    onLoadedChange={onAdLoadedChange}
                />
            </>
        </View>
    );
};

export default Components;
