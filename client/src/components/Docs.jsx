import React, { useState } from "react";
import { FaCode, FaCopy, FaCheckCircle, FaShieldAlt } from "react-icons/fa";

const Docs = () => {
  // separate copied state for each snippet
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedHTML, setCopiedHTML] = useState(false);
  const [copiedReact, setCopiedReact] = useState(false);

  const handleCopy = async (text, setCopied) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback: create a temporary textarea
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      // optionally show a UI fallback or link to download the snippet
    }
  };

  const scriptTag = `<script src="https://url-based-attack-detection-system.onrender.com/attack_detection_system.v1.js" async></script>`;

  const htmlExample = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>checkAttack - HTML Example</title>
</head>
<body>
  <form id="demo-form">
    <input id="email" name="email" type="text" placeholder="your email" />
    <input id="username" name="username" type="text" placeholder="username" />
    <button type="submit">Submit</button>
  </form>

  <script src="https://url-based-attack-detection-system.onrender.com/attack_detection_system.v1.js" async></script>
  <script>
    const OWNER_ID = "public-owner-id"; // avoid secrets
    const API_BASE = "https://url-based-attack-detection-system.onrender.com";

    document.getElementById('demo-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (typeof window.checkAttack !== 'function') {
        console.error('Detection script missing');
        return;
      }
      try {
        const result = await window.checkAttack(OWNER_ID, API_BASE, 'email', 'username');
        console.log(result);
        if (result && result.flagged) {
          alert('Suspicious input detected. Submission blocked.');
          return;
        }
        // proceed with your submission logic
      } catch (err) {
        console.error('checkAttack failed', err);
      }
    });
  </script>
</body>
</html>`;

  const reactExample = `import React, { useEffect, useState } from "react";

export default function AttackForm() {
  const [loaded, setLoaded] = useState(false);
  const SCRIPT_URL = "https://url-based-attack-detection-system.onrender.com/attack_detection_system.v1.js";

  useEffect(() => {
    if (document.querySelector(\`script[src="\${SCRIPT_URL}"]\`)) {
      setLoaded(true);
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => setLoaded(true);
    s.onerror = () => console.error('Script failed to load');
    document.body.appendChild(s);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loaded || typeof window.checkAttack !== 'function') {
      console.error('checkAttack not available');
      return;
    }
    const OWNER_ID = process.env.REACT_APP_OWNER_ID || 'public-owner-id';
    try {
      const res = await window.checkAttack(OWNER_ID, 'https://url-based-attack-detection-system.onrender.com', 'mail');
      if (res && res.flagged) {
        alert('Suspicious input detected.');
        return;
      }
      // proceed
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="mail" type="text" placeholder="Enter value" className="border rounded px-3 py-2" />
      <button type="submit" className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
    </form>
  );
}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800 py-10 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <FaShieldAlt className="text-5xl text-indigo-600 mx-auto mb-3 animate-pulse" />
          <h1 className="text-4xl font-bold mb-2 text-indigo-700">Attack Detection Script Documentation</h1>
          <p className="text-gray-600 text-lg">Integrate real-time URL-based attack detection into any web project easily.</p>
        </div>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 text-indigo-600"><FaCode /> Quick Start</h2>
          <p className="text-gray-600 mb-4">Include our script to instantly monitor and detect attacks such as SQL Injection, XSS, Directory Traversal, and more.</p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 relative">
            <pre className="overflow-x-auto text-sm whitespace-pre">{scriptTag}</pre>
            <button
              onClick={() => handleCopy(scriptTag, setCopiedScript)}
              aria-label="Copy script tag"
              className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs flex items-center gap-1"
            >
              {copiedScript ? <FaCheckCircle /> : <FaCopy />} {copiedScript ? "Copied" : "Copy"}
            </button>
            <div aria-live="polite" className="sr-only">{copiedScript ? "Script tag copied" : ""}</div>
          </div>
        </section>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600 flex items-center gap-2"><FaCode /> Using in Plain HTML</h2>
          <p className="text-gray-600 mb-4">Add the following script tags directly into your HTML file. It will automatically attach attack detection to your form submissions.</p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 relative">
            <pre className="overflow-x-auto text-sm whitespace-pre">{htmlExample}</pre>
            <button
              onClick={() => handleCopy(htmlExample, setCopiedHTML)}
              aria-label="Copy html example"
              className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs flex items-center gap-1"
            >
              {copiedHTML ? <FaCheckCircle /> : <FaCopy />} {copiedHTML ? "Copied" : "Copy"}
            </button>
            <div aria-live="polite" className="sr-only">{copiedHTML ? "HTML copied" : ""}</div>
          </div>
        </section>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600 flex items-center gap-2"><FaCode /> Using in React</h2>
          <p className="text-gray-600 mb-4">
            To integrate in React, load the script dynamically and call <code className="bg-gray-200 px-1 rounded">window.checkAttack()</code> when your form is submitted.
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 relative">
            <pre className="overflow-x-auto text-sm whitespace-pre">{reactExample}</pre>
            <button
              onClick={() => handleCopy(reactExample, setCopiedReact)}
              aria-label="Copy react example"
              className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs flex items-center gap-1"
            >
              {copiedReact ? <FaCheckCircle /> : <FaCopy />} {copiedReact ? "Copied" : "Copy"}
            </button>
            <div aria-live="polite" className="sr-only">{copiedReact ? "React snippet copied" : ""}</div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-600 flex items-center gap-2"><FaShieldAlt /> Detected Attack Types</h2>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
            <li>• SQL Injection</li>
            <li>• XSS (Cross-Site Scripting)</li>
            <li>• Command Injection</li>
            <li>• File Inclusion</li>
            <li>• Directory Traversal</li>
            <li>• CSRF / SSRF</li>
            <li>• Credential Exposure</li>
            <li>• Open Redirects</li>
            <li>• JWT Manipulation</li>
          </ul>
          <p className="mt-4 text-gray-600 text-sm">Detected malicious inputs are logged automatically in your dashboard for security analysis.</p>
        </section>

        <footer className="mt-16 text-center text-sm text-gray-500">© 2025 URL-Based Attack Detection System • Made with ❤️ by Security Team</footer>
      </div>
    </div>
  );
};

export default Docs;
