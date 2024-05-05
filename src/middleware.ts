import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

async function isWhitelisted(req: NextRequest, email: string) {
  const res = await fetch(`${req.nextUrl.origin}/api/whitelist`, {
    method: 'GET',
  });
  const { users } = await res.json();
  const owner = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
  if (users.includes(email) || email === owner) {
    return true;
  }
  return false;
}

export default withAuth(
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (token && token?.email) {
          return isWhitelisted(req, token.email);
        }
        return false;
      },
    },
  },
);