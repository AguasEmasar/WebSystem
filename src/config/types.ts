export interface CommunicateDto {
    id: string;
    date: string; // Ajusta el tipo según sea necesario
    title: string;
    description: string;
}

export interface RegistrationWaterDto {
    id: string;
    date: string; // Ajusta el tipo según sea necesario
    observation: string;
}

export interface RegistrationWaterCreateDto {
    date: string; // Ajusta el tipo según sea necesario
    observation: string;
    neighborhoodColoniesId: string[]; // Cambia a array de strings si es una lista de IDs
}

export interface CreateCommunicateDto {
    date: string; // Ajusta el tipo según sea necesario
    title: string;
    description: string;
}
