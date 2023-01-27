import { Adjust, AdjustConfig } from 'react-native-adjust';
import Env from 'react-native-config';

function init() {
	const adjustConfig = new AdjustConfig(
		Env.ADJUST_APP_TOKEN || '',
		__DEV__
			? AdjustConfig.EnvironmentSandbox
			: AdjustConfig.EnvironmentProduction
	);
	Adjust.create(adjustConfig);
}

init();
