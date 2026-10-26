import type { Metadata } from "next";
import { EditorialPage } from "@/components/layout/EditorialPage";
export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Learn what information MARKOS collects through contact, team and checkout forms, how private uploads are handled, and how to ask a privacy question.",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <EditorialPage
      eyebrow="LEGAL / PRIVACY"
      title="COLLECT LESS. PROTECT MORE."
      lede="This notice explains the information submitted through MARKOS contact, team and checkout flows, and how to ask us about its handling."
    >
      <h2>Information you submit</h2>
      <p>
        The contact form asks for your name, email address, optional phone
        number, topic and message. Team applications ask for contact details,
        location, area of interest, written responses and an optional portfolio
        link or resume. When you begin checkout, we record the details you
        provide, selected product, order reference, displayed amount and
        currency, and your recorded agreement choices. Payment submission can
        include a payment reference and optional receipt image. Do not submit
        sensitive information that a form does not request.
      </p>
      <h2>How submissions are used</h2>
      <p>
        Form details are used to respond to enquiries, consider team
        applications, administer the order or membership flow, verify submitted
        payment references, and protect the service from misuse. Operational
        audit records include the event, a hashed network address and a
        shortened user-agent value for security review.
      </p>
      <h2>Uploads and service providers</h2>
      <p>
        Resumes and payment receipts are stored in private Supabase storage and
        are not intended to be public website files. MARKOS uses Supabase for
        submitted records and authentication where those services are enabled.
        Optional PostHog analytics runs only when its public key and host are
        configured. When enabled, clicking a MARKOS WhatsApp link records the
        page path and button placement as an outbound-click event; it does not
        confirm that a message was sent or read. Authentication may use browser
        cookies to maintain a session. These providers process information to
        deliver the configured website services.
      </p>
      <h2>Retention and your choices</h2>
      <p>
        Submission records and attachments are kept for operational review; this
        site does not currently publish a fixed deletion schedule. To ask about
        a submission or request its deletion, contact MARKOS and include enough
        information for us to locate it. We may need to retain records where
        required to resolve an order, protect the service or meet an applicable
        obligation. Do not send payment card details through these forms.
      </p>
      <h2>Privacy questions</h2>
      <p>
        For a privacy question, use the <a href="/contact">Contact page</a>. The
        site does not currently publish a separate postal address or a fixed
        retention period; please contact us before submitting information if you
        need those details.
      </p>
    </EditorialPage>
  );
}
