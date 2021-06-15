import React, { useState, useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { importExportFileFromApp } from '~/Functions/ImportExport';
import { exportToExcel } from '~/Functions/Excel';

import Header from '~/Components/Header';
import Button from '~/Components/Button';

import {
    Container,
    Content,
    OptionContainer,
    ExplainText,
    RadioButtonGroupContainer,
    SortTitle,
    RadioButtonContainer,
    RadioButton,
    RadioButtonText,
} from './styles';

const Export: React.FC = () => {
    const { reset } = useNavigation();

    const { preferences } = useContext(PreferencesContext);

    const [checked, setChecked] = React.useState('created_at');

    const [isImporting, setIsImporting] = useState<boolean>(false);
    const [isExcelLoading, setIsExcelLoading] = useState<boolean>(false);

    const handleImport = useCallback(async () => {
        if (!preferences.selectedTeam) {
            return;
        }

        try {
            setIsImporting(true);

            await importExportFileFromApp({
                team_id: preferences.selectedTeam.team.id,
            });

            showMessage({
                message: 'Produtos importados',
                type: 'info',
            });

            reset({
                routes: [
                    {
                        name: 'Home',
                    },
                ],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsImporting(false);
        }
    }, [preferences.selectedTeam, reset]);

    const handleExportToExcel = useCallback(async () => {
        try {
            setIsExcelLoading(true);

            if (checked === 'created_at') {
                await exportToExcel({ sortBy: 'created_date' });
            } else {
                await exportToExcel({ sortBy: 'expire_date' });
            }

            showMessage({
                message: 'Arquivo excel gerado com sucesso',
                type: 'info',
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsExcelLoading(false);
        }
    }, [checked]);

    return (
        <Container>
            <Header title={strings.View_Export_PageTitle} />

            <Content>
                {preferences.selectedTeam?.role.toLowerCase() === 'manager' && (
                    <OptionContainer>
                        <ExplainText>
                            Tem um arquivo de exportação gerado pelo Controle de
                            Validade individual? É aqui que você vai adiciona-lo
                            e copiar todos seus produtos para esta versão.
                        </ExplainText>

                        <Button
                            text="Selecionar arquivo"
                            onPress={handleImport}
                            isLoading={isImporting}
                        />
                    </OptionContainer>
                )}

                <OptionContainer>
                    <ExplainText>
                        {strings.View_Export_Explain_Excel}
                    </ExplainText>
                    <RadioButtonGroupContainer>
                        <SortTitle>{strings.View_Export_SortTitle}</SortTitle>
                        <RadioButtonContainer>
                            <RadioButtonText>
                                {strings.View_Export_SortByCreatedDate}
                            </RadioButtonText>
                            <RadioButton
                                value="created_at"
                                status={
                                    checked === 'created_at'
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                onPress={() => setChecked('created_at')}
                            />
                        </RadioButtonContainer>

                        <RadioButtonContainer>
                            <RadioButtonText>
                                {strings.View_Export_SortByExpireDate}
                            </RadioButtonText>
                            <RadioButton
                                value="expire_in"
                                status={
                                    checked === 'expire_in'
                                        ? 'checked'
                                        : 'unchecked'
                                }
                                onPress={() => setChecked('expire_in')}
                            />
                        </RadioButtonContainer>
                    </RadioButtonGroupContainer>

                    <Button
                        text={strings.View_Export_Button_ExportExcel}
                        onPress={handleExportToExcel}
                        isLoading={isExcelLoading}
                    />
                </OptionContainer>
            </Content>

            <FlashMessage duration={5000} position="top" />
        </Container>
    );
};

export default Export;
