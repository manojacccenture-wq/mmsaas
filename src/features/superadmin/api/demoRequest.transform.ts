import { type DemoRequestApiResponse, type DemoRequestUI } from "./demoRequest.types";

export const mapDemoRequestToUI = (req: DemoRequestApiResponse): DemoRequestUI => ({
  id: req._id,
  fullName: req.fullName,
  workEmail: req.workEmail,
  companyName: req.companyName,
  phoneNumber: req.phoneNumber,
  useCase: req.useCase,
  status: req.status,
  createdAt: req.createdAt,
});
