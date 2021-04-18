import {
    setHours,
    setMinutes,
    setSeconds,
    setMilliseconds,
    parseISO,
} from 'date-fns';
import { UpdateMode } from 'realm';

import Realm from '../Services/Realm';

import { getProductByCode, getProductById } from './Product';

export function sortLoteByExpDate(lotes: Array<ILote>): Array<ILote> {
    // Não sei pq o certo mas o Realm transformou o array em uma coleção de objetos
    // e sendo objetos não consigo fazer o sort deles usando as funções nativas do javscript
    // solução -> percorrer todo o objeto de lotes e colocar cada um dentro de um array temporario
    // para ai sim ser possível fazer o sort
    const arrayTemp = lotes.map((l) => l); // READ BEFORE DELETE

    if (arrayTemp.length > 2) {
        const lotesSorted = arrayTemp.sort((l1, l2) => {
            if (l1.exp_date > l2.exp_date) return 1;
            if (l1.exp_date < l2.exp_date) return -1;
            return 0;
        });

        return lotesSorted;
    }
    return arrayTemp;
}

export function removeLotesTratados(lotes: Array<ILote>): Array<ILote> {
    // Não sei pq o certo mas o Realm transformou o array em uma coleção de objetos
    // e sendo objetos não consigo fazer o sort deles usando as funções nativas do javscript
    // solução -> percorrer todo o objeto de lotes e colocar cada um dentro de um array temporario
    // para ai sim ser possível fazer o sort
    const arrayTemp = lotes.map((l) => l); // READ BEFORE DELETE

    const results = arrayTemp.filter((lote) => {
        if (lote.status === 'Tratado') return false;
        return true;
    });

    return results;
}

interface checkIfLoteAlreadyExistsProps {
    loteName: string;
    productCode?: string;
    productId?: number;
}

export async function checkIfLoteAlreadyExists({
    loteName,
    productCode,
    productId,
}: checkIfLoteAlreadyExistsProps): Promise<boolean> {
    try {
        let product: IProduct;

        if (productCode) {
            const prod = await getProductByCode(productCode);

            if (!prod) {
                throw new Error('Não foi possível encontrar o produto');
            }

            product = prod;
        } else if (productId) {
            const prod = await getProductById(productId);

            if (!prod) {
                throw new Error('Não foi possível encontrar o produto');
            }

            product = prod;
        } else {
            throw new Error(
                'ID do produto ou código devem ser passados para verificar se o lote já existe'
            );
        }

        const productsLotes = product.lotes.filter((l) => {
            if (l.lote.toLowerCase() === loteName.toLowerCase()) {
                return true;
            }
            return false;
        });

        if (productsLotes.length > 0) {
            return true;
        }

        return false;
    } catch (err) {
        throw new Error(err);
    }
}

export async function getLoteById(loteId: number): Promise<ILote> {
    const realm = await Realm();

    try {
        const result = realm
            .objects<ILote>('Lote')
            .filtered(`id = "${loteId}"`)[0];

        return result;
    } catch (err) {
        throw new Error(err);
    }
}

interface createLoteProps {
    lote: Omit<ILote, 'id'>;
    productCode?: string;
    productId?: number;
    ignoreDuplicate?: boolean;
}

export async function createLote({
    lote,
    productCode,
    productId,
    ignoreDuplicate = false,
}: createLoteProps): Promise<void> {
    if (
        productCode &&
        ignoreDuplicate === false &&
        (await checkIfLoteAlreadyExists({ productCode, loteName: lote.lote }))
    ) {
        throw new Error('Já existe o mesmo lote cadastro');
    } else if (
        productId &&
        ignoreDuplicate === false &&
        (await checkIfLoteAlreadyExists({ productId, loteName: lote.lote }))
    ) {
        throw new Error('Já existe o mesmo lote cadastro');
    }

    const realm = await Realm();

    try {
        realm.write(() => {
            let product;

            if (productCode) {
                product = realm
                    .objects<IProduct>('Product')
                    .filtered(`code = "${productCode}"`)
                    .slice();
            } else {
                product = realm
                    .objects<IProduct>('Product')
                    .filtered(`id = "${productId}"`)
                    .slice();
            }

            if (product.length < 1) {
                throw new Error(
                    'Produto não encontrado, não é possível adicionar o lote'
                );
            }

            const lastLote = realm.objects<ILote>('Lote').sorted('id', true)[0];
            const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

            // UM MONTE DE SETS PARA DEIXAR A HORA COMPLETAMENTE ZERADA
            // E CONSIDERAR APENAS OS DIAS NO CONTROLE DE VENCIMENTO
            let formatedDate = new Date();

            if (typeof lote.exp_date === 'string') {
                formatedDate = setHours(
                    setMinutes(
                        setSeconds(
                            setMilliseconds(parseISO(lote.exp_date), 0),
                            0
                        ),
                        0
                    ),
                    0
                );
            } else {
                formatedDate = setHours(
                    setMinutes(
                        setSeconds(setMilliseconds(lote.exp_date, 0), 0),
                        0
                    ),
                    0
                );
            }

            product[0].lotes.push({
                id: nextLoteId,
                lote: lote.lote,
                exp_date: formatedDate,
                amount: lote.amount,
                price: lote.price,
                status: lote.status,
            });
        });
    } catch (err) {
        throw new Error(err);
    }
}

export async function updateLote(lote: ILote): Promise<void> {
    const realm = await Realm();

    try {
        realm.write(() => {
            realm.create('Lote', lote, UpdateMode.Modified);
        });
    } catch (err) {
        throw new Error(err);
    }
}

export async function deleteLote(loteId: number): Promise<void> {
    const realm = await Realm();

    try {
        const lote = realm.objects<ILote>('Lote').filtered(`id = "${loteId}"`);

        realm.write(() => {
            realm.delete(lote);
        });
    } catch (err) {
        throw new Error(err);
    }
}
