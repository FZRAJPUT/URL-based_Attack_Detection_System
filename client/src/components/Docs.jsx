import React, { useState } from "react";
import { FaCopy, FaCheckCircle } from "react-icons/fa";
import { CheckAttackDocs } from "./CheckAttackDocs";

const Docs = () => {
  const [copiedCDN, setCopiedCDN] = useState(false);
  const [copiedForm, setCopiedForm] = useState(false);
  const [copiedSubmit, setCopiedSubmit] = useState(false);

  const handleCopy = async (text, setCopied) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
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
    }
  };

  const cdnScript = `<script src="https://url-based-attack-detection-system.onrender.com/attack_detection_system" defer></script>`;
  const htmlForm = `<form id="my-form">
  <input id="email" placeholder="Email" />
  <input id="username" placeholder="Username" />
  <button type="submit">Submit</button>
</form>`;
  const submitHandler = `<script>
    document.getElementById('my-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      // ----------------------------------------------------
      // STEP 1: Configure your authentication details
      // ----------------------------------------------------
      // USER_EMAIL - registered email in your system
      // API_URL    - API URL (available on official website)
      const auth = {
        USER_EMAIL: "yourEmail@gmail.com",   // change this to your registered email
        API_URL: "https://url-based-attack-detection-system.onrender.com",       // BASE URL
        // timeout: 5000                        // (optional) custom timeout in milliseconds
      };

      // ----------------------------------------------------
      // STEP 2: Call the checkAttack function
      // ----------------------------------------------------
      // Pass: (auth object, input field IDs)
      // You can include any number of input IDs to scan.
      const response = await checkAttack(auth, "email", "username");

      // Log the full result for debugging or development
      console.log("checkAttack result:", response);

      // ----------------------------------------------------
      // STEP 3: Handle the response from the attack detector
      // ----------------------------------------------------
      // The response includes an array of results for each input value.
      // Each item contains information like whether it's "Safe" or not.
      if (response) {
        if (response.attacks && Array.isArray(response.attacks)) {
          // Check if any of the inputs are unsafe
          const flagged = response.attacks.some(r => r.status !== "Safe");

          // If an unsafe pattern is detected, show an alert
          if (flagged) {
            alert("Suspicious Activity detected"); // you can remove it or can use your login for this
            return;
          }
          console.log("Inputs are safe — continue with form submission logic.");
        }
      // write your form submission login here
      } else {
        // In case of network error or unexpected failure
        console.warn("checkAttack failed:", res && res.error, "local:", res && res.localFallback);
      }
    });
  </script>`;

  const CodeBlock = ({ code, copied, setCopied }) => (
    <div className="relative bg-gray-50 p-4 rounded-md border border-gray-200 mb-4 overflow-x-auto break-words sm:overflow-x-auto">
      <pre className="text-sm sm:text-base font-mono whitespace-pre-wrap">{code}</pre>
      <button
        onClick={() => handleCopy(code, setCopied)}
        className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs sm:text-sm flex items-center gap-1"
      >
        {copied ? <FaCheckCircle /> : <FaCopy />} {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );

  return (
    <div className="p-4 pt-20 max-w-5xl mx-auto font-sans">
      <p className="mb-6 text-gray-700 text-sm sm:text-base">Developed InputShield, a web-based security solution designed to prevent SQL Injection, XSS, and malicious input attacks in web applications. Implemented input sanitization and attack detection mechanisms integrated with a real-time dashboard for monitoring suspicious activities.</p>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">CDN Integration Guide</h1>
      <p className="mb-6 text-gray-700 text-sm sm:text-base">
        This guide explains how to integrate the URL-Based Attack Detection System into your web projects using our CDN script.
      </p>

      {/* Step 1 */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Step 1: Add the CDN Script</h2>
        <p className="mb-2 text-gray-600 text-sm sm:text-base">
          Include the CDN script in your HTML page before the closing <code>&lt;/body&gt;</code> tag. Use <code>defer</code> to load it after the DOM.
        </p>
        <CodeBlock code={cdnScript} copied={copiedCDN} setCopied={setCopiedCDN} />
      </section>

      {/* Step 2 */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Step 2: Add Your Form</h2>
        <p className="mb-2 text-gray-600 text-sm sm:text-base">
          Add input fields with unique <code>id</code> attributes for the values you want to check.
        </p>
        <CodeBlock code={htmlForm} copied={copiedForm} setCopied={setCopiedForm} />
      </section>

      {/* Step 3 */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Step 3: Call the <code>checkAttack</code> Function</h2>
        <p className="mb-2 text-gray-600 text-sm sm:text-base">
          Call <code>checkAttack(auth, ...inputIDs)</code> inside your form submit handler. Replace the email, API URL, and input IDs with your values.
        </p>
        <CodeBlock code={submitHandler} copied={copiedSubmit} setCopied={setCopiedSubmit} />
      </section>

      {/* Step 4 */}
      <section className="mb-8">
        <CheckAttackDocs />
      </section>

      {/* Best Practices */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Best Practices</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm sm:text-base">
          <li>Always use HTTPS for your API URL in production.</li>
          <li>Do not send sensitive data like passwords or credit card numbers.</li>
          <li>Use unique IDs for all inputs you want to check.</li>
          <li>Use <code>defer</code> when including the CDN script.</li>
          <li>Always check <code>res.attacks</code> before allowing form submission.</li>
        </ul>
      </section>

      {/* Summary */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Summary</h2>
        <p className="text-gray-700 text-sm sm:text-base">
          Your project is now protected against common URL-based attacks. Developers can integrate your attack detection CDN quickly and safely.
        </p>
      </section>
    </div>
  );
};

export default Docs;
