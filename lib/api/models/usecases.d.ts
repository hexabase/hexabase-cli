export interface UseCaseResponse {
    usecase_id: string;
    usecase_name: string;
    description: string;
    actors: string[];
}

export interface GenerateUseCasesResponse {
    usecases: UseCaseResponse[];
}


