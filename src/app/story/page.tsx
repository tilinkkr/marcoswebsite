import type { Metadata } from "next";
import { EditorialPage } from "@/components/layout/EditorialPage";
export const metadata: Metadata = { title: "Our Story" };
export default function Story() {
  return (
    <EditorialPage
      eyebrow="MARCOS / OUR STORY"
      title="PROCESS BEFORE PROMISES."
      lede="MARCOS exists to make the work behind trading visible: preparation, execution, review and risk discipline."
    >
      <h2>Why MARCOS exists</h2>
      <p>
        Trading alone can hide weak decisions. MARCOS brings traders into a
        shared learning environment where reasoning can be discussed, reviewed
        and improved.
      </p>
      <p>
        The community is built around education and transparent process. It does
        not promise profits, funding or shortcuts. The standard is deliberate
        work.
      </p>
    </EditorialPage>
  );
}
