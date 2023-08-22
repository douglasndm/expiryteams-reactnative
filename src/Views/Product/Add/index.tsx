import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useContext,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';

import strings from '@teams/Locales';

import BarCodeReader from '@components/BarCodeReader';
import Header from '@components/Header';
import InputText from '@components/InputText';
import Dialog from '@components/Dialog';

import PreferencesContext from '@teams/Contexts/PreferencesContext';
import { useTeam } from '@teams/Contexts/TeamContext';

import { saveLocally } from '@utils/Images/SaveLocally';

import { createProduct } from '@teams/Functions/Products/Product';
import { createBatch } from '@teams/Functions/Products/Batches/Batch';
import { uploadImage } from '@teams/Functions/Product/Image';

import { findProductByCode } from '@teams/Functions/Products/FindByCode';
import { getExtraInfoForProducts } from '@teams/Functions/Products/ExtraInfo';
import { findDuplicate } from '@teams/Functions/Products/FindDuplicate';

import Loading from '@components/Loading';
import Camera from '@components/Camera';
import PaddingComponent from '@components/PaddingComponent';

import BrandSelect from '@teams/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '@teams/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '@teams/Components/Product/Inputs/Pickers/Store';

import FillModal from '@shared/Views/Product/Add/Components/FillModal';

import {
	CameraButtonContainer,
	ImageContainer,
	ProductImage,
	ProductImageContainer,
} from '@shared/Views/Product/Add/styles';
import {
	Container,
	PageContent,
	InputContainer,
	InputTextContainer,
	InputTextTip,
	Currency,
	InputGroup,
	MoreInformationsContainer,
	MoreInformationsTitle,
	ExpDateGroup,
	ExpDateLabel,
	CustomDatePicker,
	InputCodeTextContainer,
	Icon,
	InputTextLoading,
	InputCodeText,
	InputTextIconContainer,
	Content,
} from './styles';

interface Request {
	route: {
		params: {
			code?: string;
			category?: string;
			brand?: string;
			store?: string;
		};
	};
}

