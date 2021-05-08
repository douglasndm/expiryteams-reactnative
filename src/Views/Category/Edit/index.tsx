import React, { useCallback, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';

import { PageHeader, PageTitle } from '~/Views/Product/Add/styles';

import {
    Container,
    Content,
    PageTitleContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
} from './styles';

interface Props {
    id: string;
}
const Edit: React.FC = () => {
    const { params } = useRoute();
    const { reset, goBack } = useNavigation();

    const [name, setName] = useState<string | undefined>(undefined);
    const [errorName, setErrorName] = useState<string>('');

    const routeParams = params as Props;

    const handleDeleteCategory = useCallback(async () => {}, []);

    useEffect(() => {
        getCategory(routeParams.id).then(response => setName(response.name));
    }, [routeParams.id]);

    const onNameChange = useCallback(value => {
        setErrorName('');
        setName(value);
    }, []);

    const handleUpdate = useCallback(async () => {
        if (!name) {
            setErrorName(translate('View_Category_Edit_ErrorEmtpyName'));
            return;
        }

        await updateCategory({
            id: routeParams.id,
            name,
        });

        Alert.alert(translate('View_Category_Edit_SuccessText'));

        reset({
            routes: [
                { name: 'Home' },
                {
                    name: 'ListCategory',
                },
            ],
        });
    }, [routeParams.id, name, reset]);

    return (
        <Container>
            <PageHeader>
                <PageTitleContainer>
                    <BackButton handleOnPress={goBack} />
                    <PageTitle>
                        {translate('View_Category_Edit_PageTitle')}
                    </PageTitle>
                </PageTitleContainer>
            </PageHeader>

            <Content>
                <InputTextContainer hasError={!!errorName}>
                    <InputText
                        placeholder={translate(
                            'View_Category_Edit_InputNamePlaceholder'
                        )}
                        value={name}
                        onChangeText={onNameChange}
                    />
                </InputTextContainer>
                {!!errorName && <InputTextTip>{errorName}</InputTextTip>}

                <Button
                    text={translate('View_Category_Edit_ButtonSave')}
                    onPress={handleUpdate}
                />
            </Content>
        </Container>
    );
};

export default Edit;
