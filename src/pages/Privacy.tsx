import { LegalLayout, H2 } from "@/components/LegalLayout";

const Privacy = () => (
  <LegalLayout title="Privacy Policy" updated="May 6, 2026">
    <p>
      This Privacy Policy explains how Dalila Bahtijarevic ("we", "us", "our") collects,
      uses, and protects your personal information when you visit this website or use our
      coaching services.
    </p>

    <H2>Information We Collect</H2>
    <p>
      We collect information you provide directly when you create an account, contact us,
      or sign up for a pack, including your name, email address, date of birth, country,
      and any details you submit through forms.
    </p>
    <p>
      We also automatically collect technical information such as browser type, device,
      IP address, pages visited, and referral source to improve the site experience.
    </p>

    <H2>How We Use Your Information</H2>
    <ul className="list-disc pl-5 space-y-2">
      <li>To create and manage your account.</li>
      <li>To deliver coaching, packs, and customer support.</li>
      <li>To send updates, offers, and service communications you opted into.</li>
      <li>To analyze usage and improve our website.</li>
      <li>To comply with legal obligations.</li>
    </ul>

    <H2>Sharing Your Information</H2>
    <p>
      We do not sell your personal data. We share information only with trusted service
      providers (payment, hosting, email, analytics) who help us operate the service, and
      where required by law.
    </p>

    <H2>Your Rights (GDPR)</H2>
    <p>
      If you are in the EU/EEA, you have the right to access, correct, delete, or export
      your data, restrict or object to processing, and withdraw consent at any time. To
      exercise these rights, contact us at hello@dalila.coach.
    </p>

    <H2>Data Retention</H2>
    <p>
      We keep your personal data only as long as needed to provide the services and meet
      legal obligations, after which it is deleted or anonymized.
    </p>

    <H2>Contact</H2>
    <p>For privacy questions, email hello@dalila.coach.</p>
  </LegalLayout>
);

export default Privacy;
