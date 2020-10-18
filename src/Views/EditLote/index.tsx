import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { RadioButton, Dialog } from 'react-native-paper';
import { useTheme } from 'styled-components';

import { updateLote, deleteLote } from '../../Functions/Lotes';

import GenericButton from '../../Components/Button';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
    NumericInputField,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
} from '../AddProduct/styles';

import { Button, Icons } from './styles';

import { ProductHeader, ProductName, ProductCode } from '../AddLote/styles';

interface EditLoteProps {
    route: {
        params: {
            product: IProduct;
            loteId: number;
        };
    };
}

const EditLote: React.FC<EditLoteProps> = ({ route }: EditLoteProps) => {
    const { product, loteId } = route.params;

    const navigation = useNavigation();

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const theme = useTheme();

    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    const [expDate, setExpDate] = useState(new Date());
    const [tratado, setTratado] = useState(false);

    async function handleSave() {
        if (!lote || lote.trim() === '') {
            Alert.alert('Digite o nome do lote');
            return;
        }

        try {
            await updateLote({
                id: loteId,
                lote,
                amount,
                exp_date: expDate,
                price,
                status: tratado ? 'Tratado' : 'Não tratado',
            });

            Alert.alert('Lote editado!');
            navigation.goBack();
        } catch (err) {
            console.warn(err);
        }
    }

    async function handleDelete() {
        try {
            await deleteLote(loteId);

            Alert.alert(`O lote ${lote} foi apagado.`);
            navigation.dispatch(StackActions.popToTop());
        } catch (err) {
            console.warn(err);
        }
    }

    useEffect(() => {
        const loteResult = product.lotes.find((l) => l.id === loteId);

        if (!loteResult) {
            throw new Error('Lote não encontrado!');
        }

        const loteStatus = loteResult.status === 'Tratado';

        setLote(loteResult.lote);
        setExpDate(loteResult.exp_date);
        setTratado(loteStatus);

        if (loteResult.amount) setAmount(loteResult.amount);
        if (loteResult.price) setPrice(loteResult.price);
    }, []);

    return (
        <>
            <Container>
                <ScrollView>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                marginLeft: -15,
                            }}
                        >
                            <Button
                                style={{
                                    alignSelf: 'flex-end',
                                }}
                                icon={() => (
                                    <Icons
                                        name="arrow-back-outline"
                                        size={28}
                                    />
                                )}
                                compact
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                            <PageTitle>Editar lote</PageTitle>
                        </View>

                        <Button
                            icon={() => (
                                <Icons name="trash-outline" size={22} />
                            )}
                            onPress={() => {
                                setDeleteComponentVisible(true);
                            }}
                        >
                            Apagar
                        </Button>
                    </View>

                    <InputContainer>
                        <ProductHeader>
                            <ProductName>{product.name}</ProductName>
                            {product.code && (
                                <ProductCode>{product.code}</ProductCode>
                            )}
                        </ProductHeader>

                        <InputGroup>
                            <InputText
                                style={{
                                    flex: 5,
                                    marginRight: 5,
                                }}
                                placeholder="Lote"
                                value={lote}
                                onChangeText={(value) => setLote(value)}
                            />
                            <InputText
                                style={{
                                    flex: 4,
                                }}
                                placeholder="Quantidade"
                                keyboardType="numeric"
                                value={String(amount)}
                                onChangeText={(v) => {
                                    const regex = /^[0-9\b]+$/;

                                    if (v === '' || regex.test(v)) {
                                        setAmount(Number(v));
                                    }
                                }}
                            />
                        </InputGroup>

                        <NumericInputField
                            type="currency"
                            locale="pt-BR"
                            currency="BRL"
                            value={price}
                            onUpdate={(value: number) => setPrice(value)}
                            placeholder="Valor unitário"
                        />

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <RadioButton
                                    value="tratado"
                                    status={
                                        tratado === true
                                            ? 'checked'
                                            : 'unchecked'
                                    }
                                    onPress={() => setTratado(true)}
                                    color={theme.colors.accent}
                                />
                                <Text style={{ color: theme.colors.text }}>
                                    Tratado
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <RadioButton
                                    value="Não tratado"
                                    status={
                                        tratado === !true
                                            ? 'checked'
                                            : 'unchecked'
                                    }
                                    onPress={() => setTratado(false)}
                                    color={theme.colors.accent}
                                />
                                <Text style={{ color: theme.colors.text }}>
                                    Não tratado
                                </Text>
                            </View>
                        </View>

                        <ExpDateGroup>
                            <ExpDateLabel>Data de vencimento</ExpDateLabel>
                            <CustomDatePicker
                                date={expDate}
                                onDateChange={(value) => {
                                    setExpDate(value);
                                }}
                                fadeToColor="none"
                                mode="date"
                                locale="pt-br"
                            />
                        </ExpDateGroup>
                    </InputContainer>

                    <GenericButton text="Salvar" onPress={handleSave} />
                </ScrollView>
            </Container>

            <Dialog
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
                style={{ backgroundColor: theme.colors.productBackground }}
            >
                <Dialog.Title>Você tem certeza?</Dialog.Title>
                <Dialog.Content>
                    <Text style={{ color: theme.colors.text }}>
                        Se continuar você irá apagar este lote
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button color="red" onPress={handleDelete}>
                        APAGAR
                    </Button>
                    <Button
                        color={theme.colors.accent}
                        onPress={() => {
                            setDeleteComponentVisible(false);
                        }}
                    >
                        MANTER
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </>
    );
};

export default EditLote;
