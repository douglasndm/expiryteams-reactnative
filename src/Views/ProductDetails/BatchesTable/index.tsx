import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { isPast, addDays, format } from 'date-fns';//eslint-disable-line
import br from 'date-fns/locale/pt-BR'; //eslint-disable-line
import NumberFormat from 'react-number-format';

import PreferencesContext from '../../../Contexts/PreferencesContext';

import {
    Table,
    TableHeader,
    TableTitle,
    TableRow,
    TableCell,
    Text,
} from './styles';

interface BatchesTableProps {
    productId: number;
    batches: Array<ILote>;
}

const BatchesTable: React.FC<BatchesTableProps> = ({
    productId,
    batches,
}: BatchesTableProps) => {
    const { userPreferences } = useContext(PreferencesContext);

    const { navigate } = useNavigation();

    return (
        <Table>
            <TableHeader>
                <TableTitle>LOTE</TableTitle>
                <TableTitle>VENCIMENTO</TableTitle>
                <TableTitle>QUANTIDADE</TableTitle>
                <TableTitle>PREÇO</TableTitle>
            </TableHeader>

            {batches.map((batch) => {
                const expired = isPast(batch.exp_date);
                const nextToExp =
                    addDays(
                        new Date(),
                        userPreferences.howManyDaysToBeNextToExpire
                    ) > batch.exp_date;

                const expiredOrNext = !!(expired || nextToExp);
                const treated = batch.status === 'Tratado';

                return (
                    <TableRow
                        key={batch.id}
                        expired={expired}
                        nextToExp={nextToExp}
                        treated={treated}
                        onPress={() => {
                            navigate('EditLote', {
                                productId,
                                loteId: batch.id,
                            });
                        }}
                    >
                        <TableCell>
                            <Text expiredOrNext={expiredOrNext}>
                                {batch.lote}
                            </Text>
                        </TableCell>
                        <TableCell>
                            <Text expiredOrNext={expiredOrNext}>
                                {format(batch.exp_date, 'dd/MM/yyyy', {
                                    locale: br,
                                })}
                            </Text>
                        </TableCell>
                        <TableCell>
                            <Text expiredOrNext={expiredOrNext}>
                                {batch.amount}
                            </Text>
                        </TableCell>
                        {!!batch.amount && !!batch.price && batch.price > 0 && (
                            <TableCell>
                                <Text expiredOrNext={expiredOrNext}>
                                    <NumberFormat
                                        value={batch.amount * batch.price}
                                        displayType="text"
                                        thousandSeparator
                                        prefix="R$"
                                        renderText={(value) => value}
                                        decimalScale={2}
                                    />
                                </Text>
                            </TableCell>
                        )}
                    </TableRow>
                );
            })}
        </Table>
    );
};

export default BatchesTable;
