interface IFirebaseUser {
    displayName: string | null;
    email: string | null;
    emailVerified: boolean;
    photoURL: string | null;
    providerId: string;
    uid: string;
}

interface IUser {
    name: string | null;
    email: string | null;
    photo: string | null;
}
