interface IAllTeamProducts {
    team: {
        id: string;
        name: string;
        created_at: Date;
        updated_at: Date;
    };
    products: Array<IProduct>;
}
