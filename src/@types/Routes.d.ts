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
        product: string;
        batch: string;
    };
    BatchDiscount: {
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
    EditTeam;
    ListUsersFromTeam;

    Subscription;
    Test;

    VerifyEmail;
    DeleteTeam;
    DeleteUser;
};

type DrawerParams = {
    Routes;
    Auth;
};
