"use client"; // needed because we use DOM and fetch

export default function Home() {
  return (
    <>
      <header className="header">
        <h1>🔒BREACHED🗝️</h1>
        <h2>
          <p className="tagline">
            Check if your email and password have been exposed in a data breach
          </p>
        </h2>
      </header>

      <main className="container">
        {/* EMAIL CHECK SECTION */}
        <section className="form-section">
          <h2>Email Breach Check</h2>
          <form id="emailForm">
            <label htmlFor="email">Enter your email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. user@example.com"
              required
            />
            <button type="submit" id="checkEmailBtn">
              Check Email
            </button>
          </form>

          <div id="emailLoader" className="loader hidden"></div>
          <div id="emailResult" className="result hidden"></div>
        </section>

        {/* PASSWORD CHECK SECTION */}
        <section className="form-section">
          <h2>Password Breach Check</h2>
          <form id="passwordForm">
            <label htmlFor="password">Enter your password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
            <button type="submit" id="checkPasswordBtn">
              Check Password
            </button>
          </form>

          <div id="passwordLoader" className="loader hidden"></div>
          <div id="passwordResult" className="result hidden"></div>
        </section>

        {/* INFO SECTION */}
        <section className="info">
          <h2>About BREACHED</h2>
          <p>
            BREACHED allows you to securely check whether your email or password
            has appeared in any known data breaches. Your data is never stored —
            all checks are simulated locally for this demo version.
          </p>
          <p className="note">
            Stay informed, update your passwords regularly, and enable
            two-factor authentication wherever possible.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 BREACHED | Developed by Engineer Peter</p>
      </footer>

      {/* ===== EMAIL AND PASSWORD LOGIC ===== */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          const emailForm = document.getElementById("emailForm");
          const emailResult = document.getElementById("emailResult");
          const emailLoader = document.getElementById("emailLoader");

          emailForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();

            emailLoader.classList.remove("hidden");
            emailResult.classList.add("hidden");

            try {
              const res = await fetch("/api/check_breach", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email }),
              });
              const data = await res.json();
              console.log(data);
              emailLoader.classList.add("hidden");
              emailResult.classList.remove("hidden");
              emailResult.innerHTML = \`
                <div class="info">
                  <h3>Email Check Result</h3>
                  <p>\${data.message}</p>
                </div>
              \`;
            } catch(err) { console.log(err); }
          });

          const passwordForm = document.getElementById("passwordForm");
          const passwordResult = document.getElementById("passwordResult");
          const passwordLoader = document.getElementById("passwordLoader");

          passwordForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const password = document.getElementById("password").value.trim();
            if(password.length <= 6) {
              alert("Please enter a password longer than 8 characters for better security.");
              return;
            }

            passwordLoader.classList.remove("hidden");
            passwordResult.classList.add("hidden");

            try {
              const res = await fetch("/api/check_breach", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: password }),
              });
              const data = await res.json();
              console.log(data);
              passwordLoader.classList.add("hidden");
              passwordResult.classList.remove("hidden");
              passwordResult.innerHTML = \`
                <div class="info">
                  <h3>Password Check Result</h3>
                  <p>\${data.message}</p>
                </div>
              \`;
            } catch(err) { console.log(err); }
          });
        `,
        }}
      />
    </>
  );
}
