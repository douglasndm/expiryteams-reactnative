import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { Menu } from 'react-native-paper';

import strings from '@teams/Locales';

import { useTeam } from '@teams/Contexts/TeamContext';

import { getLocally, imageExistsLocally } from '@utils/Images/GetLocally';
import { saveLocally } from '@utils/Images/SaveLocally';
import { removeLocalImage } from '@utils/Images/RemoveLocally';

import {
	deleteProduct,
	getProduct,
	updateProduct,
} from '@teams/Functions/Products/Product';
import { removeImage, uploadImage } from '@teams/Functions/Product/Image';
import { getExtraInfoForProducts } from '@teams/Functions/Products/ExtraInfo';

import Loading from '@components/Loading';
import Header from '@components/Header';
import Camera from '@components/Camera';
import BarCodeReader from '@components/BarCodeReader';
import InputText from '@components/InputText';
import Dialog from '@components/Dialog';

import BrandSelect from '@teams/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '@teams/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '@teams/Components/Product/Inputs/Pickers/Store';

import {
	Container,
	PageContent,
	InputGroup,
	InputContainer,
	InputTextContainer,
	InputTextTip,
	MoreInformationsContainer,
	MoreInformationsTitle,
	ImageContainer,
	ProductImageContainer,
	ProductImage,
	CameraButtonContainer,
} from '@views/Product/Add/styles';

import {
	InputCodeTextContainer,
	InputCodeText,
	InputTextIconContainer,
	Icon,
} from '../Add/styles';
import { Icons } from './styles';

interface RequestParams {
	route: {
		params: {
			productId: string;
		};
	};
}

