import XLSX from 'xlsx';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';

import strings from '../Locales';

import { getAllProducts } from './Products/Products';
import { getSelectedTeam } from './Team/SelectedTeam';
import { getAllBrands } from './Brand';
import { getAllStoresFromTeam } from './Team/Stores/AllStores';
import { shareFile } from './Share';
import { getAllCategoriesFromTeam } from './Categories';

function sortProducts(products: Array<exportModel>): Array<exportModel> {
    const lotesSorted = products.sort((p1, p2) => {
        if (p1.batch.exp_date > p2.batch.exp_date) return 1;
        if (p1.batch.exp_date < p2.batch.exp_date) return -1;
        return 0;
    });

    return lotesSorted;
}

export async function exportToExcel({
    sortBy,
    category,
    brand,
    store,
}: exportProps): Promise<void> {
    let dateFormat = 'dd/MM/yyyy';

    if (getLocales()[0].languageCode === 'en') {
        dateFormat = 'MM/dd/yyyy';
    }

    const selectedTeam = await getSelectedTeam();

    if (!selectedTeam) {
        throw new Error('Team is now selected');
    }

    const excelExport: Array<exportModel> = [];

    const workbook = XLSX.utils.book_new();

    const allProducts = await getAllProducts({
        team_id: selectedTeam.userRole.team.id,
        removeCheckedBatches: false,
        sortByBatches: false,
    });

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

    if (category && category !== 'null') {
        sortedProducts = sortedProducts.filter(prod => {
            const findedCate = prod.product.categories.filter(
                c => c.id === category
            );

            if (findedCate.length > 0) {
                return true;
            }
            return false;
        });
    }

    if (brand && brand !== 'null') {
        sortedProducts = sortedProducts.filter(prod => {
            if (prod.product.brand === brand) {
                return true;
            }
            return false;
        });
    }

    if (store && store !== 'null') {
        sortedProducts = sortedProducts.filter(prod => {
            if (prod.product.store === store) {
                return true;
            }
            return false;
        });
    }

    const allBrands = await getAllBrands({
        team_id: selectedTeam.userRole.team.id,
    });

    const allStores = await getAllStoresFromTeam({
        team_id: selectedTeam.userRole.team.id,
    });

    const allCategories = await getAllCategoriesFromTeam({
        team_id: selectedTeam.userRole.team.id,
    });

    const excelRows: Array<ExcelRowProps> = [];

    sortedProducts.forEach(item => {
        const row: any = {};

        const findedBrand = allBrands.find(b => b.id === item.product.brand);
        const findedStore = allStores.find(s => s.id === item.product.store);
        const findedCategory = allCategories.find(cat => {
            const { categories } = item.product;
            if (categories.length <= 0) {
                return false;
            }

            if (categories[0].id === cat.id) {
                return true;
            }

            return false;
        });

        row[strings.Function_Excel_ColumnName_ProductStore] =
            findedStore?.name || '';
        row[strings.Function_Excel_ColumnName_ProductName] = item.product.name;
        row[strings.Function_Excel_ColumnName_ProductCode] =
            item.product.code || '';
        row[strings.Function_Excel_ColumnName_ProductBrand] =
            findedBrand?.name || '';
        row.Categoria = findedCategory?.name || '';
        row[strings.Function_Excel_ColumnName_BatchName] = item.batch.name;
        row[strings.Function_Excel_ColumnName_BatchPrice] =
            item.batch.price || 0;
        row[strings.Function_Excel_ColumnName_BatchAmount] =
            item.batch.amount || 0;
        row[strings.Function_Excel_ColumnName_BatchExpDate] = format(
            new Date(item.batch.exp_date),
            dateFormat
        );
        row.Tratado =
            item.batch.status === 'checked'
                ? strings.Function_Excel_ColumnName_Status_Checked
                : strings.Function_Excel_ColumnName_Status_Unchecked;

        excelRows.push(row);
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        strings.Function_Excel_Workbook_Name
    );

    const wbout = XLSX.write(workbook, {
        type: 'base64',
        bookType: 'xlsx',
    });

    await shareFile({
        fileAsString: wbout,
        fileName: strings.Function_Excel_filename,
        fileExtesion: 'xlsx',
        encoding: 'base64',
    });
}
