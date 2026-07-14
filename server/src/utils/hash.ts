import bcrypt from "bcryptjs";
export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
export const comparePassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);