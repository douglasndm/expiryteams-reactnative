import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

interface ICard {
    expired?: boolean;
    nextToExp?: boolean;
    threated?: boolean;
}

interface IProductInfo {
    expiredOrNext?: boolean;
}

export const Card = styled(RectButton)<ICard>`
    flex-direction: column;

    margin: 3px 6px;
    padding: 15px;
    border-radius: 12px;

    elevation: 2;

    background-color: ${props => props.theme.colors.productBackground};

    ${props =>
        props.nextToExp &&
        css`
            background-color: ${props.theme.colors.productNextToExpBackground};
        `};
    ${props =>
        props.expired &&
        css`
            background-color: ${props.theme.colors.productExpiredBackground};
        `};
    ${props =>
        props.threated &&
        css`
            background-color: ${props.theme.colors.productThreatedBackground};
        `};
`;

export const Content = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const ProductDetails = styled.View`
    flex-direction: column;
    justify-content: space-between;
`;

export const TextContainer = styled.View`
    flex-direction: column;
    flex: 1;
`;

export const ProductName = styled.Text<IProductInfo>`
    font-size: 22px;
    font-weight: bold;

    color: ${props =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;

export const ProductInfoItem = styled.Text<IProductInfo>`
    color: rgba(0, 0, 0, 0.3);
    font-size: 12px;
    margin-left: 2px;

    font-family: 'Open Sans';

    color: ${props =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;

export const ProductImage = styled.Image`
    width: 85px;
    height: 85px;
    border-radius: 42px;
    margin-right: 10px;
`;

export const ProductExpDate = styled.Text<IProductInfo>`
    font-size: 16px;
    margin-left: 2px;
    margin-top: 5px;

    color: ${props =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;
