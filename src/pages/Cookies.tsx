import { LegalLayout, H2 } from "@/components/LegalLayout";

const Cookies = () => (
  <LegalLayout title="Cookie Policy" updated="May 6, 2026">
    <p>
      This Cookie Policy explains how we use cookies and similar technologies on our
      website. You can manage your preferences at any time through the cookie banner.
    </p>

    <H2>What Are Cookies?</H2>
    <p>
      Cookies are small text files stored on your device when you visit a website. They
      help the site remember your actions and preferences over time.
    </p>

    <H2>Types of Cookies We Use</H2>
    <ul className="list-disc pl-5 space-y-2">
      <li>
        <strong>Essential cookies</strong> — required for the site to function (e.g.,
        login, security, language preference).
      </li>
      <li>
        <strong>Preference cookies</strong> — remember your theme and language choices.
      </li>
      <li>
        <strong>Analytics cookies</strong> — help us understand how visitors use the
        site so we can improve it. Only set if you accept.
      </li>
    </ul>

    <H2>Managing Cookies</H2>
    <p>
      You can accept or decline non-essential cookies through the banner shown on your
      first visit. You can also clear cookies through your browser settings at any time.
    </p>

    <H2>Third-Party Cookies</H2>
    <p>
      Some cookies may be set by third-party services we use, such as analytics or
      payment providers. These providers have their own privacy and cookie policies.
    </p>

    <H2>Contact</H2>
    <p>For questions about cookies, email hello@dalila.coach.</p>
  </LegalLayout>
);

export default Cookies;
