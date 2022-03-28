import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '~/Locales';

import { updateUser, updatePassword } from '~/Functions/Auth/Account';
import { getUser } from '~/Functions/User/List';

import Button from '~/Components/Button';
import Header from '~/Components/Header';
import Loading from '~/Components/Loading';
import Input from '~/Components/InputText';

import {
    Container,
    Content,
    InputGroupTitle,
    InputGroup,
    InputTextTip,
} from './styles';

const User: React.FC = () => {
    const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

    const [isMounted, setIsMounted] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordConfi, setNewPasswordConfi] = useState<string>('');

    const [nameError, setNameError] = useState<boolean>(false);
    const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
    const [newPasswordConfiError, setNewPasswordConfiError] = useState<boolean>(
        false
    );

    const loadData = useCallback(async () => {
        if (!isMounted) return;
        try {
            setIsLoading(true);

            const user = await getUser();

            if (user.name) setName(user.name);
            if (user.last_name) setLastName(user.last_name);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [isMounted]);

    const handleUpdate = useCallback(async () => {
        if (!isMounted) return;
        setIsUpdating(true);

        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(
                    strings.View_Profile_Alert_Error_EmptyName
                ),
                lastName: Yup.string().required(),
            });

            await schema.validate({ name, lastName });

            if (password) {
                const schemaPass = Yup.object().shape({
                    newPassword: Yup.string()
                        .required(
                            strings.View_Profile_Alert_Error_EmptyPassword
                        )
                        .min(6),
                    newPasswordConfi: Yup.string().oneOf(
                        [Yup.ref('newPassword'), null],
                        strings.View_Profile_Alert_Error_WrongPasswordConfirmation
                    ),
                });

                await schemaPass.validate({ newPassword, newPasswordConfi });
            }
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
            setIsUpdating(false);
            return;
        }

        if (password) {
            try {
                await updatePassword({
                    password,
                    newPassword,
                });
            } catch (err) {
                let error = err.message;
                if (err.code === 'auth/wrong-password') {
                    error =
                        strings.View_Profile_Alert_Error_WrongCurrentPassword;
                }
                showMessage({
                    message: error,
                    type: 'danger',
                });
                setIsUpdating(false);
                return;
            }
        }

        try {
            await updateUser({
                name,
                lastName,
                password: newPassword,
                passwordConfirm: newPasswordConfi,
            });

            showMessage({
                message: strings.View_Profile_Alert_Success,
                type: 'info',
            });

            pop();
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsUpdating(false);
        }
    }, [
        isMounted,
        lastName,
        name,
        newPassword,
        newPasswordConfi,
        password,
        pop,
    ]);

    const handleNameChange = useCallback((value: string) => {
        setName(value);
        setNameError(false);
    }, []);

    const handleLastNameChange = useCallback((value: string) => {
        setLastName(value);
        setNameError(false);
    }, []);

    const handlePasswordChange = useCallback((value: string) => {
        setPassword(value);
    }, []);

    const handleNewPasswordChange = useCallback((value: string) => {
        setNewPassword(value);
        setNewPasswordError(false);
    }, []);

    const handleNewPasswordConfiChange = useCallback((value: string) => {
        setNewPasswordConfi(value);
        setNewPasswordConfiError(false);
    }, []);

    useEffect(() => {
        loadData();

        return () => {
            setIsMounted(false);
        };
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title={strings.View_Profile_PageTitle} noDrawer />

            <Content>
                <InputGroup>
                    <Input
                        value={name}
                        onChange={handleNameChange}
                        placeholder={
                            strings.View_Profile_InputText_Placeholder_Name
                        }
                        hasError={nameError}
                    />
                </InputGroup>
                {nameError && (
                    <InputTextTip>
                        {strings.View_Profile_Alert_Tip_EmptyName}
                    </InputTextTip>
                )}

                <InputGroup>
                    <Input
                        placeholder={
                            strings.View_Profile_InputText_Placeholder_LastName
                        }
                        value={lastName}
                        onChange={handleLastNameChange}
                    />
                </InputGroup>

                <InputGroupTitle>
                    {strings.View_Profile_Label_PasswordGroup}
                </InputGroupTitle>
                <InputGroup>
                    <Input
                        placeholder={
                            strings.View_Profile_InputText_Placeholder_Password
                        }
                        value={password}
                        onChange={handlePasswordChange}
                        isPassword
                    />
                </InputGroup>

                <InputGroup>
                    <Input
                        placeholder={
                            strings.View_Profile_InputText_Placeholder_NewPassword
                        }
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        hasError={newPasswordError}
                        isPassword
                    />
                </InputGroup>
                {newPasswordError && (
                    <InputTextTip>
                        {strings.View_Profile_Alert_Tip_EmptyPassword}
                    </InputTextTip>
                )}

                <InputGroup>
                    <Input
                        placeholder={
                            strings.View_Profile_InputText_Placeholder_ConfirNewPassword
                        }
                        value={newPasswordConfi}
                        onChange={handleNewPasswordConfiChange}
                        hasError={newPasswordConfiError}
                        isPassword
                    />
                </InputGroup>
                {newPasswordConfiError && (
                    <InputTextTip>
                        {strings.View_Profile_Alert_Tip_EmptyPasswordConfirm}
                    </InputTextTip>
                )}

                <Button
                    text={strings.View_Profile_Button_Update}
                    onPress={handleUpdate}
                    isLoading={isUpdating}
                />
            </Content>
        </Container>
    );
};

export default User;
