import { siteConfig } from "@/lib/site-config";

const GREETING = "Hi Crimson Deli, I have a question.";

/** Floating "chat on WhatsApp" button, bottom right on every storefront page. */
export default function WhatsAppButton() {
  const href = `${siteConfig.whatsappHref}?text=${encodeURIComponent(GREETING)}`;
  return (
    <a
      href={href}
      className="cd-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp at ${siteConfig.phone}`}
      title="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M16.04 3C8.86 3 3.02 8.83 3.02 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A13 13 0 0 0 16.04 29C23.2 29 29 23.17 29 16S23.2 3 16.04 3Zm0 23.8c-1.95 0-3.86-.52-5.53-1.51l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.76 10.76 0 0 1 5.26 16c0-5.94 4.84-10.77 10.78-10.77 5.93 0 10.72 4.83 10.72 10.77 0 5.95-4.8 10.8-10.72 10.8Zm5.9-8.07c-.32-.16-1.91-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.26-.19.22-.37.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.91-1.8-2.23-.18-.32-.02-.5.15-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-1-2.38-.26-.62-.52-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.3.32-1.12 1.1-1.12 2.66 0 1.57 1.15 3.09 1.3 3.3.17.22 2.26 3.44 5.46 4.83.76.33 1.36.52 1.82.67.77.24 1.46.2 2.01.13.61-.1 1.9-.78 2.16-1.53.27-.75.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z"
        />
      </svg>
    </a>
  );
}
