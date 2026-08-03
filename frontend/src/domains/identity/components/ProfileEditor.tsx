'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateProfile } from '../mutations/useUpdateProfile';

const UpdateProfileSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 letras'),
});

type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;

export function ProfileEditor() {
  const { mutate, isPending, error, isSuccess } = useUpdateProfile();
  
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileData>({
    resolver: zodResolver(UpdateProfileSchema),
  });

  const onSubmit = (data: UpdateProfileData) => {
    mutate(data);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>Editar Perfil (Client Mutation)</h3>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Erro: {error.message}</div>}
      {isSuccess && <div style={{ color: 'green', marginBottom: '1rem' }}>Perfil atualizado com sucesso (Mutação refletida no Header)!</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Nome Completo</label>
          <input 
            type="text" 
            {...register('fullName')} 
            style={{ width: '100%', padding: '0.5rem' }} 
            placeholder="Seu Nome Completo"
          />
          {errors.fullName && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.fullName.message}</span>}
        </div>

        <button type="submit" disabled={isPending} style={{ padding: '0.5rem 1rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer', width: 'fit-content' }}>
          {isPending ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
