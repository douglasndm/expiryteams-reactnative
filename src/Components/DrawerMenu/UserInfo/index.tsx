import React, { useCallback, useContext, useEffect, useState } from 'react';

import { translate } from '../../../Locales';

import PreferencesContext from '../../../Contexts/PreferencesContext';

import { getUser } from '../../../Functions/Auth/Google';

import {
    Container,
    TextContainer,
    UserName,
    UserEmail,
    UserLabel,
    UserPhoto,
    DefaultUserPhoto,
    LoginContainer,
    LoginText,
} from './styles';

interface Props {
    navigate: (routeName: string) => void;
    isUserPro?: boolean;
}

const UserInfo: React.FC<Props> = ({ isUserPro, navigate }: Props) => {
    const [user, setUser] = useState<IGoogleUser | null>(null);

    const { userPreferences } = useContext(PreferencesContext);

    const loadData = useCallback(async () => {
        if (userPreferences.isUserSignedIn) {
            const currentUser = await getUser();

            setUser(currentUser);
        }
    }, [userPreferences.isUserSignedIn]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleButtoClick = useCallback(() => {
        if (!userPreferences.isUserSignedIn) {
            navigate('SignIn');
        }
    }, [navigate, userPreferences.isUserSignedIn]);

    return (
        <Container onPress={handleButtoClick}>
            {user?.photo ? (
                <UserPhoto source={{ uri: user?.photo }} />
            ) : (
                <DefaultUserPhoto />
            )}

            <TextContainer>
                {userPreferences.isUserSignedIn ? (
                    <>
                        <UserName>{user?.name}</UserName>
                        <UserEmail>{user?.email}</UserEmail>
                        {isUserPro && (
                            <UserLabel>
                                {translate('Menu_UserProfile_Label')}
                            </UserLabel>
                        )}
                    </>
                ) : (
                    <LoginContainer>
                        <LoginText>
                            {translate('Menu_UserProfile_Button_login')}
                        </LoginText>
                    </LoginContainer>
                )}
            </TextContainer>
        </Container>
    );
};

export default UserInfo;
