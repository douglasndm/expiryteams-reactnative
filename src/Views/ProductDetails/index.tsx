import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import { exists } from 'react-native-fs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { translate } from '../../Locales';

import StatusBar from '../../Components/StatusBar';
import Loading from '../../Components/Loading';
import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';
import Notification from '../../Components/Notification';

import { getProductById } from '../../Functions/Product';
import { sortLoteByExpDate } from '../../Functions/Lotes';
import { isProImagesByRewards } from '~/Functions/Pro/Rewards/Images';

import {
    Container,
    PageHeader,
    ProductContainer,
    PageTitleContent,
    PageTitle,
    ProductInformationContent,
    ProductName,
    ProductCode,
    ProductStore,
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

import PreferencesContext from '../../Contexts/PreferencesContext';

import BatchTable from './Components/BatchesTable';
import { getProductImagePath } from '~/Functions/Products/Image';

interface Request {
    route: {
        params: {
            id: number;
        };
    };
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
    const { userPreferences } = useContext(PreferencesContext);

    const [isProByReward, setIsProByReward] = useState<boolean>(false);

    const { navigate, goBack } = useNavigation();

    const productId = useMemo(() => {
        return route.params.id;
    }, [route.params.id]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [product, setProduct] = useState<IProduct>();

    const [lotes, setLotes] = useState<Array<ILote>>([]);
    const [lotesTratados, setLotesTratados] = useState<Array<ILote>>([]);
    const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<ILote>>([]);

    useEffect(() => {
        isProImagesByRewards().then((response) => setIsProByReward(response));
    }, []);

    const getProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getProductById(productId);

            if (result.photo) {
                const imagePath = await getProductImagePath(productId);

                if (imagePath) {
                    const fileExists = await exists(imagePath);
                    if (fileExists) {
                        setPhoto(`file://${imagePath}`);
                    }
                }
            }

            if (!result || result === null) {
                goBack();
                return;
            }

            setProduct(result);

            setName(result.name);
            if (result.code) setCode(result.code);

            const lotesSorted = sortLoteByExpDate(result.lotes);

            setLotes(lotesSorted);
        } catch (err) {
            crashlytics().recordError(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [productId, goBack]);

    const addNewLote = useCallback(() => {
        navigate('AddLote', { productId });
    }, [navigate, productId]);

    const handleEdit = useCallback(() => {
        navigate('EditProduct', { productId });
    }, [navigate, productId]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    useEffect(() => {
        setLotesTratados(() =>
            lotes.filter((lote) => lote.status === 'Tratado')
        );

        setLotesNaoTratados(() =>
            lotes.filter((lote) => lote.status !== 'Tratado')
        );
    }, [lotes]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

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
                <ScrollView>
                    <PageHeader>
                        <PageTitleContent>
                            <BackButton handleOnPress={goBack} />
                            <PageTitle>
                                {translate('View_ProductDetails_PageTitle')}
                            </PageTitle>
                        </PageTitleContent>

                        <ProductContainer>
                            {(userPreferences.isUserPremium || isProByReward) &&
                                !!photo && (
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
                                <ProductName>{name}</ProductName>
                                {!!code && (
                                    <ProductCode>
                                        {translate('View_ProductDetails_Code')}:{' '}
                                        {code}
                                    </ProductCode>
                                )}
                                {userPreferences.multiplesStores &&
                                    !!product?.store && (
                                        <ProductStore>
                                            {translate(
                                                'View_ProductDetails_Store'
                                            )}
                                            : {product.store}
                                        </ProductStore>
                                    )}

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
                                        {translate(
                                            'View_ProductDetails_Button_UpdateProduct'
                                        )}
                                    </ActionButton>
                                </ActionsButtonContainer>
                            </ProductInformationContent>
                        </ProductContainer>
                    </PageHeader>

                    <PageContent>
                        {lotesNaoTratados.length > 0 && (
                            <TableContainer>
                                <CategoryDetails>
                                    <CategoryDetailsText>
                                        {translate(
                                            'View_ProductDetails_TableTitle_NotTreatedBatches'
                                        )}
                                    </CategoryDetailsText>
                                </CategoryDetails>

                                <BatchTable
                                    batches={lotesNaoTratados}
                                    productId={productId}
                                />
                            </TableContainer>
                        )}

                        {lotesTratados.length > 0 && (
                            <>
                                <CategoryDetails>
                                    <CategoryDetailsText>
                                        {translate(
                                            'View_ProductDetails_TableTitle_TreatedBatches'
                                        )}
                                    </CategoryDetailsText>
                                </CategoryDetails>

                                <BatchTable
                                    batches={lotesTratados}
                                    productId={productId}
                                />
                            </>
                        )}

                        <GenericButton
                            text={translate(
                                'View_ProductDetails_Button_AddNewBatch'
                            )}
                            onPress={() => {
                                navigate('AddLote', {
                                    productId,
                                });
                            }}
                        />
                    </PageContent>
                </ScrollView>
                {!!error && (
                    <Notification
                        NotificationMessage={error}
                        NotificationType="error"
                        onPress={handleDimissNotification}
                    />
                )}
            </Container>

            <FloatButton
                icon={() => (
                    <Ionicons name="add-outline" color="white" size={22} />
                )}
                small
                label={translate('View_ProductDetails_FloatButton_AddNewBatch')}
                onPress={addNewLote}
            />
        </>
    );
};

export default ProductDetails;
