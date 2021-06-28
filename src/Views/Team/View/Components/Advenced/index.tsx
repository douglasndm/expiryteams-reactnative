import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { Section, SectionTitle, SubscriptionDescription } from '../../styles';

import { OptionContainer, ButtonPaper, Icons } from './styles';

const Advenced: React.FC = () => {
    const { navigate } = useNavigation();

    const handleDeleteTeam = useCallback(async () => {
        navigate('DeleteTeam');
    }, [navigate]);
    return (
        <Section>
            <SectionTitle>Avançado</SectionTitle>

            <SubscriptionDescription>
                Configurações avançadas do time
            </SubscriptionDescription>

            <OptionContainer>
                <ButtonPaper
                    icon={() => <Icons name="trash-outline" size={22} />}
                    onPress={handleDeleteTeam}
                >
                    Apagar time
                </ButtonPaper>
            </OptionContainer>
        </Section>
    );
};

export default Advenced;
