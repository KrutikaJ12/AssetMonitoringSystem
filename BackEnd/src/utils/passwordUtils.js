const argon2 = require("argon2");

const hashPassword = async (password) => {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 1,
    });
};

// const verifyPassword = async (password, hash) => {
//     return await argon2.verify(hash, password);
// };
const verifyPassword = async (password, hash) => {

    if (Buffer.isBuffer(hash)) {
        hash = hash.toString();
    }

    return await argon2.verify(hash, password);

};

module.exports = {
    hashPassword,
    verifyPassword,
};