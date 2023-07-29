import React, { useState, useCallback, useEffect } from 'react';

import strings from '@teams/Locales';

import { getHowManyTimesAppWasOpen } from '@teams/Functions/Settings';
import { askUserForAReview } from '@teams/Functions/UserReview';

import Dialog from '@components/Dialog';

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
		<Dialog
			visible={isVisible}
			title={strings.AskUserReview_Title}
			description={strings.AskUserReview_Description}
			cancelText={strings.AskUserReview_Button_No}
			confirmText={strings.AskUserReview_Button_Yes}
			onConfirm={handleAskReview}
			onDismiss={handleDimiss}
		/>
	);
};

export default AskReview;
