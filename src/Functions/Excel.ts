import XLSX from 'xlsx';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';

import { translate } from '../Locales';

import { getAllProducts } from './Products/Products';
import { getSelectedTeam } from './Team/SelectedTeam';
import { shareFile } from './Share';

interface ExcelRowProps {
    produto: string;
    codigo: string;
    loja: string;
    lote: string;
    vencimento: Date;
    quantidade: number;
    preço: number;
}

interface exportModel {
    product: Omit<IProduct, 'batches'>;
    batch: IBatch;
}

function sortProducts(products: Array<exportModel>): Array<exportModel> {
    const sorted: Array<exportModel> = [];

    if (products.length > 2) {
        const lotesSorted = products.sort((p1, p2) => {
            if (p1.batch.exp_date > p2.batch.exp_date) return 1;
            if (p1.batch.exp_date < p2.batch.exp_date) return -1;
            return 0;
        });

        return lotesSorted;
    }
    return sorted;
}

interface exportProps {
    sortBy: 'created_date' | 'expire_date';
}

export async function exportToExcel({ sortBy }: exportProps): Promise<void> {
    let dateFormat = 'dd/MM/yyyy';

    if (getLocales()[0].languageCode === 'en') {
        dateFormat = 'MM/dd/yyyy';
    }

    const selectedTeam = await getSelectedTeam();

    try {
        const excelExport: Array<exportModel> = [];

        const workbook = XLSX.utils.book_new();

        const allProducts = await getAllProducts({
            team_id: selectedTeam.team.id,
        });

        if ('error' in allProducts) {
            throw new Error(allProducts.error);
        }

        allProducts.forEach(p => {
            p.batches.forEach(l => {
                excelExport.push({
                    product: p,
                    batch: l,
                });
            });
        });

        let sortedProducts;

        if (sortBy === 'expire_date') {
            sortedProducts = sortProducts(excelExport);
        } else {
            sortedProducts = excelExport;
        }

        const excelRows: Array<ExcelRowProps> = [];

        sortedProducts.forEach(item => {
            const row: any = {};

            row[translate('Function_Excel_ColumnName_ProductName')] =
                item.product.name;
            row[translate('Function_Excel_ColumnName_ProductCode')] =
                item.product.code || '';
            row[translate('Function_Excel_ColumnName_BatchName')] =
                item.batch.name;
            row[translate('Function_Excel_ColumnName_BatchPrice')] =
                item.batch.price || 0;
            row[translate('Function_Excel_ColumnName_BatchAmount')] =
                item.batch.amount || 0;
            row[translate('Function_Excel_ColumnName_BatchExpDate')] = format(
                new Date(item.batch.exp_date),
                dateFormat
            );
            row.Tratado = item.batch.status === 'checked' ? 'Sim' : 'Não';

            excelRows.push(row);
        });

        const worksheet = XLSX.utils.json_to_sheet(excelRows);

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            translate('Function_Excel_Workbook_Name')
        );

        const wbout = XLSX.write(workbook, {
            type: 'base64',
            bookType: 'xlsx',
        });

        await shareFile({
            fileAsString: wbout,
            fileName: translate('Function_Excel_filename'),
            fileExtesion: 'xlsx',
            encoding: 'base64',
        });
    } catch (err) {
        throw new Error(err);
    }
}
