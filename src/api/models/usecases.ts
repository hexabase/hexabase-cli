export interface UseCaseResponse {
  id: string;
  title: string;
  description: string;
  actors: string[];
}

export interface GenerateUseCasesResponse {
  result: UseCaseResponse[];
}


