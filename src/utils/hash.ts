import crypto from 'crypto';

// building a custom hash function instead of using sha or bcrypt
// why? to learn.

export function hashPassword(password: string) {
  // create salt ... random piece of data that we hash with the password
  // so two users with the same password don't have the same hashed password

  // 1. user registers
  // 2. we create a random piece of salt
  // 3. we hash their password with the salt
  // 4. we store the hash and the salt
  // 5. user logs in, providing a candidate password
  // 6. we get get the hash from the user profile
  // 7. we hash the candidate password with the salt
  // 8. if that hash matches the hash on the user, we know the password is correct

  const salt = crypto.randomBytes(16).toString('hex');

  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');

  return { hash, salt };
}

export function verifyPassword({
  candidatePassword,
  salt,
  hash,
}: {
  candidatePassword: string;
  salt: string;
  hash: string;
}) {
  const candidateHash = crypto
    .pbkdf2Sync(candidatePassword, salt, 1000, 64, 'sha512')
    .toString('hex');

  return candidateHash === hash;
}
