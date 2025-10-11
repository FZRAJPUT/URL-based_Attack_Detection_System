// const attackPatterns = {
//   "SQL Injection": /(union|select|insert|delete|drop|update|\bor\b|--)/i,
//   "XSS": /(<script>|%3Cscript|javascript:|alert\()/i,
//   "Directory Traversal": /(\.\.\/|\.\.\\)/i,
//   "Command Injection": /(;|&&|\|\||`|\$\(.*\))/i,
//   "File Inclusion": /(php\?|file=|include=|require=|\.php\?)/i,
//   "SSRF": /(http:\/\/|https:\/\/)(localhost|127\.0\.0\.1|169\.254\.)/i,
//   "Credential Stuffing": /(login|password|auth|sessionid|token)/i
// };

// export function detectAttack(url) {
//   for (const [type, pattern] of Object.entries(attackPatterns)) {
//     if (pattern.test(url)) {
//       return type;
//     }
//   }
//   return "Normal";
// }


// enhanced-detector.js
const DEFAULT_DECODE_ROUNDS = 3;

function safeDecode(input, rounds = DEFAULT_DECODE_ROUNDS) {
  if (typeof input !== "string") return input;
  let s = input;
  for (let i = 0; i < rounds; i++) {
    try {
      const d = decodeURIComponent(s);
      if (d === s) break;
      s = d;
    } catch (e) {
      break;
    }
  }
  return s;
}

/**
 * attackPatterns: keys are human-readable names, values are regexes.
 * Regexes intentionally kept conservative to avoid excessive false positives,
 * but they target common tokens/techniques used in attacks.
 */
const attackPatterns = {
  // ORIGINAL + slightly improved
  "SQL Injection": /\b(union|select|insert|delete|drop|update|create|alter|truncate|exec|declare)\b|(--|\/\*)/i,

  "XSS": /(<script\b|%3Cscript|javascript:|onerror=|onload=|alert\(|document\.cookie|<svg\b)/i,

  "Directory Traversal": /(\.\.\/|\.\.\\|%2e%2e|%5c%2e%2e|%2f%2e%2e)/i,

  // Command injection: semicolons, &&, ||, backticks, $(), pipes; capture common patterns but avoid matching benign semicolons in URLs
  "Command Injection": /(;|\|\||&&|`|\$\(.*\)|\|\s*sh\b|\|\s*bash\b)/i,

  // Local/remote file inclusion and suspicious file references
  "File Inclusion (LFI/RFI)": /(php:\/\/|php:|file=|include=|require=|require_once=|include_path=|\/etc\/passwd|%2Fetc%2Fpasswd|\.php\?|\.phtml\b|\.inc\b)/i,

  // SSRF / dangerous protocols + metadata IPs
  "SSRF": /(?:\b(?:http|https|file|gopher|dict|ftp|smb|sftp|tftp|nfs):\/\/)|(?:127(?:\.\d{1,3}){3})|(?:169\.254(?:\.\d{1,3}){2})|(?:0x[0-9a-f]+)|(?:localhost)|(?:::1\b)/i,

  // Detect attempts targeting cloud metadata services
  "Cloud Metadata Access": /(169\.254\.169\.254|metadata\.google|metadata\.azure|169\.254|instance-data\/latest|latest\/meta-data)/i,

  // Open redirect patterns
  "Open Redirect": /(redirect=|next=|url=|(return|target|dest)=).*(http:\/\/|https:\/\/|\/\/)/i,

  // XXE (XML external entity) and XML bombing tokens
  "XXE / XML Injection": /<!ENTITY\s+|<!DOCTYPE\s+|SYSTEM\s+["']?file:|!ENTITY\s+%/i,

  // XPath / LDAP injection tokens
  "LDAP Injection": /\b(ldap[s]?:\/\/|uid=|ou=|dc=|(&(.*=))|(\|\|).*?=)/i,
  "XPath Injection": /('|\"|\bconcat\(|\/\*|\[contains\(|\/\.\.)/i,

  // CRLF / HTTP Header injection (e.g., \r\n or %0d%0a in inputs)
  "CRLF / HTTP Header Injection": /(\\r\\n|%0d%0a|%0a%0d|%0d|\r\n|\n\r)/i,

  // Data URI abuse (used to embed payloads) or base64 inline content
  "Data URI / Inline Payload": /\bdata:(?:text|image|application)\/[a-z0-9.+-]+;base64,/i,

  // Suspicious file extensions that sometimes indicate attempted downloads/executables
  "Suspicious File Extension": /\.(php|phtml|pl|cgi|exe|sh|bat|ps1|asp|aspx|jsp)\b/i,

  // Credential leakage or sensitive tokens in URL
  "Credential Leakage": /\b(password|passwd|pwd|secret|token|api_key|auth|sessionid|access_token)=/i,

  // Header-like tokens in parameters (Host header attacks)
  "Host Header / Host Tampering": /\b(host:|x-forwarded-for:|x-real-ip:)/i,

  // Probable scanner / pentest probes (nmap, nikto, sqlmap strings)
  "Scanner / Automated Probe": /(sqlmap|nmap|nikto|acunetix|fuzz|dirbuster|wfuzz)/i,

  // Generic high-risk: long sequences of % encoded characters (obfuscation) or excessive dots/slashes
  "Obfuscation / Encoding Abuse": /(%[0-9a-f]{2}){4,}|(?:\.\.\/){2,}|(?:%2e%2e){2,}/i
};

/**
 * detectAttack(urlOrInput)
 * - urlOrInput: string (raw URL or parameter value)
 * Returns: { type: string, matchedPattern: string|null }
 * Keep API similar to your original but richer info.
 */
export function detectAttack(input) {
  if (typeof input !== "string") return "Normal";

  // Keep original raw and a decoded, normalized version
  const raw = input;
  const decoded = safeDecode(raw).toLowerCase();

  // Test each pattern against both decoded and raw forms
  for (const [type, pattern] of Object.entries(attackPatterns)) {
    try {
      if (pattern.test(decoded) || pattern.test(raw)) {
        return type;
      }
    } catch (e) {
      // If a regex errors for some reason, skip it (avoid breaking detection)
      continue;
    }
  }

  return "Normal";
}

/* === Example quick tests (uncomment to run) ===
console.log(detectAttack("https://example.com/get?path=..%5C..%5CWindows%5Csystem32%5Cdrivers%5Cetc%5Chosts"));
// -> "Directory Traversal"

console.log(detectAttack("https://example.com/fetch?url=http://169.254.169.254/latest/meta-data/"));
// -> "Cloud Metadata Access" or "SSRF / Dangerous Protocols"

console.log(detectAttack("https://example.com/?q=<script>alert(1)</script>"));
// -> "XSS"
*/
