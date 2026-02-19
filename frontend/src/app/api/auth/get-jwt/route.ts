import { auth } from "@/lib/auth-server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;

export async function GET() {
  if (!BETTER_AUTH_SECRET) {
    return NextResponse.json(
      { detail: "Authentication secret is not configured on the server." },
      { status: 500 }
    );
  }

  const headerList = await headers();
  // Convert the read-only Headers object into a plain JavaScript object
  const headersObject: { [key: string]: string } = {};
  for (const [key, value] of headerList.entries()) {
    headersObject[key] = value;
  }

  const session = await auth.api.getSession({ headers: headersObject });

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  try {
    // Generate a new, short-lived JWT for the external API.
    // The payload should contain enough information for the backend to identify the user.
    // 'sub' is standard for subject (user ID).
    const apiJwt = jwt.sign(
      { sub: session.user.id, email: session.user.email, name: session.user.name },
      BETTER_AUTH_SECRET,
      { expiresIn: "15m" } // Short-lived token for API access
    );

    return NextResponse.json({ token: apiJwt });
  } catch (error) {
    console.error("Error generating API JWT:", error);
    return NextResponse.json(
      { detail: "Error generating API token" },
      { status: 500 }
    );
  }
}
