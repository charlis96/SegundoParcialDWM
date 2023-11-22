import bcrypt from 'bcryptjs';

class Usuario {
    constructor(user, passwordHash) {
        this.user = user;
        this.passwordHash = passwordHash;
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async compararPassword(password) {
        return await bcrypt.compare(password, this.passwordHash);
    }
}

export default Usuario;
