export interface KycSubmitRequest {
  userId: number;
  documentType: 'RG' | 'CPF' | 'CNH' | 'PASSAPORTE' | 'OUTROS';
}
