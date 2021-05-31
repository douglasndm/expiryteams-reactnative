interface searchProductsProps {
    query: string;
    products: Array<IProduct>;
}

export async function searchProducts({
    query,
    products,
}: searchProductsProps): Promise<Array<IProduct>> {
    const q = query.toLowerCase();

    const productsFind = products.filter(product => {
        const searchByName = product.name.toLowerCase().includes(q);

        if (searchByName) {
            return true;
        }

        if (product.code) {
            const searchBycode = product.code.toLowerCase().includes(q);

            if (searchBycode) {
                return true;
            }
        }

        if (product.batches.length > 0) {
            const batches = product.batches.filter(batch => {
                const findedByBatchName = batch.name.toLowerCase().includes(q);

                if (findedByBatchName) {
                    return true;
                }

                return false;
            });

            if (batches.length > 0) {
                return true;
            }
        }

        return false;
    });

    return productsFind;
}
