import React from 'react';

import strings from '@teams/Locales';

import About from '@views/About';

const AboutContainer: React.FC = () => {
	return <About appName={strings.AppName} />;
};

export default AboutContainer;
