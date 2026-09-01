export interface DemoRequestApiResponse {
  _id: string;
  fullName: string;
  workEmail: string;
  companyName: string;
  phoneNumber?: string;
  useCase?: string;
  status: 'pending' | 'activated' | 'rejected';
  createdAt: string;
}

export interface DemoRequestUI {
  id: string;
  fullName: string;
  workEmail: string;
  companyName: string;
  phoneNumber?: string;
  useCase?: string;
  status: string;
  createdAt: string;
}
