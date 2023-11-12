"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomain = void 0;
class UserDomain {
    auth;
    userId;
    origins;
    constructor({ auth, userId, origins }) {
        this.auth = auth;
        this.userId = userId;
        this.origins = origins;
    }
    static createUser(user) {
        return new UserDomain(user);
    }
    getUserAuth = () => {
        return this.auth;
    };
    getUserId = () => {
        return this.userId;
    };
    updateUserAuth = (auth) => {
        this.auth = auth;
    };
    updateUserOrigins = (origins) => {
        this.origins = origins;
    };
    getUser = () => {
        return {
            auth: this.auth,
            userId: this.userId,
            origins: this.origins,
        };
    };
}
exports.UserDomain = UserDomain;
