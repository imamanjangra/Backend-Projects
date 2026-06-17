import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { AuthContext } from "@/Contexts/auth.context";

export default function Settings() {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-navy mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and profile.</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-border shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account's profile information and email address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-md">
              <Label>Name</Label>
              <Input defaultValue={user?.name} disabled />
            </div>
            <div className="space-y-2 max-w-md">
              <Label>Email</Label>
              <Input defaultValue={user?.email} disabled />
            </div>
            <div className="pt-4">
               <Button className="bg-orange hover:bg-[#d5551c] text-white">Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Permanently delete your account and all associated data.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button variant="destructive" className="bg-red-500 hover:bg-red-600">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
