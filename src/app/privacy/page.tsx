import type { Metadata } from "next";
import { EditorialPage } from "@/components/layout/EditorialPage";
export const metadata: Metadata = { title: "Privacy" };
export default function Privacy() {
  return (
    <EditorialPage
      eyebrow="LEGAL / PRIVACY"
      title="COLLECT LESS. PROTECT MORE."
      lede="MARCOS is preparing a privacy-conscious foundation for community, contact and membership data."
    >
      <h2>Data collected</h2>
      <p>
        Forms collect only the information needed to answer a message, review a
        team request or process an authorised membership flow.
      </p>
      <h2>Private files</h2>
      <p>
        Optional resumes and payment evidence are stored privately and are never
        intended as public website assets.
      </p>
      <h2>Contact</h2>
      <p>
        Use the Contact page for privacy questions. Formal controller details
        and retention periods must be completed before production launch.
      </p>
    </EditorialPage>
  );
}
