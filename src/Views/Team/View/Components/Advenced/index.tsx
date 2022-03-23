import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import { useTeam } from '~/Contexts/TeamContext';

import {
    getTeamPreferences,
    updateTeamPreferences,
} from '~/Functions/Team/Preferences';
import {
    getSelectedTeam,
    setSelectedTeam,
} from '~/Functions/Team/SelectedTeam';

import { Section, SectionTitle, SubscriptionDescription } from '../../styles';

import {
    LoadingIndicator,
    OptionContainer,
    ButtonPaper,
    Icons,
    CheckBox,
} from './styles';

const Advenced: React.FC = () => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const teamContext = useTeam();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allowProduct, setAllowProduct] = useState<boolean>(false);

    const loadData = useCallback(async () => {
        if (!teamContext.id) return;
        try {
            setIsLoading(true);

            const prefes = await getTeamPreferences({
                team_id: teamContext.id,
            });

            if (prefes.allowCollectProduct) {
                setAllowProduct(prefes.allowCollectProduct);
            }
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [teamContext.id]);

    const updatePreferences = useCallback(
        async (allowProd: boolean) => {
            if (!teamContext.id) return;
            try {
                setIsLoading(true);

                const response = await updateTeamPreferences({
                    team_id: teamContext.id,
                    preferences: {
                        allowCollectProduct: allowProd,
                    },
                });

                if (response.allowCollectProduct !== undefined) {
                    setAllowProduct(response.allowCollectProduct);

                    const selectedTeam = await getSelectedTeam();

                    if (selectedTeam)
                        await setSelectedTeam({
                            userRole: selectedTeam.userRole,
                            teamPreferences: {
                                ...selectedTeam.teamPreferences,
                                allowCollectProduct:
                                    response.allowCollectProduct,
                            },
                        });

                    if (teamContext.reload) teamContext.reload();
                }
            } catch (err) {
                if (err instanceof Error) {
                    showMessage({
                        message: err.message,
                        type: 'danger',
                    });
                }
            } finally {
                setIsLoading(false);
            }
        },
        [teamContext]
    );

    const handleSwitchAllowProd = useCallback(async () => {
        const newValue = !allowProduct;

        await updatePreferences(newValue);
        setAllowProduct(newValue);
    }, [allowProduct, updatePreferences]);

    const handleDeleteTeam = useCallback(async () => {
        navigate('DeleteTeam');
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, []);
    return (
        <Section>
            <SectionTitle>Avançado</SectionTitle>

            <SubscriptionDescription>
                Configurações avançadas do time
            </SubscriptionDescription>

            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <CheckBox
                    isChecked={allowProduct}
                    onPress={handleSwitchAllowProd}
                    disableBuiltInState
                    bounceFriction={10}
                    style={{ marginTop: 15 }}
                    text="Permitir uso de produtos para melhorar o aplicativo a sugerir produtos"
                />
            )}

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
