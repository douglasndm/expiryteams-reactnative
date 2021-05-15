import React, { useState, useCallback } from 'react';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { exportToExcel } from '~/Functions/Excel';

import Header from '~/Components/Header';
import Button from '~/Components/Button';

import {
    Container,
    Content,
    ExportOptionContainer,
    ExportExplain,
    RadioButtonGroupContainer,
    SortTitle,
    RadioButtonContainer,
    RadioButton,
    RadioButtonText,
} from './styles';

const Export: React.FC = () => {
    const [checked, setChecked] = React.useState('created_at');

    const [isExcelLoading, setIsExcelLoading] = useState<boolean>(false);

    const handleExportToExcel = useCallback(async () => {
        try {
            setIsExcelLoading(true);

            if (checked === 'created_at') {
                await exportToExcel({ sortBy: 'created_date' });
            } else {
                await exportToExcel({ sortBy: 'expire_date' });
            }
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
            <Header title={translate('View_Export_PageTitle')} />

            <Content>
                <ExportOptionContainer>
                    <ExportExplain>
                        {translate('View_Export_Explain_Excel')}
                    </ExportExplain>
                    <RadioButtonGroupContainer>
                        <SortTitle>
                            {translate('View_Export_SortTitle')}
                        </SortTitle>
                        <RadioButtonContainer>
                            <RadioButtonText>
                                {translate('View_Export_SortByCreatedDate')}
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
                                {translate('View_Export_SortByExpireDate')}
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
                        text={translate('View_Export_Button_ExportExcel')}
                        onPress={handleExportToExcel}
                        isLoading={isExcelLoading}
                    />
                </ExportOptionContainer>
            </Content>

            <FlashMessage duration={5000} position="top" />
        </Container>
    );
};

export default Export;
