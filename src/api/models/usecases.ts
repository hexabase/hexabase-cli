export interface ActorResponse {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface UserInterfaceResponse {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface SystemInterfaceResponse {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface UseCaseResponse {
  id: string;
  title: string;
  description: string;
  actors: string[];
  user_interfaces: string[];
  system_interfaces: string[];
}

export interface GenerateUseCasesResult {
  name: string;
  goal: string;
  description: string;
  actors: ActorResponse[];
  user_interfaces: UserInterfaceResponse[];
  system_interfaces: SystemInterfaceResponse[];
  usecases: UseCaseResponse[];
}

export interface GenerateUseCasesResponse {
  result: GenerateUseCasesResult;
  total_tokens: number;
}


