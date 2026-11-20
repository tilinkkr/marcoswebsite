import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CountryLanding,
  countryMetadata,
  type RegionHub,
} from "@/components/regions/CountryLanding";
import { GCC_COUNTRIES, getGccCountry } from "@/config/gcc";

type Props = { params: Promise<{ country: string }> };

const HUB: RegionHub = { path: "/gcc", label: "GCC" };

export const dynamicParams = false;

export function generateStaticParams() {
  return GCC_COUNTRIES.map((country) => ({ country: country.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const country = getGccCountry((await params).country);
  return country ? countryMetadata(country, HUB) : {};
}

export default async function GccCountryPage({ params }: Props) {
  const country = getGccCountry((await params).country);
  if (!country) notFound();
  return <CountryLanding country={country} hub={HUB} />;
}
