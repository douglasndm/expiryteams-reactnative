import React, { useState, useCallback, useEffect } from 'react';

import strings from '~/Locales';

import { getHowManyTimesAppWasOpen } from '~/Functions/Settings';
import { askUserForAReview } from '~/Functions/UserReview';

import { Dialog, DialogTitle, DialogText, Button } from './styles';

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
        <Dialog visible={isVisible} onDismiss={handleDimiss}>
            <DialogTitle>{strings.AskUserReview_Title}</DialogTitle>
            <Dialog.Content>
                <DialogText>{strings.AskUserReview_Description}</DialogText>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={handleDimiss}>
                    {strings.AskUserReview_Button_No}
                </Button>
                <Button onPress={handleAskReview}>
                    {strings.AskUserReview_Button_Yes}
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};

export default AskReview;
