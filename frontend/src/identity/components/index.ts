'use client';

// 1. Componentes Internos de Identidade
export * from './form-head';
export * from './form-return-link';
export * from './form-resend-code';
export * from './sign-up-terms';

// 2. Novas Ferramentas SSI (Elite Phase)
export * from './EntropyCollector';
export * from './MnemonicView';

// 3. Re-exportações Estratégicas (Identity Hub)
// Mantém a compatibilidade com as Views legadas enquanto usamos a nova infra
export { toast } from 'sonner';
export { Iconify } from 'src/components/iconify';
export { Form } from 'src/components/hook-form';
export * as Field from 'src/components/hook-form/fields';
export { schemaUtils } from 'src/components/hook-form/schema-utils';

export { varBounce } from 'src/components/animate/variants';
export { MotionContainer } from 'src/components/animate/motion-container';
export { AnimateLogoRotate } from 'src/components/animate/animate-logo';
export { SplashScreen } from 'src/components/loading-screen';
