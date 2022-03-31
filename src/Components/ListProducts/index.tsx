import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Dialog from 'react-native-dialog';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import {
    deleteManyProducts,
    sortProductsByBatchesExpDate,
} from '~/Functions/Products/Products';
import {
    sortBatches,
    removeCheckedBatches,
} from '~/Functions/Products/Batches';

import ProductItem from './ProductContainer';

import {
    Container,
    ActionButtonsContainer,
    CategoryDetails,
    CategoryDetailsText,
    EmptyListText,
    FloatButton,
    Icons,
    InvisibleComponent,
    ProductContainer,
    SelectButtonContainer,
    SelectButton,
    SelectIcon,
    ButtonPaper,
} from './styles';

interface RequestProps {
    products: Array<IProduct>;
    onRefresh?: () => void;
    deactiveFloatButton?: boolean;
    sortProdsByBatchExpDate?: boolean;
    listRef?: React.RefObject<FlatList<IProduct>>;
}

const ListProducts: React.FC<RequestProps> = ({
    products,
    onRefresh,
    deactiveFloatButton,
    sortProdsByBatchExpDate,
    listRef,
}: RequestProps) => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const teamContext = useTeam();

    const [refreshing, setRefreshing] = React.useState<boolean>(false);

    const [prods, setProds] = useState<Array<IProduct>>([]);
    const [selectedProds, setSelectedProds] = useState<Array<string>>([]);
    const [selectMode, setSelectMode] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const isAdmin = useMemo(() => {
        const role = teamContext.roleInTeam?.role.toLowerCase();
        if (role === 'manager' || role === 'supervisor') {
            return true;
        }
        return false;
    }, [teamContext.roleInTeam]);

    const sortProducts = useMemo(() => sortProdsByBatchExpDate, [
        sortProdsByBatchExpDate,
    ]);

    useEffect(() => {
        if (products) {
            if (sortProducts === true) {
                if (sortProducts === true) {
                    const sortedProducts = sortProductsByBatchesExpDate({
                        products,
                    });

                    setProds(sortedProducts);
                    return;
                }
            }

            setProds(products);
        }
    }, [products, sortProducts]);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct', {});
    }, [navigate]);

    const ListHeader = useCallback(() => {
        return (
            <View>
                {/* Verificar se há items antes de criar o titulo */}
                {prods.length > 0 && (
                    <CategoryDetails>
                        <CategoryDetailsText>
                            {
                                strings.ListProductsComponent_Title_ProductsNextToExp
                            }
                        </CategoryDetailsText>
                    </CategoryDetails>
                )}
            </View>
        );
    }, [prods]);

    const EmptyList = useCallback(() => {
        return (
            <EmptyListText>
                {strings.ListProductsComponent_Title_NoProductsInList}
            </EmptyListText>
        );
    }, []);

    const FooterButton = useCallback(() => {
        return <InvisibleComponent />;
    }, []);

    const switchSelectedItem = useCallback(
        (productId: string) => {
            const isChecked = selectedProds.find(id => id === productId);

            if (!isChecked) {
                const prodsIds = [...selectedProds, productId];

                setSelectedProds(prodsIds);
                return;
            }

            const newSelected = selectedProds.filter(id => id !== productId);
            setSelectedProds(newSelected);
        },
        [selectedProds]
    );

    const handleEnableSelectMode = useCallback(() => {
        if (isAdmin) setSelectMode(true);
    }, [isAdmin]);

    const handleDisableSelectMode = useCallback(() => {
        setSelectMode(false);
    }, []);

    const renderComponent = useCallback(
        ({ item }) => {
            const product: IProduct = item as IProduct;
            product.batches = sortBatches(product.batches);
            product.batches = removeCheckedBatches(product.batches);

            const isChecked = selectedProds.find(id => id === product.id);

            return (
                <ProductContainer onLongPress={handleEnableSelectMode}>
                    {selectMode && (
                        <SelectButtonContainer>
                            <SelectButton
                                onPress={() => switchSelectedItem(product.id)}
                            >
                                {isChecked ? (
                                    <SelectIcon name="checkmark-circle-outline" />
                                ) : (
                                    <SelectIcon name="ellipse-outline" />
                                )}
                            </SelectButton>
                        </SelectButtonContainer>
                    )}
                    <ProductItem
                        product={product}
                        handleEnableSelect={handleEnableSelectMode}
                    />
                </ProductContainer>
            );
        },
        [handleEnableSelectMode, selectMode, selectedProds, switchSelectedItem]
    );

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        if (onRefresh) {
            onRefresh();
        }
        setRefreshing(false);
    }, [onRefresh]);

    const handleSwitchDeleteModal = useCallback(() => {
        setDeleteModal(!deleteModal);
    }, [deleteModal]);

    const handleDeleteMany = useCallback(async () => {
        if (selectedProds.length <= 0) {
            handleDisableSelectMode();
            setDeleteModal(false);
            return;
        }
        try {
            if (!teamContext.id) {
                return;
            }

            await deleteManyProducts({
                productsIds: selectedProds,
                team_id: teamContext.id,
            });

            if (onRefresh) onRefresh();
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        }
    }, [handleDisableSelectMode, onRefresh, selectedProds, teamContext.id]);

    return (
        <Container>
            {selectMode && isAdmin && (
                <ActionButtonsContainer>
                    <ButtonPaper
                        icon={() => <Icons name="trash-outline" />}
                        onPress={handleSwitchDeleteModal}
                    >
                        Apagar selecionados
                    </ButtonPaper>

                    <ButtonPaper
                        icon={() => <Icons name="exit-outline" />}
                        onPress={handleDisableSelectMode}
                    >
                        Cancelar seleção
                    </ButtonPaper>
                </ActionButtonsContainer>
            )}
            <FlatList
                ref={listRef}
                data={prods}
                keyExtractor={item => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={renderComponent}
                ListEmptyComponent={EmptyList}
                initialNumToRender={10}
                ListFooterComponent={FooterButton}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />

            {!deactiveFloatButton && (
                <FloatButton
                    icon={() => (
                        <Icons name="add-outline" color="white" size={22} />
                    )}
                    small
                    label={strings.View_FloatMenu_AddProduct}
                    onPress={handleNavigateAddProduct}
                />
            )}

            <Dialog.Container
                visible={deleteModal}
                onBackdropPress={handleSwitchDeleteModal}
            >
                <Dialog.Title>
                    {strings.View_EditBatch_WarningDelete_Title}
                </Dialog.Title>
                <Dialog.Description>
                    Você está preste a apagar VÁRIOS PRODUTOS, essa ação não
                    pode ser revertida
                </Dialog.Description>
                <Dialog.Button
                    label="Manter produtos"
                    onPress={handleSwitchDeleteModal}
                />
                <Dialog.Button
                    label={strings.View_EditBatch_WarningDelete_Button_Confirm}
                    color="red"
                    onPress={handleDeleteMany}
                />
            </Dialog.Container>
        </Container>
    );
};

export default ListProducts;
