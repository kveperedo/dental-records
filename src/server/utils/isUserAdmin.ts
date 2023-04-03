const adminEmails = ['kveperedo@gmail.com'];

export const isUserAdmin = (email?: string) => {
    if (!email) {
        return false;
    }

    return adminEmails.includes(email);
};
