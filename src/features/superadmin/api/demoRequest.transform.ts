import { type DemoRequestApiResponse, type DemoRequestUI } from "./demoRequest.types";

export const mapDemoRequestToUI = (req: DemoRequestApiResponse): DemoRequestUI => ({
  id: req._id,
  firstName: req.firstName,
  lastName: req.lastName,
  workEmail: req.workEmail,
  companyName: req.companyName,
  status: req.status,
  createdAt: req.createdAt,
});
