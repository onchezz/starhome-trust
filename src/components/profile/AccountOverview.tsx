import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Trash2 } from "lucide-react";
import { User } from "@/types/user";

interface AccountOverviewProps {
  user: User | null;
}

export function AccountOverview({ user }: AccountOverviewProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Account Overview</CardTitle>
        <Button variant="outline" size="sm" className="text-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add New Email
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <div className="grid grid-cols-5 p-4 text-sm font-medium text-muted-foreground">
            <div>Email</div>
            <div>Password</div>
            <div>Status</div>
            <div>Primary</div>
            <div>Action</div>
          </div>
          <div className="grid grid-cols-5 p-4 text-sm items-center border-t">
            <div className="text-muted-foreground">{user?.email}</div>
            <div>••••••••••••</div>
            <div>
              <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-50">
                Unverified
              </Badge>
            </div>
            <div>
              <input type="radio" checked className="w-4 h-4 text-primary" />
            </div>
            <div>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}