const Add: React.FC<Request> = ({ route }: Request) => {
	const { replace, navigate } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const { preferences } = useContext(PreferencesContext);
	const teamContext = useTeam();

	const [isMounted, setIsMounted] = useState(true);

	const locale = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'en-US';
		}
		return 'pt-BR';
	}, []);
	const currency = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'USD';
		}

		return 'BRL';
	}, []);

	const [name, setName] = useState('');
	const [batch, setBatch] = useState('');
	const [amount, setAmount] = useState('');
	const [price, setPrice] = useState<number | null>(null);
	const [expDate, setExpDate] = useState(new Date());
	const [photoPath, setPhotoPath] = useState('');

	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		() => {
			if (route.params && route.params.category) {
				return route.params.category;
			}
			return null;
		}
	);

	const [selectedBrand, setSelectedBrand] = useState<string | null>(() => {
		if (route.params && route.params.brand) {
			return route.params.brand;
		}
		return null;
	});

	const [selectedStore, setSelectedStore] = useState<string | null>(() => {
		if (route.params && route.params.store) {
			return route.params.store;
		}
		return null;
	});

	const [categories, setCategories] = useState<Array<IPickerItem>>([]);
	const [brands, setBrands] = useState<Array<IPickerItem>>([]);
	const [stores, setStores] = useState<Array<IPickerItem>>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [isFindingProd, setIsFindingProd] = useState<boolean>(false);

	const [productFinded, setProductFinded] = useState<boolean>(false);
	const [productNameFinded, setProductNameFinded] = useState<null | string>(
		null
	);
	const [showProdFindedModal, setShowProdFindedModal] = useState(false);
	const [showModalDuplicate, setShowModalDuplicate] = useState(false);

	const [nameFieldError, setNameFieldError] = useState<boolean>(false);
	const [codeFieldError, setCodeFieldError] = useState<boolean>(false);
	const [duplicateId, setDuplicateId] = useState('');

	const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);
	const [enableCamera, setEnableCamera] = useState(false);

	const handleCompleteInfo = useCallback(() => {
		if (productNameFinded?.trim()) {
			setName(productNameFinded.trim());
			setShowProdFindedModal(false);
		}
	}, [productNameFinded]);

	const completeInfo = useCallback(
		(prodName?: string) => {
			if (prodName) {
				setName(prodName.trim() || '');

				setShowProdFindedModal(false);
			} else if (productNameFinded) {
				setName(productNameFinded.trim());

				setShowProdFindedModal(false);
			}
		},
		[productNameFinded]
	);

	const findProductByEAN = useCallback(
		async (ean_code: string) => {
			const queryWithoutLetters = ean_code.replace(/\D/g, '').trim();
			const query = queryWithoutLetters.replace(/^0+/, ''); // Remove zero on begin

			if (query.length < 8) return;

			if (query.trim() !== '') {
				// if (getLocales()[0].languageCode === 'pt') {
				try {
					setIsFindingProd(true);

					if (query === '') return;

					const response = await findProductByCode(query);

					if (response !== null && !!response.name) {
						setProductFinded(true);
						setProductNameFinded(response.name);

						if (preferences.autoComplete) {
							completeInfo(response.name);
						}
					} else {
						setProductFinded(false);

						setProductNameFinded(null);
					}
				} finally {
					setIsFindingProd(false);
				}
				// }
			} else {
				setProductFinded(false);
			}
		},
		[completeInfo, preferences.autoComplete]
	);

	const [code, setCode] = useState(() => {
		if (route.params.code) {
			findProductByEAN(route.params.code);
			return route.params.code;
		}
		return '';
	});

	const loadData = useCallback(async () => {
		if (!isMounted) return;
		if (!teamContext.id) {
			showMessage({
				message: 'Team is not selected',
				type: 'danger',
			});
			return;
		}
		try {
			setIsLoading(true);
			const response = await getExtraInfoForProducts({
				team_id: teamContext.id,
			});

			const categoriesArray: Array<ICategoryItem> = [];
			response.availableCategories.forEach(cat =>
				categoriesArray.push({
					key: cat.id,
					label: cat.name,
					value: cat.id,
				})
			);
			setCategories(categoriesArray);

			const brandsArray: Array<IBrandItem> = [];

			response.availableBrands.forEach(brand =>
				brandsArray.push({
					key: brand.id,
					label: brand.name,
					value: brand.id,
				})
			);

			setBrands(brandsArray);

			const storesArray: Array<IPickerItem> = [];

			response.availableStores.forEach(store =>
				storesArray.push({
					key: store.id,
					label: store.name,
					value: store.id,
				})
			);

			setStores(storesArray);

			const { roleInTeam } = teamContext;

			if (roleInTeam) {
				if (roleInTeam.role.toLowerCase() !== 'manager') {
					if (roleInTeam.store) {
						const store = storesArray.find(
							sto => sto.key === roleInTeam.store?.id
						);

						if (store) setSelectedStore(store.value);
					}
				}
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [isMounted, teamContext]);

	const handleSwitchFindModal = useCallback(() => {
		setShowProdFindedModal(!showProdFindedModal);
	}, [showProdFindedModal]);

	const handleNavigateToAddBatch = useCallback(() => {
		if (!!duplicateId && duplicateId.trim() !== '')
			navigate('AddBatch', { productId: duplicateId });
	}, [duplicateId, navigate]);

	const addBatch = useCallback(async () => {
		if (!duplicateId || (duplicateId && duplicateId.trim() === '')) return;

		try {
			setIsLoading(true);

			await createBatch({
				productId: duplicateId,
				batch: {
					name: batch || '01',
					exp_date: String(expDate),
					amount: Number(amount),
					price: Number(price),
					status: 'unchecked',
				},
			});

			showMessage({
				message: 'O lote foi adicionado ao produto existente',
				type: 'info',
			});

			replace('ProductDetails', {
				id: duplicateId,
			});
		} finally {
			setIsLoading(false);
		}
	}, [amount, batch, duplicateId, expDate, price, replace]);

	const findDuplicateProducts = useCallback(async () => {
		if (!teamContext.id) return;
		try {
			if (!name) return;
			const isDuplicate = await findDuplicate({
				name,
				code,
				team_id: teamContext.id,
				store_id: selectedStore || undefined,
			});

			if (isDuplicate.product_id) setDuplicateId(isDuplicate.product_id);
			setCodeFieldError(isDuplicate.isDuplicate);
		} catch (err) {
			if (err instanceof Error) {
				console.log(err.message);
			}
		}
	}, [code, name, selectedStore, teamContext.id]);

	const handleCodeBlur = useCallback(
		(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			if (code) {
				findProductByEAN(code);
				findDuplicateProducts();
			}
		},
		[code, findDuplicateProducts, findProductByEAN]
	);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleSave = useCallback(async () => {
		if (!teamContext.id) {
			return;
		}
		if (!name || name.trim() === '') {
			setNameFieldError(true);
			return;
		}

		if (nameFieldError) {
			return;
		}

		if (codeFieldError) {
			setShowModalDuplicate(true);
			return;
		}
		try {
			setIsLoading(true);
			let prodCategory: string | undefined;

			if (selectedCategory && selectedCategory !== 'null') {
				prodCategory = selectedCategory;
			}

			const createdProduct = await createProduct({
				team_id: teamContext.id,
				product: {
					name,
					code,
					brand: selectedBrand || undefined,
					store: selectedStore || undefined,
					batches: [],
				},
				category: prodCategory,
			});

			await createBatch({
				productId: createdProduct.id,
				batch: {
					name: batch || '01',
					exp_date: String(expDate),
					amount: Number(amount),
					price: Number(price),
					status: 'unchecked',
				},
			});

			if (!!photoPath) {
				await uploadImage({
					team_id: teamContext.id,
					product_id: createdProduct.id,
					path: photoPath,
				});

				// await saveLocally(photoPath, createdProduct.id);
			}

			showMessage({
				message: strings.View_Success_ProductCreated,
				type: 'info',
			});

			replace('ProductDetails', {
				id: createdProduct.id,
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [
		teamContext.id,
		name,
		nameFieldError,
		codeFieldError,
		selectedCategory,
		code,
		selectedBrand,
		selectedStore,
		batch,
		expDate,
		amount,
		price,
		photoPath,
		replace,
	]);

	const handleAmountChange = useCallback((value: string) => {
		const regex = /^[0-9\b]+$/;

		if (value === '' || regex.test(value)) {
			setAmount(value);
		}
	}, []);

	const handleSwitchCodeReader = useCallback(() => {
		setIsBarCodeEnabled(prevState => !prevState);
	}, []);

	const switchCameraEnable = useCallback(() => {
		setEnableCamera(prevState => !prevState);
	}, []);

	const handleSwitchDupliateModal = useCallback(() => {
		setShowModalDuplicate(prevState => !prevState);
	}, []);

	const handleOnCodeRead = useCallback(
		async (codeRead: string) => {
			setCode(codeRead);
			setIsBarCodeEnabled(false);
			await findProductByEAN(codeRead);
			await findDuplicateProducts();
		},
		[findDuplicateProducts, findProductByEAN]
	);

	const onPhotoTaken = useCallback((path: string) => {
		setPhotoPath(path);
		setEnableCamera(false);
	}, []);

	const handleNameChange = useCallback((value: string) => {
		setName(value);
		setNameFieldError(false);
	}, []);

	const handleCodeChange = useCallback((value: string) => {
		setCode(value);
		setCodeFieldError(false);
	}, []);

	const handlePriceChange = useCallback((value: number) => {
		if (value <= 0) {
			setPrice(null);
			return;
		}
		setPrice(value);
	}, []);

	const handleDateChange = useCallback((value: Date) => {
		setExpDate(value);
	}, []);

	useEffect(() => {
		return () => {
			setIsMounted(false);
		};
	}, []);

	return enableCamera ? (
		<Camera
			onPhotoTaken={onPhotoTaken}
			switchEnableCamera={switchCameraEnable}
		/>
	) : (
		<Container>
			{isBarCodeEnabled ? (
				<BarCodeReader
					onCodeRead={handleOnCodeRead}
					onClose={handleSwitchCodeReader}
				/>
			) : (
				<>
					<Header
						title={strings.View_AddProduct_PageTitle}
						noDrawer
						appBarActions={[
							{
								icon: 'content-save-outline',
								onPress: handleSave,
								disabled: isLoading,
							},
						]}
					/>

					{isLoading ? (
						<Loading />
					) : (
						<Content>
							<PageContent>
								{!!photoPath && (
									<ImageContainer>
										<ProductImageContainer>
											<ProductImage
												source={{
													uri: `file://${photoPath}`,
												}}
											/>
										</ProductImageContainer>
									</ImageContainer>
								)}

								<InputContainer>
									<InputGroup>
										<InputTextContainer
											hasError={nameFieldError}
										>
											<InputText
												placeholder={
													strings.View_AddProduct_InputPlacehoder_Name
												}
												value={name}
												onChange={handleNameChange}
											/>
										</InputTextContainer>

										<CameraButtonContainer
											onPress={switchCameraEnable}
										>
											<Icon
												name="camera-outline"
												size={36}
											/>
										</CameraButtonContainer>
									</InputGroup>
									{nameFieldError && (
										<InputTextTip>
											{
												strings.View_AddProduct_AlertTypeProductName
											}
										</InputTextTip>
									)}

									<InputCodeTextContainer
										hasError={codeFieldError}
									>
										<InputCodeText
											placeholder={
												strings.View_AddProduct_InputPlacehoder_Code
											}
											accessibilityLabel={
												strings.View_AddProduct_InputAccessibility_Code
											}
											value={code}
											onBlur={handleCodeBlur}
											onChangeText={handleCodeChange}
										/>
										<InputTextIconContainer
											onPress={handleSwitchCodeReader}
										>
											<Icon
												name="barcode-outline"
												size={34}
											/>
										</InputTextIconContainer>

										{isFindingProd && <InputTextLoading />}

										{productFinded && !isFindingProd && (
											<InputTextIconContainer
												style={{
													marginTop: -5,
												}}
												onPress={handleSwitchFindModal}
											>
												<Icon
													name="download"
													size={30}
												/>
											</InputTextIconContainer>
										)}
									</InputCodeTextContainer>
									{codeFieldError && (
										<InputTextTip
											onPress={handleNavigateToAddBatch}
										>
											O produto já está cadastrado
										</InputTextTip>
									)}

									<MoreInformationsContainer>
										<MoreInformationsTitle>
											{
												strings.View_AddProduct_MoreInformation_Label
											}
										</MoreInformationsTitle>

										<InputGroup>
											<InputTextContainer
												style={{
													flex: 5,
													marginRight: 10,
												}}
											>
												<InputText
													placeholder={
														strings.View_AddProduct_InputPlacehoder_Batch
													}
													value={batch}
													onChange={value =>
														setBatch(value)
													}
												/>
											</InputTextContainer>
											<InputTextContainer>
												<InputText
													contentStyle={{ flex: 4 }}
													placeholder={
														strings.View_AddProduct_InputPlacehoder_Amount
													}
													keyboardType="numeric"
													value={String(amount)}
													onChange={
														handleAmountChange
													}
												/>
											</InputTextContainer>
										</InputGroup>

										<Currency
											value={price}
											onChangeValue={handlePriceChange}
											delimiter={
												currency === 'BRL' ? ',' : '.'
											}
											placeholder={
												strings.View_AddProduct_InputPlacehoder_UnitPrice
											}
										/>

										<CategorySelect
											categories={categories}
											onChange={setSelectedCategory}
											defaultValue={selectedCategory}
											containerStyle={{
												marginBottom: 10,
											}}
										/>

										<BrandSelect
											brands={brands}
											onChange={setSelectedBrand}
											defaultValue={selectedBrand}
											containerStyle={{
												marginBottom: 10,
											}}
										/>
										{teamContext.roleInTeam?.role.toLowerCase() ===
											'manager' && (
											<StoreSelect
												stores={stores}
												defaultValue={selectedStore}
												onChange={setSelectedStore}
												containerStyle={{
													marginBottom: 10,
												}}
											/>
										)}
									</MoreInformationsContainer>

									<ExpDateGroup>
										<ExpDateLabel>
											{
												strings.View_AddProduct_CalendarTitle
											}
										</ExpDateLabel>

										<CustomDatePicker
											accessibilityLabel={
												strings.View_AddProduct_CalendarAccessibilityDescription
											}
											date={expDate}
											onDateChange={handleDateChange}
											locale={locale}
										/>
									</ExpDateGroup>
								</InputContainer>
							</PageContent>

							<FillModal
								onConfirm={handleCompleteInfo}
								show={showProdFindedModal}
								setShow={handleSwitchFindModal}
							/>
							<PaddingComponent />
						</Content>
					)}
				</>
			)}

			<Dialog
				visible={showModalDuplicate}
				title="Este produto já existe"
				description="Você deseja adicionar um lote ao produto existente?"
				cancelText="Adicionar lote"
				confirmText="Cancelar"
				onCancel={addBatch}
				onDismiss={handleSwitchDupliateModal}
				onConfirm={handleSwitchDupliateModal}
			/>
		</Container>
	);
};

export default Add;
