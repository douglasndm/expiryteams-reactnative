import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import DocumentPicker from 'react-native-document-picker';

import sharedStrings from '@shared/Locales';
import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { exportToExcel } from '@utils/Excel/Export';
import { importExportFileFromApp } from '@teams/Functions/ImportExport';

import { getAllProducts } from '@teams/Functions/Products/Products';
import { getAllBrands } from '@teams/Functions/Brand';
import { getAllCategoriesFromTeam } from '@teams/Functions/Categories';
import { getAllStoresFromTeam } from '@teams/Functions/Team/Stores/AllStores';

import Header from '@components/Header';
import Button from '@components/Button';
import PaddingComponent from '@components/PaddingComponent';

import {
	Container,
	Content,
	ExportOptionContainer,
	ExportExplain,
} from '@views/Export/styles';

const Export: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const teamContext = useTeam();

	const [isImporting, setIsImporting] = useState<boolean>(false);
	const [isExcelLoading, setIsExcelLoading] = useState<boolean>(false);

	const handleImport = useCallback(async () => {
		try {
			setIsImporting(true);

			await importExportFileFromApp();

			showMessage({
				message: 'Produtos importados',
				type: 'info',
			});

			reset({
				routes: [
					{
						name: 'Home',
					},
				],
			});
		} catch (err) {
			if (err instanceof Error)
				if (!DocumentPicker.isCancel(err))
					showMessage({
						message: err.message,
						type: 'danger',
					});
		} finally {
			setIsImporting(false);
		}
	}, [reset]);

	const handleExportToExcel = useCallback(async () => {
		try {
			setIsExcelLoading(true);

			const getProducts = async () =>
				getAllProducts({
					removeCheckedBatches: false,
				});
			const getBrands = async () => getAllBrands();
			const getCategories = async () => getAllCategoriesFromTeam();
			const getStores = async () => getAllStoresFromTeam();

			await exportToExcel({
				getProducts,
				getBrands,
				getCategories,
				getStores,
			});

			showMessage({
				message: sharedStrings.View_Export_Excel_SuccessMessage,
				type: 'info',
			});
		} catch (err) {
			if (err instanceof Error)
				if (!err.message.includes('did not share')) {
					showMessage({
						message: err.message,
						type: 'danger',
					});
				}
		} finally {
			setIsExcelLoading(false);
		}
	}, []);

	return (
		<Container>
			<Header title={strings.View_Export_PageTitle} noDrawer />

			<Content>
				{teamContext.roleInTeam?.role.toLowerCase() === 'manager' && (
					<ExportOptionContainer>
						<ExportExplain>
							Tem um arquivo de exportação gerado pelo Controle de
							Validade individual? É aqui que você vai adiciona-lo
							e copiar todos seus produtos para esta versão.
						</ExportExplain>

						<Button
							title="Selecionar arquivo"
							onPress={handleImport}
							isLoading={isImporting}
						/>
					</ExportOptionContainer>
				)}

				<ExportOptionContainer>
					<ExportExplain>
						{strings.View_Export_Explain_Excel}
					</ExportExplain>

					<Button
						title={strings.View_Export_Button_ExportExcel}
						onPress={handleExportToExcel}
						isLoading={isExcelLoading}
					/>
				</ExportOptionContainer>

				<PaddingComponent />
			</Content>
		</Container>
	);
};

export default Export;
