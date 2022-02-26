import React, { useState, useEffect, useCallback } from 'react';
import { ViewStyle } from 'react-native';

import strings from '~/Locales';

import { getAllStores } from '~/Functions/Stores';

import { PickerContainer, Picker } from '../styles';

interface Props {
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
    defaultValue?: string | null;
}

const Store: React.FC<Props> = ({
    onChange,
    containerStyle,
    defaultValue,
}: Props) => {
    const [selectedStore, setSelectedStore] = useState<string | null>(() => {
        if (defaultValue && defaultValue !== '') {
            return defaultValue;
        }
        return null;
    });

    const [stores, setStores] = useState<Array<IStoreItem>>([]);

    const handleOnChange = useCallback(
        value => {
            setSelectedStore(value);

            // call on change on parent to update value their
            onChange(value);
        },
        [onChange]
    );

    const loadData = useCallback(async () => {
        const allStores = await getAllStores();
        const storesArray: Array<IStoreItem> = [];

        allStores.forEach(store => {
            if (store.id) {
                storesArray.push({
                    key: store.id,
                    label: store.name,
                    value: store.id,
                });
            }
        });

        setStores(storesArray);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    return (
        <PickerContainer style={containerStyle}>
            <Picker
                items={stores}
                onValueChange={handleOnChange}
                value={selectedStore}
                placeholder={{
                    label: strings.View_AddProduct_InputPlacehoder_Store,
                    value: 'null',
                }}
            />
        </PickerContainer>
    );
};

export default Store;
