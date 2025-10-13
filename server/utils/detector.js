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

const attackPatterns = {
  "SQL Injection": /(union\b|select\b|insert\b|delete\b|drop\b|update\b|\bor\b|--|\/\*|\*\/|;--)/i,
  "XSS (Cross-Site Scripting)": /(<script\b|%3Cscript|javascript:|alert\(|onerror=|onload=|document\.cookie)/i,
  "Directory Traversal": /(\.\.\/|\.\.\\|%2e%2e%2f)/i,
  "Command Injection / RCE": /(;|\bexec\b|\bsystem\b|\bpassthru\b|\b`.+`|\$\(.*\)|\|\| |&&)/i,
  "File Inclusion (LFI/RFI)": /(php\?|file=|include=|require=|require_once=|include_once=|remote_file=|https?:\/\/.*\.php)/i,
  "SSRF (Server-Side Request Forgery)": /(http:\/\/|https:\/\/)(localhost|127\.0\.0\.1|169\.254\.|0\.0\.0\.0|169\.254)/i,
  "Credential Stuffing / Secrets in URL": /(login|password|pass=|auth|sessionid|token|apikey|api_key)/i,
  "CSRF (Cross-Site Request Forgery)": /(csrf_token|xsrf|origin:.*(evil|attacker)|referer:.*(evil|attacker))/i,
  "Open Redirect": /(redirect=|return_url=|next=|url=)(https?:\/\/)/i,
  "Insecure Deserialization": /(deserialize\(|unserialize\(|pickle.loads\(|BinaryFormatter)/i,
  "XXE (XML External Entity)": /(<!ENTITY\s+|&\w+;|system\("\/|file:\/\/)/i,
  "LDAP Injection": /(\(|\)|\*|&\||\bOR\b|\bAND\b|cn=|uid=)/i,
  "CRLF Injection / Header Injection": /(%0d%0a|\r\n|%0a%0d|%0a|%0d|Content-Disposition:|Set-Cookie:)/i,
  "HTTP Response Splitting": /(\r\n.*Location:)/i,
  "Clickjacking / UI Redressing": /(X-Frame-Options:|frame-ancestors)/i,
  "Brute Force / Password Spray": /(failed login|invalid credentials|401|403|too many attempts|rate limit)/i,
  "DOS / Slowloris-style": /(slowloris|slow headers|Content-Length: 0|Connection: keep-alive.*timeout|SYN flood)/i,
  "File Upload Abuse / Web Shell": /(<\?php|\.php\$|eval\(|base64_decode\(|shell_exec\(|popen\()/i,
  "CSV Injection": /^(=|\+|-|@).+/m,
  "SMTP / Email Injection": /(To:.*\r\n|Subject:.*\r\n|bcc:|cc:|%0a|%0d\n)/i,
  "Open Ports / Port Scan Indicators": /(Nmap|masscan|zmap|SYN scan|NULL scan)/i,
  "API Abuse / Parameter Tampering": /(admin=true|is_admin=1|role=admin|user_id=\d+;|id=0x)/i,
  "JWT Manipulation / Invalid Tokens": /(eyJhbGci|alg=none|HS256|RS256)/i
};

export function detectAttack(input) {
  if (typeof input !== "string") return "Normal";
  const raw = input;
  const decoded = safeDecode(raw).toLowerCase();
  for (const [type, pattern] of Object.entries(attackPatterns)) {
    try {
      if (pattern.test(decoded) || pattern.test(raw)) {
        return type;
      }
    } catch (e) {
      continue;
    }
  }
  return "Normal";
}
