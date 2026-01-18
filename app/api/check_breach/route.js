import crypto from "crypto";

export async function POST(request) 
{
  try {

    const { email, password } = await request.json();

    // ----- PASSWORD CHECK -----
    if (password) {
      // 1️⃣ Hash the password using SHA-1
      const sha1 = crypto
        .createHash("sha1")
        .update(password)
        .digest("hex")
        .toUpperCase();

      // 2️⃣ Extract the first 5 characters
      const prefix = sha1.substring(0, 5);
      const suffix = sha1.substring(5);

      // 3️⃣ Fetch from HIBP API
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await response.text();

      // 4️⃣ Look for the suffix in the returned list
      const lines = text.split("\n");
      let count = 0;

      for (const line of lines) {
        const [hashSuffix, leakCount] = line.split(":");
        if (hashSuffix.trim() === suffix) {
          count = parseInt(leakCount.trim(), 10);
          break;
        }
      }

      // 5️⃣ Return result
      return Response.json({
        type: "password",
        leaked: count > 0,
        count: count,
        message:
          count > 0
            ? `⚠️ Password found in ${count} breaches. Please change it immediately and adhere to strong password practices.`
            : "✅ Password not found in any known breaches.",
      });
    }
    if (email) 
    {
        // ----- EMAIL CHECK -----
        const response = await fetch(`https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`);
        const data = await response.json();
        
        if (data.success) 
        {
            const found = data.found;
            const breach_source = data.sources ? data.sources.map(source => source.name) : [];
            
            return Response.json({  
                type: "email",
                leaked: found > 0,
                count: found,
                sources: breach_source,
                message:`⚠️ Email found in ${found} breaches. Sources include: ${breach_source.join(", ")}. Do well to change your password immediately.`
            });
        }
    }
  }
  catch (error) {
    return Response.json(
      { error: "An error occurred while checking the breach." },
      { status: 500 }
    );
  }
}