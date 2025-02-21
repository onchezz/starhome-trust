import { useParams, useLocation } from "react-router-dom";
import { VisitRequestsCard } from "../components/profile/UserPropertiesVisitRequests";

const VisitRequestsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const propertyTitle = location.state?.propertyTitle || "";

  return (
    <div className="container mx-auto py-8 pt-16">
      <h1 className="text-2xl font-bold mb-6">Property Visit Requests</h1>
      <VisitRequestsCard propertyTitle={propertyTitle} propertyId={id} />
    </div>
  );
};

export default VisitRequestsPage;
