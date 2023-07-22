import React, { useCallback, useMemo } from 'react';

import strings from '@teams/Locales';

import { useAuth } from '@teams/Contexts/AuthContext';
import { useTeam } from '@teams/Contexts/TeamContext';

import {
	Container,
	TextContainer,
	UserName,
	UserEmail,
	UserInfo,
	UserPhoto,
	DefaultUserPhoto,
} from './styles';

interface InfoProps {
	navigate: (route: string) => void;
}

const Info: React.FC<InfoProps> = ({ navigate }: InfoProps) => {
	const { user } = useAuth();
	const teamContext = useTeam();

	const userRole = useMemo(() => {
		if (teamContext.roleInTeam) {
			const { role } = teamContext.roleInTeam;

			if (role?.toLowerCase() === 'manager')
				return strings.UserInfo_Role_Manager;
			if (role?.toLowerCase() === 'supervisor') {
				return strings.UserInfo_Role_Supervisor;
			}
		}

		return strings.UserInfo_Role_Repositor;
	}, [teamContext.roleInTeam]);

	const handleNavigateToProfile = useCallback(() => {
		navigate('User');
	}, [navigate]);

	return (
		<Container onPress={handleNavigateToProfile}>
			{user && (
				<>
					{user?.photoURL ? (
						<UserPhoto source={{ uri: user?.photoURL }} />
					) : (
						<DefaultUserPhoto />
					)}

					<TextContainer>
						{!!user.displayName && (
							<UserName>{user.displayName}</UserName>
						)}

						{!user.displayName && (
							<UserEmail>{user?.email}</UserEmail>
						)}

						<UserInfo>{`${userRole.toUpperCase()}`}</UserInfo>
					</TextContainer>
				</>
			)}
		</Container>
	);
};

export default Info;
