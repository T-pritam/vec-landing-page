/**
 * One-line accreditation proof for the footer (rewrite doc).
 */
const PROOF =
  "Accredited Person under VEU. Re-tested every year. Whole chain in house. Operating since 2021.";

export function FooterProofStrip() {
  return <p className="text-xs font-medium text-white/55">{PROOF}</p>;
}
