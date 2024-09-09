"use client";

import useCurrentRole from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import FormError from "../form-error";

interface RolegateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

const RoleGate = ({ children, allowedRole }: RolegateProps) => {
  const role = useCurrentRole();

  if (role?.role !== allowedRole) {
    return (
      role?.role && (
        <FormError message="You do not have permission to view this content!" />
      )
    );
  }

  return <>{children}</>;
};

export default RoleGate;
