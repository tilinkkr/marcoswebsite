import type { Metadata } from "next";
import { EditorialPage } from "@/components/layout/EditorialPage";
export const metadata: Metadata = { title: "Terms" };
export default function Terms() {
  return (
    <EditorialPage
      eyebrow="LEGAL / TERMS"
      title="CLEAR TERMS. CLEAR RESPONSIBILITY."
      lede="These are the current foundation terms for the MARCOS website."
    >
      <h2>Educational use</h2>
      <p>
        Website content is provided for educational and informational use. It is
        not personalised financial, legal or tax advice.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not misuse the service, attempt unauthorised access, upload malicious
        files or interfere with other members.
      </p>
      <h2>Future services</h2>
      <p>
        Membership, payments and authenticated services will be governed by the
        specific terms shown before purchase or access.
      </p>
    </EditorialPage>
  );
}
