import type { Metadata } from "next";
import { EditorialPage } from "@/components/layout/EditorialPage";
export const metadata: Metadata = {
  title: "Terms",
  description:
    "Read the MARKOS website terms for educational content, community participation, products, payments and trading risk.",
  alternates: { canonical: "/terms" },
};
export default function Terms() {
  return (
    <EditorialPage
      eyebrow="LEGAL / TERMS"
      title="CLEAR TERMS. CLEAR RESPONSIBILITY."
      lede="These terms describe the basic rules for using the MARKOS website and its educational content. Product-specific details shown during checkout also apply to that purchase."
    >
      <h2>Educational use</h2>
      <p>
        Website content is provided for educational and informational use. It is
        not personalised financial, investment, legal or tax advice, and does
        not take account of your circumstances. You&apos;re responsible for your
        own decisions and should seek independent advice where appropriate.
        Trading and leveraged products involve substantial risk; losses may
        exceed expectations and past performance does not predict future
        results. No content, community discussion, tool or service guarantees
        profit, funding, evaluation success or a particular outcome. Read the
        <a href="/risk-disclosure"> risk disclosure</a> before participating.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not misuse the service, attempt unauthorised access, upload malicious
        files, submit false payment evidence, infringe another person&apos;s rights,
        or interfere with other members or the operation of the site. We may
        restrict access where reasonably necessary to protect the service or
        its users.
      </p>
      <h2>Products and payments</h2>
      <p>
        Product descriptions, availability, price and currency are shown on the
        relevant page and again in the checkout flow. Orders that require
        payment evidence are subject to manual verification before access is
        granted. Keep your order reference and follow the instructions presented
        during checkout. Do not submit card details through website forms. Any
        refund or cancellation terms presented for a particular purchase form
        part of that purchase; contact MARKOS before paying if the applicable
        terms are unclear.
      </p>
      <h2>Third-party services and changes</h2>
      <p>
        The site may link to platforms, communities and payment instructions
        operated by others. Their terms and privacy practices apply to your use
        of those services. MARKOS may update website content or availability;
        material purchase terms will be presented in the relevant purchase
        flow.
      </p>
      <h2>Questions</h2>
      <p>
        If you have a question about these terms or a current order, use the{" "}
        <a href="/contact">Contact page</a> and include your order reference
        when relevant.
      </p>
    </EditorialPage>
  );
}
