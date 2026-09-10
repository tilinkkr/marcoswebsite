const cleanNumber = (value: string) => value.replace(/\D/g, "");

export const MARCOS_WHATSAPP_NUMBER = "919187587488";
export const MARCOS_WHATSAPP_DISPLAY = "+91 91875 87488";

export function getWhatsAppNumber() {
  const configured = process.env.NEXT_PUBLIC_MARCOS_WHATSAPP_NUMBER?.trim();
  const number = cleanNumber(configured || MARCOS_WHATSAPP_NUMBER);

  return number || MARCOS_WHATSAPP_NUMBER;
}

export function getWhatsAppUrl(message: string) {
  const number = getWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
