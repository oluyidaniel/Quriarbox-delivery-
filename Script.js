  // ── Change this to your Flask server URL ───────────────────────────
  const API_URL = "http://localhost:5000/api/contact";
  // ──────────────────────────────────────────────────────────────────

  const form      = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const toast     = document.getElementById("toast");
  let toastTimer;

  function showToast(msg, type = "success") {
    clearTimeout(toastTimer);
    toast.textContent = (type === "success" ? "✓  " : "✗  ") + msg;
    toast.className = `show ${type}`;
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4500);
  }

  function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function validate() {
    let ok = true;
    const fields = [
      { id: "name",    errId: "nameErr",    check: v => v.trim().length >= 2 },
      { id: "email",   errId: "emailErr",   check: v => validateEmail(v.trim()) },
      { id: "phone",   errId: "phoneErr",   check: v => v.trim().length >= 5 },
      { id: "message", errId: "messageErr", check: v => v.trim().length >= 5 },
    ];

    fields.forEach(({ id, errId, check }) => {
      const el  = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!check(el.value)) {
        el.classList.add("error");
        err.classList.add("show");
        ok = false;
      } else {
        el.classList.remove("error");
        err.classList.remove("show");
      }
    });
    return ok;
  }

  // Clear error on input
  ["name","email","phone","message"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      document.getElementById(id).classList.remove("error");
      document.getElementById(id + "Err").classList.remove("show");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    const payload = {
      name:    document.getElementById("name").value.trim(),
      email:   document.getElementById("email").value.trim(),
      phone:   document.getElementById("phone").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    try {
      const res  = await fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast(data.message, "success");
        form.reset();
      } else {
        const msg = data.errors?.join(" ") || "Something went wrong.";
        showToast(msg, "error");
      }
    } catch (_) {
      showToast("Network error — please try again.", "error");
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
