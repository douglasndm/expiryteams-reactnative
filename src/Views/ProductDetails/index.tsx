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
import { useTheme } from 'styled-components';
import { Button } from 'react-native-paper';
import RNFS, { exists } from 'react-native-fs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { translate } from '../../Locales';

import StatusBar from '../../Components/StatusBar';
import Loading from '../../Components/Loading';
import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';
import Notification from '../../Components/Notification';

import { getProductById, deleteProduct } from '../../Functions/Product';
import { sortLoteByExpDate } from '../../Functions/Lotes';

import {
    Container,
    PageHeader,
    ProductDetailsContainer,
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
    PageContent,
    ButtonPaper,
    Icons,
    CategoryDetails,
    CategoryDetailsText,
    TableContainer,
    Text,
    DialogPaper,
    FloatButton,
} from './styles';

import PreferencesContext from '../../Contexts/PreferencesContext';

import BatchTable from './Components/BatchesTable';

interface Request {
    route: {
        params: {
            id: number;
        };
    };
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
    const { userPreferences } = useContext(PreferencesContext);

    const { navigate, goBack, reset } = useNavigation();

    const productId = useMemo(() => {
        return route.params.id;
    }, [route.params.id]);

    const theme = useTheme();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [product, setProduct] = useState<IProduct>();

    const [lotes, setLotes] = useState<Array<ILote>>([]);
    const [lotesTratados, setLotesTratados] = useState<Array<ILote>>([]);
    const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<ILote>>([]);

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const getProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getProductById(productId);

            if (result.photo) {
                const pathExists = await exists(result.photo);

                if (pathExists) {
                    setPhoto(`file://${result.photo}`);
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

    const handleDeleteProduct = useCallback(async () => {
        try {
            await deleteProduct(productId);

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'Success', params: { type: 'delete_product' } },
                ],
            });
        } catch (err) {
            setError(err.message);
        }
    }, [productId, reset]);

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
                photoPath: product.photo,
            });
        }
    }, [navigate, product]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <StatusBar />
                <ScrollView>
                    <PageHeader>
                        <ProductDetailsContainer>
                            <PageTitleContent>
                                <BackButton handleOnPress={goBack} />
                                <PageTitle>
                                    {translate('View_ProductDetails_PageTitle')}
                                </PageTitle>
                            </PageTitleContent>

                            <ProductContainer>
                                {photo && (
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
                                            {translate(
                                                'View_ProductDetails_Code'
                                            )}
                                            : {code}
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
                                </ProductInformationContent>
                            </ProductContainer>
                        </ProductDetailsContainer>

                        <ActionsButtonContainer>
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="create-outline" size={22} />
                                )}
                                onPress={() => handleEdit()}
                            >
                                {translate(
                                    'View_ProductDetails_Button_UpdateProduct'
                                )}
                            </ButtonPaper>
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="trash-outline" size={22} />
                                )}
                                onPress={() => {
                                    setDeleteComponentVisible(true);
                                }}
                            >
                                {translate(
                                    'View_ProductDetails_Button_DeleteProduct'
                                )}
                            </ButtonPaper>
                        </ActionsButtonContainer>
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

            <DialogPaper
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
            >
                <DialogPaper.Title style={{ color: theme.colors.text }}>
                    {translate('View_ProductDetails_WarningDelete_Title')}
                </DialogPaper.Title>
                <DialogPaper.Content>
                    <Text style={{ color: theme.colors.text }}>
                        {translate('View_ProductDetails_WarningDelete_Message')}
                    </Text>
                </DialogPaper.Content>
                <DialogPaper.Actions>
                    <Button color="red" onPress={handleDeleteProduct}>
                        {translate(
                            'View_ProductDetails_WarningDelete_Button_Confirm'
                        )}
                    </Button>
                    <Button
                        color={theme.colors.accent}
                        onPress={() => {
                            setDeleteComponentVisible(false);
                        }}
                    >
                        {translate(
                            'View_ProductDetails_WarningDelete_Button_Cancel'
                        )}
                    </Button>
                </DialogPaper.Actions>
            </DialogPaper>
        </>
    );
};

export default ProductDetails;
