"use client";

// 1. Importa tudo de fields para compor o objeto Field
// import * as FieldComponents from './fields';
export * from './fields';

// 2. Exportações Nomeadas (Corrigindo o erro de 'no exported member default')
export * from './rhf-code';
export * from './help-text';
export * from './rhf-upload';
export * from './rhf-editor';
export * from './rhf-rating';
export * from './rhf-slider';
export * from './rhf-switch';
export * from './rhf-select';
export * from './rhf-checkbox';
export * from './schema-utils';
export * from './form-provider';
export * from './rhf-text-field';
export * from './rhf-date-picker';
export * from './rhf-radio-group';
export * from './rhf-phone-input';
export * from './rhf-number-input';
export * from './rhf-autocomplete';
export * from './rhf-country-select';

// 3. O OBJETO "Field" que suas páginas de Auth e Account precisam
// export const Field = {
//   ...FieldComponents,
// };

// 4. Se o seu código usa <Form ... />, ele vem do form-provider
// Se houver erro no Form, mude para: export { FormProvider as Form } from './form-provider';