const Edit: React.FC<RequestParams> = ({ route }: RequestParams) => {
	const { reset, navigate } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const [isMounted, setIsMounted] = useState(true);

	const teamContext = useTeam();

	const userRole = useMemo(() => {
		if (teamContext.roleInTeam) {
			return teamContext.roleInTeam.role.toLowerCase();
		}

		return 'repositor';
	}, [teamContext.roleInTeam]);

	const productId = useMemo<string>(() => {
		return route.params.productId;
	}, [route.params.productId]);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [photoFailed, setPhotoFailed] = useState<boolean>(false);
	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const [product, setProduct] = useState<IProduct>();

	const [name, setName] = useState('');
	const [code, setCode] = useState<string | undefined>('');
	const [photoPath, setPhotoPath] = useState('');

	const [categories, setCategories] = useState<Array<IPickerItem>>([]);
	const [brands, setBrands] = useState<Array<IPickerItem>>([]);
	const [stores, setStores] = useState<Array<IPickerItem>>([]);

	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	);
	const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
	const [selectedStore, setSelectedStore] = useState<string | null>(null);

	const [nameFieldError, setNameFieldError] = useState<boolean>(false);

	const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [enableCamera, setEnableCamera] = useState(false);

	const isSupervisor = useMemo(() => {
		if (userRole === 'manager' || userRole === 'supervisor') {
			return true;
		}
		return false;
	}, [userRole]);

	const switchShowMenu = useCallback(() => {
		setShowMenu(prevValue => !prevValue);
	}, []);

	const loadData = useCallback(async () => {
		if (!isMounted) return;
		if (!teamContext.id) {
			return;
		}
		try {
			setIsLoading(true);

			const prod = await getProduct({
				productId,
				team_id: teamContext.id,
			});

			setName(prod.name);
			setCode(prod.code);

			const response = await getExtraInfoForProducts({
				team_id: teamContext.id,
			});

			const categoriesArray: Array<IPickerItem> = [];

			response.availableCategories.forEach(cat =>
				categoriesArray.push({
					key: cat.id,
					label: cat.name,
					value: cat.id,
				})
			);
			setCategories(categoriesArray);

			const brandsArray: Array<IPickerItem> = [];

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

			if (prod.category) {
				setSelectedCategory(prod.category.id);
			}
			if (prod.brand) {
				setSelectedBrand(prod.brand);
			}
			if (prod.store) {
				setSelectedStore(prod.store);
			}

			setProduct(prod);

			if (prod.thumbnail) {
				try {
					const existsLocally = await imageExistsLocally(productId);

					if (existsLocally) {
						const localImage = getLocally(productId);

						if (Platform.OS === 'android') {
							setPhotoPath(`file://${localImage}`);
						} else if (Platform.OS === 'ios') {
							setPhotoPath(localImage);
						}
					} else if (prod.thumbnail) {
						setPhotoPath(prod.thumbnail);

						saveLocally(prod.thumbnail, productId);
					}
				} catch (err) {
					setPhotoPath('');
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
	}, [isMounted, productId, teamContext.id]);

	const updateProd = useCallback(async () => {
		if (!isMounted || !teamContext.id) return;
		if (!name || name.trim() === '') {
			setNameFieldError(true);
			return;
		}

		const cate = selectedCategory === 'null' ? null : selectedCategory;

		try {
			await updateProduct({
				team_id: teamContext.id,
				product: {
					id: productId,
					name,
					code,
					brand: selectedBrand,
					store: selectedStore
						? {
								id: selectedStore,
						  }
						: null,
					category: {
						id: cate,
					},
				},
			});

			/*
			if (!!photoPath) {
				await uploadImage({
					team_id: teamContext.id,
					product_id: productId,
					path: photoPath,
				});

				// await saveLocally(photoPath, productId);
			} */

			showMessage({
				message: strings.View_Success_ProductUpdated,
				type: 'info',
			});

			navigate('ProductDetails', {
				id: productId,
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [
		code,
		isMounted,
		name,
		navigate,
		photoPath,
		productId,
		selectedBrand,
		selectedCategory,
		selectedStore,
		teamContext.id,
	]);

	const handleDeleteProduct = useCallback(async () => {
		if (!isMounted || !teamContext.id) return;
		try {
			await deleteProduct({
				team_id: teamContext.id,
				product_id: productId,
			});

			showMessage({
				message: strings.View_Success_ProductDeleted,
				type: 'info',
			});

			reset({
				routes: [{ name: 'Home' }],
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setDeleteComponentVisible(false);
		}
	}, [isMounted, productId, reset, teamContext.id]);

	const handleOnPhotoPress = useCallback(() => {
		if (!product.thumbnail) return;

		if (product.thumbnail) {
			navigate('PhotoView', {
				product_id: productId,
			});
		}
	}, [navigate, product?.thumbnail, productId]);

	const handleOnCodeRead = useCallback((codeRead: string) => {
		setCode(codeRead);
		setIsBarCodeEnabled(false);
	}, []);

	const handleEnableBarCodeReader = useCallback(() => {
		setIsBarCodeEnabled(true);
	}, []);

	const handleDisableBarCodeReader = useCallback(() => {
		setIsBarCodeEnabled(false);
	}, []);

	const switchCameraEnable = useCallback(() => {
		setEnableCamera(prevState => !prevState);
	}, []);

	const switchShowDeleteModal = useCallback(() => {
		setDeleteComponentVisible(prevState => !prevState);
	}, []);

	const onPhotoTaken = useCallback((path: string) => {
		setPhotoPath(path);
		setPhotoFailed(false);
		setEnableCamera(false);
	}, []);

	const onPhotoLoadFailed = useCallback(() => {
		setPhotoFailed(true);
	}, []);

	const handleRemovePhoto = useCallback(async () => {
		if (!teamContext.id) return;
		setShowMenu(false);
		setPhotoPath('');

		await removeImage({
			team_id: teamContext.id,
			product_id: productId,
		});

		await removeLocalImage(productId);
	}, [productId, teamContext.id]);

	useEffect(() => {
		loadData();
	}, [loadData]);

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
		<>
			{isBarCodeEnabled ? (
				<BarCodeReader
					onCodeRead={handleOnCodeRead}
					onClose={handleDisableBarCodeReader}
				/>
			) : (
				<Container>
					<Header
						title={strings.View_EditProduct_PageTitle}
						noDrawer
						appBarActions={[
							{
								icon: 'content-save-outline',
								onPress: updateProd,
								disabled: isLoading,
							},
						]}
						moreMenuItems={
							isSupervisor
								? [
										{
											title: strings.View_ProductDetails_Button_DeleteProduct,
											leadingIcon: 'trash-can-outline',
											onPress: switchShowDeleteModal,
											disabled: isLoading,
										},
								  ]
								: []
						}
					/>

					{isLoading ? (
						<Loading />
					) : (
						<PageContent>
							{!!photoPath && !photoFailed && (
								<Menu
									visible={showMenu}
									onDismiss={switchShowMenu}
									anchorPosition="bottom"
									anchor={
										<ImageContainer>
											<ProductImageContainer
												onPress={handleOnPhotoPress}
												onLongPress={switchShowMenu}
											>
												<ProductImage
													source={{
														uri: `file://${photoPath}`,
													}}
													onError={onPhotoLoadFailed}
												/>
											</ProductImageContainer>
										</ImageContainer>
									}
								>
									<Menu.Item
										title="Remover foto"
										onPress={handleRemovePhoto}
									/>
								</Menu>
							)}

							<InputContainer>
								<InputGroup>
									<InputTextContainer>
										<InputText
											placeholder={
												strings.View_EditProduct_InputPlacehoder_Name
											}
											value={name}
											onChange={(value: string) => {
												setName(value);
												setNameFieldError(false);
											}}
										/>
									</InputTextContainer>

									<CameraButtonContainer
										onPress={switchCameraEnable}
									>
										<Icon name="camera-outline" size={36} />
									</CameraButtonContainer>
								</InputGroup>
								{nameFieldError && (
									<InputTextTip>
										{
											strings.View_EditProduct_Error_EmptyProductName
										}
									</InputTextTip>
								)}

								<InputCodeTextContainer>
									<InputCodeText
										placeholder={
											strings.View_EditProduct_InputPlacehoder_Code
										}
										accessibilityLabel={
											strings.View_EditProduct_InputAccessibility_Code
										}
										value={code}
										onChangeText={(value: string) =>
											setCode(value)
										}
									/>
									<InputTextIconContainer
										onPress={handleEnableBarCodeReader}
									>
										<Icons
											name="barcode-outline"
											size={34}
										/>
									</InputTextIconContainer>
								</InputCodeTextContainer>

								<MoreInformationsContainer>
									<MoreInformationsTitle>
										{
											strings.View_AddProduct_MoreInformation_Label
										}
									</MoreInformationsTitle>

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
							</InputContainer>
						</PageContent>
					)}

					<Dialog
						title={strings.View_ProductDetails_WarningDelete_Title}
						description={
							strings.View_ProductDetails_WarningDelete_Message
						}
						confirmText={
							strings.View_ProductDetails_WarningDelete_Button_Confirm
						}
						cancelText={
							strings.View_ProductDetails_WarningDelete_Button_Cancel
						}
						visible={deleteComponentVisible}
						onConfirm={handleDeleteProduct}
						onDismiss={switchShowDeleteModal}
						onCancel={switchShowDeleteModal}
					/>
				</Container>
			)}
		</>
	);
};

export default Edit;
