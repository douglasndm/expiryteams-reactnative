interface IPreferences {
    howManyDaysToBeNextToExpire: number;
    appTheme: DefaultTheme;
    enableNotifications: boolean;
    notificationCadency: NotificationCadency;
    user: FirebaseAuthTypes.User | null;
    selectedTeam: IUserRoles | null;
}
