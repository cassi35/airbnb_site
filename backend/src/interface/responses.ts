import { googleUserOmited } from "services /auth_service/googleAuth.service";
import { User } from "./auth"
import { GoogleUserData } from "./google";

type status = 'pending' | 'success' | 'error'

export interface StatusResponse {
  user?: User | GoogleUserData | null | googleUserOmited;
  token?: string;
  status?: status;
  success?: boolean;
  message?: string;
  verified: boolean;  // Apenas este campo é obrigatório
  statusLogin?:'signup'| 'login'
}
