import React, { useState, useCallback } from 'react';
import { ViewStyle } from 'react-native';

import strings from '~/Locales';

import { PickerContainer, Picker } from '../styles';

interface Props {
    categories: ICategoryItem[];
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
    defaultValue?: string | null;
}

const CategorySelect: React.FC<Props> = ({
    categories,
    onChange,
    containerStyle,
    defaultValue,
}: Props) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        () => {
            if (defaultValue && defaultValue !== '') {
                return defaultValue;
            }
            return null;
        }
    );

    const handleOnChange = useCallback(
        value => {
            setSelectedCategory(value);

            // call on change on parent to update value their
            onChange(value);
        },
        [onChange]
    );

    return (
        <PickerContainer style={containerStyle}>
            <Picker
                items={categories}
                onValueChange={handleOnChange}
                value={selectedCategory}
                placeholder={{
                    label:
                        strings.View_AddProduct_InputPlaceholder_SelectCategory,
                    value: 'null',
                }}
            />
        </PickerContainer>
    );
};

export default CategorySelect;
