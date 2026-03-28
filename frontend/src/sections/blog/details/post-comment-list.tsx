/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Post Comment List (Recursive Display)
 * Version: 1.4.7 - Fix: Data safety, Null-pointer prevention & UX logic
 */

import type { IPostComment } from 'src/types/blog';

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import { PostCommentItem } from './post-comment-item';

// ----------------------------------------------------------------------

type Props = {
  comments?: IPostComment[];
};

export function PostCommentList({ comments = [] }: Props) {
  return (
    <>
      {comments.map((comment) => {
        /**
         * ✅ SEGURANÇA DE DADOS:
         * Garantimos que 'replyComment' seja sempre uma array para evitar erros de .length
         * caso o campo venha nulo do banco de dados.
         */
        const replies = comment?.replyComment ?? [];
        const hasReply = !!replies.length;

        return (
          <Box key={comment.id}>
            <PostCommentItem
              name={comment.name}
              message={comment.message}
              postedAt={comment.postedAt}
              avatarUrl={comment.avatarUrl}
            />

            {hasReply &&
              replies.map((reply) => {
                /**
                 * ✅ BUSCA SEGURA DE USUÁRIO:
                 * O encadeamento opcional em 'users?.find' evita crashes se a lista 
                 * de usuários não estiver carregada ou sincronizada.
                 */
                const userReply = comment?.users?.find((user) => user.id === reply.userId);

                return (
                  <PostCommentItem
                    key={reply.id}
                    name={userReply?.name || 'Usuário'}
                    message={reply.message}
                    postedAt={reply.postedAt}
                    avatarUrl={userReply?.avatarUrl || ''}
                    tagUser={reply.tagUser}
                    hasReply
                  />
                );
              })}
          </Box>
        );
      })}

      {/* ✅ LÓGICA DE EXIBIÇÃO: Só exibe a paginação se houver conteúdo para paginar */}
      {comments.length > 0 && (
        <Pagination
          count={8}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            my: { xs: 5, md: 8 },
          }}
        />
      )}
    </>
  );
}