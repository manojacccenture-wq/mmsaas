export interface DemoRequestApiResponse {
  _id: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  companyName: string;
  phoneNumber?: string;
  useCase?: string;
  status: 'pending' | 'activated' | 'rejected';
  createdAt: string;
}

export interface DemoRequestUI {
  id: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  companyName: string;
  status: string;
  createdAt: string;
}
