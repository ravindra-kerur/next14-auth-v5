"use client";
// import { useSession } from "next-auth/react";

// export const useCurrentRole = () => {
//   const session = useSession();
//   return session.data?.user.role;
// };

import { useCallback, useEffect, useState } from "react";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

const useCurrentRole = () => {
  const [session, setSession] = useState<Session | null>(null);

  const retrieveSession = useCallback(async () => {
    try {
      const sessionData = await getSession();
      if (sessionData) {
        setSession(sessionData);
        return;
      }
    } catch (error) {
      setSession(null);
    }
  }, []);

  useEffect(() => {
    if (!session) {
      retrieveSession();
    }
  }, [session]);

  const user = session?.user;
  return user;
};

export default useCurrentRole;
