"use client";

import React from "react";

type Props = {};

function page({}: Props) {
  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          1. Information We Collect
        </h2>
        <p>
          We collect personal information that you provide to us, such as your
          name, email address, and payment information when you register for an
          account or participate in our games.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          2. How We Use Your Information
        </h2>
        <p>
          We use your information to provide and improve our services, process
          transactions, communicate with you, and comply with legal obligations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized or unlawful
          processing, accidental loss, destruction, or damage.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Cookies</h2>
        <p>
          We use cookies and similar technologies to enhance your experience on
          our website. You can manage your cookie preferences through your
          browser settings.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Third-Party Services</h2>
        <p>
          We may use third-party services that collect, monitor and analyze this
          type of information in order to increase our Service's functionality.
          These third-party service providers have their own privacy policies
          addressing how they use such information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal
          information. You may also have the right to restrict or object to
          certain processing of your data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          7. Changes to This Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at [contact email].
        </p>
      </section>

      <p className="mt-8 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}

export default page;
