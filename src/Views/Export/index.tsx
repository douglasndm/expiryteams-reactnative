import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import Header from '@components/Header';
import Button from '@components/Button';
import PaddingComponent from '@components/PaddingComponent';

import {
	Container,
	Content,
	ExportOptionContainer,
	ExportExplain,
	RadioButtonGroupContainer,
	SortTitle,
	RadioButtonContainer,
	RadioButton,
	RadioButtonText,
} from '@views/Export/styles';

import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { importExportFileFromApp } from '~/Functions/ImportExport';
import { exportToExcel } from '~/Functions/Excel';

const Export: React.FC = () => {
	const { reset } = useNavigation();

	const teamContext = useTeam();

	const [checked, setChecked] = React.useState('created_at');

	const [isImporting, setIsImporting] = useState<boolean>(false);
	const [isExcelLoading, setIsExcelLoading] = useState<boolean>(false);

	const handleImport = useCallback(async () => {
		if (!teamContext.id) {
			return;
		}

		try {
			setIsImporting(true);

			await importExportFileFromApp({
				team_id: teamContext.id,
			});

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
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsImporting(false);
		}
	}, [reset, teamContext.id]);

	const handleExportToExcel = useCallback(async () => {
		try {
			setIsExcelLoading(true);

			if (checked === 'created_at') {
				await exportToExcel({ sortBy: 'created_date' });
			} else {
				await exportToExcel({ sortBy: 'expire_date' });
			}

			showMessage({
				message: 'Arquivo excel gerado com sucesso',
				type: 'info',
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsExcelLoading(false);
		}
	}, [checked]);

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
							text="Selecionar arquivo"
							onPress={handleImport}
							isLoading={isImporting}
						/>
					</ExportOptionContainer>
				)}

				<ExportOptionContainer>
					<ExportExplain>
						{strings.View_Export_Explain_Excel}
					</ExportExplain>
					<RadioButtonGroupContainer>
						<SortTitle>{strings.View_Export_SortTitle}</SortTitle>
						<RadioButtonContainer>
							<RadioButtonText>
								{strings.View_Export_SortByCreatedDate}
							</RadioButtonText>
							<RadioButton
								value="created_at"
								status={
									checked === 'created_at'
										? 'checked'
										: 'unchecked'
								}
								onPress={() => setChecked('created_at')}
							/>
						</RadioButtonContainer>

						<RadioButtonContainer>
							<RadioButtonText>
								{strings.View_Export_SortByExpireDate}
							</RadioButtonText>
							<RadioButton
								value="expire_in"
								status={
									checked === 'expire_in'
										? 'checked'
										: 'unchecked'
								}
								onPress={() => setChecked('expire_in')}
							/>
						</RadioButtonContainer>
					</RadioButtonGroupContainer>

					<Button
						text={strings.View_Export_Button_ExportExcel}
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
