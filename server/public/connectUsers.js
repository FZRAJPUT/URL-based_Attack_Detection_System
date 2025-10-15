
(function () {
  if (window.checkAttack && window.attackDetectorPresent) return;
  window.attackDetectorPresent = true;

  const fetchWithTimeout = (url, opts = {}, timeout = 7000) =>
    Promise.race([
      fetch(url, opts),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))
    ]);

  async function checkAttack(options, ...inputs) {
    try {
      if (!options || !options.USER_EMAIL) {
        return { success: false, message: "Missing users email" };
      }

      if (!options.API_URL) {
        return { success: false, message: "Missing users API_URL" };
      }

      const inputValues = inputs
        .map(id => {
          try {
            const el = document.getElementById(id);
            return el ? el.value : null;
          } catch (e) {
            return null;
          }
        })
        .filter(val => val !== null && String(val).trim() !== "");

      if (inputValues.length === 0) {
        return { success: false, message: "No valid input values found" };
      }

      const url = String(options.API_URL).replace(/\/$/, "") + "/api/attacks/analyze";
      const res = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ urls: inputValues, email: options.USER_EMAIL })
      }, options.timeout || 7000);

      if (!res || !res.ok) {
        return { success: false, message: `Server error: ${res ? res.status : "no response"}` };
      }

      const json = await res.json();
      return json;
    } catch (error) {
      return { success: false, message: "Network error", error: error && error.message ? error.message : String(error) };
    }
  }

  window.checkAttack = checkAttack;
})();
