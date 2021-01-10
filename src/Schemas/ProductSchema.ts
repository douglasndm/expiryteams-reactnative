const ProductSchema = {
    name: 'Product',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', indexed: true },
        name: 'string',
        code: 'string?', // ? no final diz ao Realm que o campo pode ficar vazio
        photo: 'string?',
        store: 'string?',
        lotes: 'Lote[]',
    },
};

export default ProductSchema;
