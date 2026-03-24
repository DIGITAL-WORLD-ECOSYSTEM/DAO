import { z as zod } from 'zod';

// Helper para validação de arquivos (comum no kit Minimal para o componente Upload)
const fileSchema = zod.custom<File | string>((val) => val instanceof File || typeof val === 'string', {
  message: 'A imagem de capa é obrigatória',
});

const dateValueSchema = zod.union([zod.string(), zod.number(), zod.date()]);

// ----------------------------------------------------------------------

// 1. Schema para Comentários
const postCommentSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  message: zod.string(),
  avatarUrl: zod.string(),
  postedAt: dateValueSchema,
  users: zod.array(
    zod.object({
      id: zod.string(),
      name: zod.string(),
      avatarUrl: zod.string(),
    })
  ),
  replyComment: zod.array(
    zod.object({
      id: zod.string(),
      userId: zod.string(),
      message: zod.string(),
      tagUser: zod.string().optional(),
      postedAt: dateValueSchema,
    })
  ),
});

// 2. Schema para o Item do Post (Consumo de Dados/API)
export const postItemSchema = zod.object({
  id: zod.string(),
  title: zod.string(),
  tags: zod.array(zod.string()),
  publish: zod.string(),
  content: zod.string(),
  coverUrl: zod.string(),
  category: zod.string(), // 👈 Essencial para o monitoramento editorial
  metaTitle: zod.string(),
  totalViews: zod.number(),
  totalShares: zod.number(),
  description: zod.string(),
  totalComments: zod.number(),
  createdAt: dateValueSchema,
  totalFavorites: zod.number(),
  metaKeywords: zod.array(zod.string()),
  metaDescription: zod.string(),
  comments: zod.array(postCommentSchema),
  author: zod.object({
    name: zod.string(),
    avatarUrl: zod.string(),
  }),
  favoritePerson: zod.array(
    zod.object({
      name: zod.string(),
      avatarUrl: zod.string(),
    })
  ),
});

export const postsSchema = zod.array(postItemSchema);

// ----------------------------------------------------------------------

// 3. NOVO: Schema para Criação/Edição (Management)
// Este é o que será usado no seu PostCreateEditForm
export const NewPostSchema = zod.object({
  title: zod.string().min(1, 'O título é obrigatório'),
  description: zod.string().min(1, 'A descrição é obrigatória'),
  content: zod.string().min(1, 'O conteúdo é obrigatório'),
  coverUrl: fileSchema.nullable().refine((val) => val !== null, 'A capa é obrigatória'),
  category: zod.string().min(1, 'A categoria é obrigatória'),
  tags: zod.string().array().min(2, 'Escolha pelo menos 2 tags'),
  metaTitle: zod.string().min(1, 'Meta título é obrigatório'),
  metaDescription: zod.string().min(1, 'Meta descrição é obrigatória'),
  metaKeywords: zod.string().array().min(1, 'Insira pelo menos uma palavra-chave'),
  publish: zod.boolean(), // No formulário usamos Switch (boolean), no banco vira string
});