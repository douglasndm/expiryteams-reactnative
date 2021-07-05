import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { exists } from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';
import Header from '~/Components/Header';

import { getProduct } from '~/Functions/Products/Product';

import { ShareProductImageWithText } from '~/Functions/Share';
import { getProductImagePath } from '~/Functions/Products/Image';

import {
    Container,
    PageHeader,
    ProductContainer,
    ProductInformationContent,
    ProductName,
    ProductCode,
    ProductInfo,
    ProductImageContainer,
    ProductImage,
    ActionsButtonContainer,
    ActionButton,
    PageContent,
    Icons,
    CategoryDetails,
    CategoryDetailsText,
    TableContainer,
    FloatButton,
} from './styles';

import BatchTable from './Components/BatchesTable';

interface Request {
    route: {
        params: {
            id: string;
        };
    };
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
    const { navigate } = useNavigation();

    const productId = useMemo(() => {
        return route.params.id;
    }, [route.params.id]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [photo, setPhoto] = useState<string | null>(null);
    const [product, setProduct] = useState<IProduct>();

    const [lotesTratados, setLotesTratados] = useState<Array<IBatch>>([]);
    const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<IBatch>>([]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getProduct({ productId });

            setProduct(response);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    const addNewLote = useCallback(() => {
        navigate('AddBatch', { productId });
    }, [navigate, productId]);

    const handleEdit = useCallback(() => {
        navigate('EditProduct', { product: JSON.stringify(product) });
    }, [navigate, product]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (product) {
            setLotesTratados(() =>
                product?.batches.filter(batch => batch.status === 'checked')
            );

            setLotesNaoTratados(() =>
                product?.batches.filter(batch => batch.status !== 'checked')
            );
        }
    }, [product]);

    const handleOnPhotoPress = useCallback(() => {
        if (product && product.photo) {
            navigate('PhotoView', {
                productId,
            });
        }
    }, [navigate, product, productId]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <StatusBar />
                <Header
                    title={strings.View_ProductDetails_PageTitle}
                    noDrawer
                />
                <PageHeader>
                    {!!product && (
                        <ProductContainer>
                            {!!photo && (
                                <ProductImageContainer
                                    onPress={handleOnPhotoPress}
                                >
                                    <ProductImage
                                        source={{
                                            uri: photo,
                                        }}
                                    />
                                </ProductImageContainer>
                            )}
                            <ProductInformationContent>
                                <ProductName>
                                    {!!product && product?.name}
                                </ProductName>
                                {!!product.code && product?.code && (
                                    <ProductCode>
                                        {strings.View_ProductDetails_Code}:{' '}
                                        {product.code}
                                    </ProductCode>
                                )}
                                <ProductInfo>
                                    {product.categories.length > 0 &&
                                        `${strings.View_ProductDetails_Categories}: ${product.categories[0].name}`}
                                </ProductInfo>

                                <ActionsButtonContainer>
                                    <ActionButton
                                        icon={() => (
                                            <Icons
                                                name="create-outline"
                                                size={22}
                                            />
                                        )}
                                        onPress={handleEdit}
                                    >
                                        {
                                            strings.View_ProductDetails_Button_UpdateProduct
                                        }
                                    </ActionButton>
                                </ActionsButtonContainer>
                            </ProductInformationContent>
                        </ProductContainer>
                    )}
                </PageHeader>

                <PageContent>
                    {lotesNaoTratados.length > 0 && (
                        <TableContainer>
                            <CategoryDetails>
                                <CategoryDetailsText>
                                    {
                                        strings.View_ProductDetails_TableTitle_NotTreatedBatches
                                    }
                                </CategoryDetailsText>
                            </CategoryDetails>

                            <BatchTable
                                batches={lotesNaoTratados}
                                product={JSON.stringify(product)}
                            />
                        </TableContainer>
                    )}

                    {lotesTratados.length > 0 && (
                        <>
                            <CategoryDetails>
                                <CategoryDetailsText>
                                    {
                                        strings.View_ProductDetails_TableTitle_TreatedBatches
                                    }
                                </CategoryDetailsText>
                            </CategoryDetails>

                            <BatchTable
                                batches={lotesTratados}
                                product={JSON.stringify(product)}
                            />
                        </>
                    )}
                </PageContent>
            </Container>

            <FloatButton
                icon={() => (
                    <Ionicons name="add-outline" color="white" size={22} />
                )}
                small
                label={strings.View_ProductDetails_FloatButton_AddNewBatch}
                onPress={addNewLote}
            />
        </>
    );
};

export default ProductDetails;
