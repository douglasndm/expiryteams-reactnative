type RoutesParams = {
    Home;
    AddProduct: {
        category?: string;
    };
    Settings;
    About;
    ProductDetails: {
        id: string;
    };
    AddBatch: {
        productId: string;
    };
    EditProduct: {
        product: string;
    };
    EditBatch: {
        productId: string;
        batchId: string;
    };
    Success: {
        type:
            | 'create_batch'
            | 'create_product'
            | 'edit_batch'
            | 'edit_product'
            | 'delete_batch'
            | 'delete_product';
        productId?: number;

        category_id?: string;
        store_id?: string;
    };
    Error;
    PhotoView: {
        productId: string;
    };
    ListCategory;
    CategoryView: {
        category_id: string;
        category_name?: string;
    };
    CategoryEdit: {
        id: string;
    };
    Export;

    BatchView: {
        batch: string;
    };

    User;
    UserDetails: {
        user: IUserInTeam;
    };
    Logout;

    EnterTeam: {
        userRole: IUserRoles;
    };
    TeamList;
    CreateTeam;
    ViewTeam;
    ListUsersFromTeam;

    Subscription;
    Test;

    DeleteTeam;
};

type DrawerParams = {
    Routes;
    Auth;
};
