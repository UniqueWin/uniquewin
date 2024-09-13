"use client";

import React from "react";

const Winners = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Winners</h1>
      <p className="mb-4">Congratulations to our recent winners!</p>
      {/* You can add a list or table of winners here */}
      <ul className="list-disc list-inside">
        <li>John Doe - £1000</li>
        <li>Jane Smith - £500</li>
        <li>Bob Johnson - £250</li>
      </ul>
    </div>
  );
};

export default Winners;