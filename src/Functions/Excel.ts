import XLSX from 'xlsx';

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

export async function exportToExcel(): Promise<void> {
    try {
        const workbook = XLSX.utils.book_new();

        const products = await getAllProducts({});

        const excelRows: Array<ExcelRowProps> = [];

        products.forEach((product) => {
            product.lotes.forEach((batch) => {
                const row: any = {};

                row[translate('Function_Excel_ColumnName_ProductName')] =
                    product.name;
                row[translate('Function_Excel_ColumnName_ProductCode')] =
                    product.code || '';
                row[translate('Function_Excel_ColumnName_ProductStore')] =
                    product.store || '';
                row[translate('Function_Excel_ColumnName_BatchName')] =
                    batch.lote;
                row[translate('Function_Excel_ColumnName_BatchPrice')] =
                    batch.price || 0;
                row[translate('Function_Excel_ColumnName_BatchAmount')] =
                    batch.amount || 0;
                row[translate('Function_Excel_ColumnName_BatchExpDate')] =
                    batch.exp_date;

                excelRows.push(row);
            });
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
