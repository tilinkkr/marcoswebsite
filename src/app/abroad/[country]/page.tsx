import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CountryLanding,
  countryMetadata,
  type RegionHub,
} from "@/components/regions/CountryLanding";
import { ABROAD_COUNTRIES, getAbroadCountry } from "@/config/gcc";

type Props = { params: Promise<{ country: string }> };

// Malayali traders outside India and the GCC; the hub is the Kerala page.
const HUB: RegionHub = { path: "/abroad", label: "Malayalis abroad" };

export const dynamicParams = false;

export function generateStaticParams() {
  return ABROAD_COUNTRIES.map((country) => ({ country: country.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const country = getAbroadCountry((await params).country);
  return country ? countryMetadata(country, HUB) : {};
}

export default async function AbroadCountryPage({ params }: Props) {
  const country = getAbroadCountry((await params).country);
  if (!country) notFound();
  return <CountryLanding country={country} hub={HUB} />;
}
