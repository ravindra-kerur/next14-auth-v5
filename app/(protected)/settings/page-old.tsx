"use client";
import { logout } from "@/actions/logout";
import useCurrentUser from "@/hooks/use-current-user";
// import { currentUser } from "@/hooks/use-current-user";
import { Session } from "next-auth";
import { useSession, signOut, getSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const SettingsPage = () => {
  const user = useCurrentUser();
  const currentUser = user;

  const onClick = () => {
    // In client component to use session we have to use: useSession()
    // This is one method to use signout in client component
    // signOut();

    // This is another method to signout from server component
    logout();
  };

  return (
    <div>
      {!currentUser ? (
        "Loading..."
      ) : (
        <div className="bg-white p-10 rounded-xl">
          <button onClick={onClick} type="submit">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
