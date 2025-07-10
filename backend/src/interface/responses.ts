import { User } from "./auth"

type status = 'pending' | 'success' | 'error'

export interface StatusResponse {
  user?: User;
  token?: string;
  status?: status;
  success?: boolean;
  message?: string;
  verified: boolean;  // Apenas este campo é obrigatório
}