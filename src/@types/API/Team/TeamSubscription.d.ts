interface ITeamSubscription {
    id: string;
    expireIn: Date;
    membersLimit: number;
    team: ITeam;
}
