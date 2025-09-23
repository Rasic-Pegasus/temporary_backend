const { randomBytes } = require('crypto');

const secret = randomBytes(64).toString('hex');
console.log('Your secret key:', secret);
