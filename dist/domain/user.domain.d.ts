export type User = {
    auth: any;
    userId: string;
    origins: string[];
};
export declare class UserDomain {
    private auth;
    private userId;
    private origins;
    constructor({ auth, userId, origins }: User);
    static createUser(user: User): UserDomain;
    getUserAuth: () => any;
    getUserId: () => string;
    updateUserAuth: (auth: any) => void;
    updateUserOrigins: (origins: string[]) => void;
    getUser: () => {
        auth: any;
        userId: string;
        origins: string[];
    };
}
