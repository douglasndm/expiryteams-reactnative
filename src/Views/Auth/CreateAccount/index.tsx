import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '~/Locales';

import { createAccount } from '~/Functions/Auth/Account';
import { createSeassion } from '~/Functions/Auth/Session';

import Header from '~/Components/Header';
import Input from '~/Components/InputText';
import Button from '~/Components/Button';

import { FormContainer } from '../Login/styles';
import { Container, PageContent } from './styles';

const CreateAccount: React.FC = () => {
    const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

    const [isMounted, setIsMounted] = useState(true);

    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const [isCreating, setIsCreating] = useState<boolean>(false);

    const handleNameChange = useCallback((value: string) => setName(value), []);
    const handleLastNameChange = useCallback(
        (value: string) => setLastName(value),
        []
    );
    const handleEmailChange = useCallback(
        (value: string) => setEmail(value.trim()),
        []
    );

    const handlePasswordChange = useCallback(
        (value: string) => setPassword(value),
        []
    );

    const handlePasswordConfirmChange = useCallback(
        (value: string) => setPasswordConfirm(value),
        []
    );

    const handleCreateAccount = useCallback(async () => {
        if (!isMounted) return;
        const schema = Yup.object().shape({
            name: Yup.string().required(
                strings.View_CreateAccount_Alert_Error_EmptyName
            ),
            lastName: Yup.string().required(
                strings.View_CreateAccount_Alert_Error_EmptyLastName
            ),
            email: Yup.string()
                .required(strings.View_CreateAccount_Alert_Error_EmptyEmail)
                .email(strings.View_CreateAccount_Alert_Error_InvalidEmail),
            password: Yup.string()
                .required(strings.View_CreateAccount_Alert_Error_EmptyPassword)
                .min(6),
            passwordConfirm: Yup.string().oneOf(
                [Yup.ref('password'), null],
                strings.View_CreateAccount_Alert_Error_InvalidPassConfirm
            ),
        });

        try {
            await schema.validate({
                name,
                lastName,
                email,
                password,
                passwordConfirm,
            });
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.errors[0],
                    type: 'warning',
                });
            return;
        }

        try {
            setIsCreating(true);
            await createAccount({
                name,
                lastName,
                email,
                password,
                passwordConfirm,
            });

            // Here we register the user device
            await createSeassion();

            showMessage({
                message: strings.View_CreateAccount_Alert_Success_Title,
                description: strings.View_CreateAccount_Alert_Success_Message,
                type: 'info',
            });

            pop();
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'warning',
                });
        } finally {
            setIsCreating(false);
        }
    }, [email, isMounted, lastName, name, password, passwordConfirm, pop]);

    useEffect(() => {
        return () => {
            setIsMounted(false);
        };
    }, []);

    return (
        <Container>
            <PageContent>
                <Header title={strings.View_CreateAccount_PageTitle} noDrawer />

                <FormContainer>
                    <Input
                        placeholder={
                            strings.View_CreateAccount_Input_Name_Placeholder
                        }
                        autoCorrect={false}
                        autoCapitalize="words"
                        value={name}
                        onChange={handleNameChange}
                        contentStyle={{ marginBottom: 7 }}
                    />

                    <Input
                        placeholder={
                            strings.View_CreateAccount_Input_LastName_Placeholder
                        }
                        autoCorrect={false}
                        autoCapitalize="words"
                        value={lastName}
                        onChange={handleLastNameChange}
                        contentStyle={{ marginBottom: 7 }}
                    />

                    <Input
                        placeholder={
                            strings.View_CreateAccount_Input_Email_Placeholder
                        }
                        autoCorrect={false}
                        autoCapitalize="none"
                        value={email}
                        onChange={handleEmailChange}
                        contentStyle={{ marginBottom: 7 }}
                    />

                    <Input
                        placeholder={
                            strings.View_CreateAccount_Input_Password_Placeholder
                        }
                        autoCorrect={false}
                        autoCapitalize="none"
                        isPassword
                        value={password}
                        onChange={handlePasswordChange}
                        contentStyle={{ marginBottom: 7 }}
                    />

                    <Input
                        placeholder={
                            strings.View_CreateAccount_Input_ConfirmPassword_Placeholder
                        }
                        autoCorrect={false}
                        autoCapitalize="none"
                        isPassword
                        value={passwordConfirm}
                        onChange={handlePasswordConfirmChange}
                        contentStyle={{ marginBottom: 7 }}
                    />

                    <Button
                        text={strings.View_CreateAccount_Button_CreateAccount}
                        onPress={handleCreateAccount}
                        isLoading={isCreating}
                    />
                </FormContainer>
            </PageContent>
        </Container>
    );
};

export default CreateAccount;
