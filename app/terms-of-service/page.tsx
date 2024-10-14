"use client";

import React from "react";

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using UniqueWin (operated by UniqueWin Ltd), you agree
          to be bound by these Terms of Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
        <p>
          You must be at least 18 years old to use UniqueWin. By using the
          service, you represent and warrant that you are of legal age.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Account Registration</h2>
        <p>
          To participate in games, you may need to create an account. You are
          responsible for maintaining the confidentiality of your account
          information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          4. Game Rules and Prizes
        </h2>
        <p>
          Game rules, including entry fees and prize distributions, are subject
          to change. UniqueWin reserves the right to modify game mechanics at
          any time.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Payment and Refunds</h2>
        <p>
          All payments are final. Refunds may be issued at the sole discretion
          of UniqueWin Ltd.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          6. Intellectual Property
        </h2>
        <p>
          All content on UniqueWin is the property of UniqueWin Ltd and is
          protected by copyright laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          7. Limitation of Liability
        </h2>
        <p>
          UniqueWin Ltd is not liable for any direct, indirect, incidental, or
          consequential damages resulting from your use of the service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">8. Governing Law</h2>
        <p>
          These Terms of Service are governed by the laws of the United Kingdom.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
        <p>
          UniqueWin reserves the right to modify these Terms of Service at any
          time. Continued use of the service constitutes acceptance of the
          modified terms.
        </p>
      </section>

      <p className="mt-8 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default TermsOfService;
