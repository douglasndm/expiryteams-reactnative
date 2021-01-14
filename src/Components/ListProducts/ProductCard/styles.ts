import styled, { css } from 'styled-components/native';

interface ICard {
    expired?: boolean;
    nextToExp?: boolean;
}

interface IProductInfo {
    expiredOrNext?: boolean;
}

export const Container = styled.View``;

export const Card = styled.TouchableOpacity<ICard>`
    background-color: white;
    margin: 3px 6px;
    border-radius: 12px;

    padding: 15px;

    elevation: 2;

    background: ${(props) => props.theme.colors.productBackground}
        ${(props) =>
            props.nextToExp &&
            css`
                background-color: ${props.theme.colors
                    .productNextToExpBackground};
            `}
        ${(props) =>
            props.expired &&
            css`
                background-color: ${props.theme.colors
                    .productExpiredBackground};
            `};
`;

export const ProductDetails = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

export const ProductDetailsContainer = styled.View`
    max-width: 65%;
`;

export const ProductName = styled.Text<IProductInfo>`
    font-size: 22px;
    font-weight: bold;

    color: ${(props) =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;

export const ProductInfoItem = styled.Text<IProductInfo>`
    color: rgba(0, 0, 0, 0.3);
    font-size: 12px;
    margin-left: 2px;

    color: ${(props) =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;

export const ProductExpDate = styled.Text<IProductInfo>`
    font-size: 16px;
    margin-left: 2px;
    margin-top: 5px;

    color: ${(props) =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;

export const LoteDetailsContainer = styled.View`
    max-width: 35%;
    flex-direction: column;
`;

export const AmountContainer = styled.View`
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`;

export const AmountContainerText = styled.Text<IProductInfo>`
    font-size: 16px;

    color: ${(props) =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;

export const Amount = styled.Text<IProductInfo>`
    font-size: 22px;
    font-weight: bold;
    margin-top: 5px;

    color: ${(props) =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;

export const PriceContainer = styled.View`
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`;

export const PriceContainerText = styled.Text<IProductInfo>`
    font-size: 16px;

    color: ${(props) =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;

export const Price = styled.Text<IProductInfo>`
    font-size: 22px;
    font-weight: bold;
    margin-top: 5px;

    color: ${(props) =>
        props.expiredOrNext
            ? props.theme.colors.productNextOrExpiredText
            : props.theme.colors.text};
`;
