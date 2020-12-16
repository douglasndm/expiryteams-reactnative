interface IUser {
    displayName: string | null;
    email: string | null;
    emailVerified: boolean;
    photoURL: string | null;
    providerId: string;
    uid: string;
}

interface IGoogleUser {
    name: string | null;
    email: string | null;
    photo: string | null;
}
