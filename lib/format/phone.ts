/**
 * Display formatting for US phone numbers.
 *
 * Numbers are stored exactly as the customer typed them, so the same table can
 * show "2155550188" next to "(215) 718-7553". Everything user-facing goes
 * through here instead.
 */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  const local = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length !== 10) return raw.trim(); // not a US number — show as typed
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}
