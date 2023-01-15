import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
	flex: 1;
	background-color: '#fff';
	align-items: center;
	padding: 10px;
	justify-content: center;
`;

export const IntroTitle = styled.Text`
	font-size: 25px;
	color: white;
	text-align: center;
	margin-bottom: 16px;
	font-weight: bold;
`;

export const IntroImage = styled.Image`
	width: 200px;
	height: 200px;
`;

export const IntroText = styled.Text`
	font-size: 18px;
	color: white;
	text-align: center;
	padding: 30px 10px;
`;
