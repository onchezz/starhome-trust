import { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePropertiesVisitRequest } from "@/hooks/contract_interactions/usePropertiesReads";

interface VisitRequestsCardProps {
  propertyTitle?: string;
  propertyId?: string;
//   title?: string;
}

export const VisitRequestsCard = ({
  propertyTitle,
  propertyId,
//   title = "Visit Requests",
}: VisitRequestsCardProps) => {
  // Get propertyId from URL params if not provided as prop
 

  

  const { propertiesVisit, isLoading, error } =
    usePropertiesVisitRequest(propertyId);
  const [activeTab, setActiveTab] = useState("all");

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Filter requests based on tab
  const filteredRequests = () => {
    if (activeTab === "all") return propertiesVisit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === "today") {
      return propertiesVisit.filter((request) => {
        const visitDate = new Date(request.visit_date);
        visitDate.setHours(0, 0, 0, 0);
        return visitDate.getTime() === today.getTime();
      });
    }

    if (activeTab === "upcoming") {
      return propertiesVisit.filter((request) => {
        const visitDate = new Date(request.visit_date);
        visitDate.setHours(0, 0, 0, 0);
        return visitDate.getTime() > today.getTime();
      });
    }

    if (activeTab === "past") {
      return propertiesVisit.filter((request) => {
        const visitDate = new Date(request.visit_date);
        visitDate.setHours(0, 0, 0, 0);
        return visitDate.getTime() < today.getTime();
      });
    }

    return propertiesVisit;
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{propertyTitle}</CardTitle>
          <CardDescription>Error loading visit requests</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            Failed to load visit requests. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full px-10 py-12">
      <CardHeader>
        <CardTitle>{propertyTitle}</CardTitle>
        <CardDescription>
          {isLoading
            ? "Loading requests..."
            : `${propertiesVisit.length} visit requests for  this Property`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-4"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredRequests().length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No visit requests found for this selection.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests().map((request) => (
              <Card
                key={request.user_id + request.timestamp.toString()}
                className="p-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(request.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{request.name}</h3>
                        <Badge
                          variant={
                            new Date(request.visit_date) < new Date()
                              ? "destructive"
                              : new Date(request.visit_date).toDateString() ===
                                new Date().toDateString()
                              ? "default"
                              : "secondary"
                          }
                        >
                          {new Date(request.visit_date) < new Date()
                            ? "Past"
                            : new Date(request.visit_date).toDateString() ===
                              new Date().toDateString()
                            ? "Today"
                            : "Upcoming"}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Visit requested for{" "}
                        {formatDate(new Date(request.visit_date))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{request.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{request.phone}</span>
                    </div>
                  </div>

                  {request.message && (
                    <div className="bg-muted p-3 rounded-md text-sm">
                      {request.message}
                    </div>
                  )}

                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
