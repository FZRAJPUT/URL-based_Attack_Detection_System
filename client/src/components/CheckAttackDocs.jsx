import React from "react";

const exampleResponse = {
  success: true,
  message: "Analyzed successfully",
  attacks: [
    {
      attack_type: "Normal",
      url: "data of 1st input id",
      status: "Safe",
      device_info: {
        browser: "Chrome 141.0.0.0",
        os: "Windows 10",
        deviceType: "Desktop",
      },
      location: {
        range: [152, 152],
        country: "IN",
        region: "DL",
        eu: "0",
        timezone: "Asia/Kolkata",
      },
      origin: "https:example.com",
      source_ip: "152.59.80.54",
      target_ip: "152.59.80.54",
      user_info: "68ede1a3d3df6296360ade35",
    },
    {
      attack_type: "XSS (Cross-Site Scripting)",
      url: "data of 2nd input id",
      status: "Attempted",
      device_info: {
        browser: "Chrome 141.0.0.0",
        os: "Windows 10",
        deviceType: "Desktop",
      },
      location: {
        range: [152, 152],
        country: "IN",
        region: "DL",
        eu: "0",
        timezone: "Asia/Kolkata",
      },
      origin: "https:example.com",
      source_ip: "152.59.80.54",
      target_ip: "unresolved",
      user_info: "68ede1a3d3df6296360ade35",
    },
  ],
};

export const CheckAttackDocs = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4">📖 checkAttack Response Example</h1>

      <p className="mb-4">
        When you call <code>checkAttack(auth, "email", "username")</code>, you receive a response object like this:
      </p>

      <pre className="bg-gray-100 p-4 rounded mb-6 overflow-x-auto">
        {JSON.stringify(exampleResponse, null, 2)}
      </pre>

      <h2 className="text-2xl font-semibold mb-2">Fields Explained</h2>

      <ul className="list-disc list-inside mb-6">
        <li>
          <strong>success</strong>: Whether the API call succeeded (<code>true</code>/ <code>false</code>).
        </li>
        <li>
          <strong>message</strong>: Human-readable message from the API.
        </li>
        <li>
          <strong>attacks</strong>: Array of scanned inputs. Each object includes:
          <ul className="list-disc list-inside ml-5 mt-2">
            <li><strong>attack_type</strong>: Detected attack type (e.g., "XSS", "SQL Injection", "Normal").</li>
            <li><strong>url</strong>: The value submitted in the input field.</li>
            <li><strong>status</strong>: "Safe", "Attempted", etc.</li>
            <li><strong>device_info</strong>: Browser, OS, and device type.</li>
            <li><strong>location</strong>: Country, region, timezone, and IP range.</li>
            <li><strong>origin</strong>: Page URL where the input was detected.</li>
            <li><strong>source_ip</strong>: IP address of the client.</li>
            <li><strong>target_ip</strong>: IP address of your backend server (or "unresolved").</li>
            <li><strong>user_info</strong>: Unique ID of the user in your system.</li>
          </ul>
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">How to Handle the Response</h2>

      <p className="mb-2">
        You can use the <code>status</code> field to determine if an input is safe or needs to be blocked:
      </p>

      <ul className="list-disc list-inside mb-6">
        <li>If <code>status === "Safe"</code> → input is safe, you can proceed.</li>
        <li>If <code>status !== "Safe"</code> → input is suspicious. Highlight the field, block submission, and show a message.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Example: Blocking Suspicious Inputs</h2>

      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
{`res.attacks.forEach((item, index) => {
  if(item.status !== "Safe") {
    const el = document.getElementById(inputIds[index]);
    if(el) el.style.outline = "3px solid red"; // highlight suspicious input
  }
});`}
      </pre>

      <p>
        Using this response, developers can easily visualize which inputs are safe and which require attention.
      </p>
    </div>
  );
};
