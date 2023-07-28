import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '@teams/Locales';

import { useAuth } from '@teams/Contexts/AuthContext';
import { useTeam } from '@teams/Contexts/TeamContext';

import { login } from '@teams/Functions/Auth';
import { getTeamPreferences } from '@teams/Functions/Team/Preferences';
import { setSelectedTeam } from '@teams/Functions/Team/SelectedTeam';

import Loading from '@components/Loading';
import Input from '@components/InputText';
import Button from '@components/Button';

import Footer from './Footer';

import {
	Container,
	Content,
	LogoContainer,
	Logo,
	LogoTitle,
	FormContainer,
	FormTitle,
	LoginForm,
	ForgotPasswordText,
} from './styles';

const Login: React.FC = () => {
	const { navigate, reset } =
		useNavigation<StackNavigationProp<AuthRoutes>>();
	const { initializing } = useAuth();

	const teamContext = useTeam();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isLoging, setIsLoging] = useState<boolean>(false);

	const handleLogin = useCallback(async () => {
		const schema = Yup.object().shape({
			email: Yup.string().required().email(),
			password: Yup.string().required(),
		});

		try {
			await schema.validate({ email, password });
		} catch (err) {
			showMessage({
				message: strings.View_Login_InputText_EmptyText,
				type: 'warning',
			});
			return;
		}

		try {
			setIsLoging(true);

			// Makes login with Firebase after that the subscriber event will handle
			const user = await login({ email, password });

			if (user) {
				if (!user.firebaseUser.emailVerified) {
					reset({
						routes: [
							{
								name: 'Routes',
								state: {
									routes: [
										{
											name: 'VerifyEmail',
										},
									],
								},
							},
						],
					});

					return;
				}

				const userRole = user.localUser.team;

				if (userRole && Object.keys(userRole).length > 0) {
					const { status, role } = userRole;
					const { team } = userRole;

					const onTeam =
						status && status.toLowerCase() === 'completed';
					const teamRole = role ? role.toLowerCase() : null;

					const uRole: IUserRoles = {
						role,
						status: userRole.status || null,
						team,
					};

					if (onTeam || teamRole === 'manager') {
						const teamPreferences = await getTeamPreferences({
							team_id: team.id,
						});

						await setSelectedTeam({
							userRole,
							teamPreferences,
						});

						if (teamContext.reload) {
							teamContext.reload();
						}

						let routeName = 'Home';

						if (!team.isActive) {
							if (teamRole === 'manager') {
								routeName = 'ViewTeam';
							} else {
								routeName = 'ListTeam';
							}
						}

						reset({
							routes: [
								{
									name: 'Routes',
									state: {
										routes: [
											{
												name: routeName,
											},
										],
									},
								},
							],
						});
					} else {
						// when user is on team but they still didn't enter the code
						reset({
							routes: [
								{
									name: 'Routes',
									state: {
										routes: [
											{
												name: 'EnterTeam',
												params: { userRole: uRole },
											},
										],
									},
								},
							],
						});
					}
				} else {
					reset({
						routes: [
							{
								name: 'Routes',
								state: {
									routes: [
										{
											name: 'TeamList',
										},
									],
								},
							},
						],
					});
				}
			}
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsLoging(false);
		}
	}, [email, password, reset]);

	const handleEmailChange = useCallback(
		(value: string) => setEmail(value.trim()),
		[]
	);

	const handlePasswordChange = useCallback(
		(value: string) => setPassword(value),
		[]
	);

	const handleNavigateToForgotPass = useCallback(() => {
		navigate('ForgotPassword');
	}, [navigate]);

	useEffect(() => {
		try {
			setIsLoading(true);

			const user = auth().currentUser;

			if (user) {
				if (!user.emailVerified) {
					navigate('Routes', {
						state: {
							routes: [{ name: 'VerifyEmail' }],
						},
					});
				}
			}
		} finally {
			setIsLoading(false);
		}
	}, [navigate, reset]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<LogoContainer>
				<Logo />
				<LogoTitle>
					{strings.View_Login_Business_Title.toUpperCase()}
				</LogoTitle>
			</LogoContainer>
			<Content>
				<FormContainer>
					<FormTitle>{strings.View_Login_FormLogin_Title}</FormTitle>
					<LoginForm>
						<Input
							value={email}
							onChange={handleEmailChange}
							placeholder={
								strings.View_Login_InputText_Email_Placeholder
							}
							autoCorrect={false}
							autoCapitalize="none"
							contentStyle={{ marginBottom: 10 }}
						/>

						<Input
							value={password}
							onChange={handlePasswordChange}
							placeholder={
								strings.View_Login_InputText_Password_Placeholder
							}
							autoCorrect={false}
							autoCapitalize="none"
							isPassword
						/>

						<ForgotPasswordText
							onPress={handleNavigateToForgotPass}
						>
							{strings.View_Login_Label_ForgotPassword}
						</ForgotPasswordText>
					</LoginForm>

					<Button
						text={strings.View_Login_Button_SignIn}
						onPress={handleLogin}
						isLoading={isLoging || initializing}
					/>
				</FormContainer>
			</Content>

			<Footer />
		</Container>
	);
};

export default Login;
