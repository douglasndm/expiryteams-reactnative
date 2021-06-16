import React, { useState, useCallback, useEffect } from 'react';
import Dialog from 'react-native-dialog';

import strings from '~/Locales';

import { getHowManyTimesAppWasOpen } from '~/Functions/Settings';
import { askUserForAReview } from '~/Functions/UserReview';

const AskReview: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handleDimiss = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleAskReview = useCallback(() => {
        askUserForAReview();
        setIsVisible(false);
    }, []);

    useEffect(() => {
        getHowManyTimesAppWasOpen().then(howManyTimesOpened => {
            if (howManyTimesOpened) {
                if (howManyTimesOpened === 15) {
                    setIsVisible(true);
                }
            }
        });
    }, []);

    return (
        <Dialog.Container visible={isVisible} onBackdropPress={handleDimiss}>
            <Dialog.Title>{strings.AskUserReview_Title}</Dialog.Title>
            <Dialog.Description>
                {strings.AskUserReview_Description}
            </Dialog.Description>
            <Dialog.Button
                label={strings.AskUserReview_Button_No}
                color="red"
                onPress={handleDimiss}
            />
            <Dialog.Button
                label={strings.AskUserReview_Button_Yes}
                onPress={handleAskReview}
            />
        </Dialog.Container>
    );
};

export default AskReview;
