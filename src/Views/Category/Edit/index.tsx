import React, { useCallback, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import FlashMessage, { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import { getCategory, updateCategory } from '~/Functions/Categories';

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

    const loadData = useCallback(async () => {
        const category = await getCategory({ category_id: routeParams.id });

        if ('error' in category) {
            showMessage({
                message: category.error,
                type: 'danger',
            });
            return;
        }

        setName(category.name);
    }, [routeParams.id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onNameChange = useCallback(value => {
        setErrorName('');
        setName(value);
    }, []);

    const handleUpdate = useCallback(async () => {
        if (!name) {
            setErrorName(translate('View_Category_Edit_ErrorEmtpyName'));
            return;
        }

        const updatedCategory = await updateCategory({
            category: {
                id: routeParams.id,
                name,
            },
        });

        if ('error' in updatedCategory) {
            showMessage({
                message: updatedCategory.error,
                type: 'danger',
            });
            return;
        }

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

            <FlashMessage position="top" />
        </Container>
    );
};

export default Edit;
