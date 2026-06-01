import bcrypt from "bcryptjs"

// Takes in: plain text password string e.g. "mypassword123"
// Returns: scrambled hash string e.g. "$2a$10$xK9..." to save in DB
export async function hashLockPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Takes in: plain text password user just typed + hash from DB
// Returns: true if correct, false if wrong
export async function verifyLockPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}