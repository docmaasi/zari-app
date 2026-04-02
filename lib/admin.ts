const ADMIN_EMAILS = ["docmmasi2@gmail.com"];

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function hasFullAccess(email: string | undefined | null): boolean {
  return isAdmin(email);
}
