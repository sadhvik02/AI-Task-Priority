export const validateRegistration = (username, password) => {
    if (!username || username.trim().length < 3) {
        return "Username must be at least 3 characters long";
    }
    if (!password || password.length < 6) {
        return "Password must be at least 6 characters long";
    }
    return null;
};
