// To get user info from 'hook'
"use client";
import { useCurrentRole } from "@/hooks/use-current-role";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RoleGate from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { admin } from "@/actions/admin";

const AdminPage = () => {
  //   const role = useCurrentRole();
  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("Allowed API routes");
      } else {
        toast.error("Forbidden API routes");
      }
    });
  };

  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>

        <div className="flex flex-row items-center justify-between border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin only API route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div className="flex flex-row items-center justify-between border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin only server action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// To get user info from 'auth'
// import { currentRole } from "@/lib/auth";

// const AdminPage = async () => {
//   const role = await currentRole();
//   return <div>Current role: {role} </div>;
// };

export default AdminPage;
