import XLSX from 'xlsx';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';

import { translate } from '../Locales';

import { shareFile } from './Share';
import { getAllProducts } from './Products';

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
    product: Omit<IProduct, 'Lotes'>;
    batch: ILote;
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

export async function exportToExcel(): Promise<void> {
    let dateFormat = 'dd/MM/yyyy';

    if (getLocales()[0].languageCode === 'en') {
        dateFormat = 'MM/dd/yyyy';
    }

    try {
        const excelExport: Array<exportModel> = [];

        const workbook = XLSX.utils.book_new();

        const allProducts = await getAllProducts({});

        allProducts.forEach((p) => {
            p.lotes.forEach((l) => {
                excelExport.push({
                    product: p,
                    batch: l,
                });
            });
        });

        const sortedProducts = sortProducts(excelExport);

        const excelRows: Array<ExcelRowProps> = [];

        sortedProducts.forEach((item) => {
            const row: any = {};

            row[translate('Function_Excel_ColumnName_ProductName')] =
                item.product.name;
            row[translate('Function_Excel_ColumnName_ProductCode')] =
                item.product.code || '';
            row[translate('Function_Excel_ColumnName_ProductStore')] =
                item.product.store || '';
            row[translate('Function_Excel_ColumnName_BatchName')] =
                item.batch.lote;
            row[translate('Function_Excel_ColumnName_BatchPrice')] =
                item.batch.price || 0;
            row[translate('Function_Excel_ColumnName_BatchAmount')] =
                item.batch.amount || 0;
            row[translate('Function_Excel_ColumnName_BatchExpDate')] = format(
                item.batch.exp_date,
                dateFormat
            );
            row.Tratado = item.batch.status === 'Tratado' ? 'Sim' : 'Não';

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
