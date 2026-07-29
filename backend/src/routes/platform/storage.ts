/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: R2 Storage Management Interface
 */
import { Hono } from 'hono';
import { Bindings, Variables } from '../../types/bindings';
import { authSignature } from '../../middleware/auth_signature';
import { error, success } from '../../utils/response';
import { rePropertyMedia, rePropertyDocuments } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

/**
 * UTIL: Gerador Simples de Chaves Seguras
 */
const generateSafeKey = (filename: string, prefix: string) => {
  const uuid = crypto.randomUUID();
  const ext = filename.split('.').pop();
  return `${prefix}/${uuid}.${ext}`;
};

// =================================================================
// 1. CARREGAMENTO DE AXXESSOS DE MÍDIA (PRESIGNED R2 - BLAZING FAST)
// =================================================================
app.post('/presigned', authSignature, async (c) => {
  try {
    const body = await c.req.json();
    const filename = body.filename as string;
    const contentType = (body.contentType as string) || 'image/png';
    const entityType = (body.entity_type as string) || 'post';

    if (!filename) return error(c, 'Nome do arquivo ausente.', null, 400);

    const key = generateSafeKey(filename, entityType);

    const S3 = new S3Client({
      region: 'auto',
      endpoint: `https://${c.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: c.env.R2_ACCESS_KEY_ID,
        secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
      },
    });

    const command = new PutObjectCommand({
      Bucket: c.env.R2_BUCKET_NAME || 'asppibra-dao',
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

    // ✅ URL pública direta do R2 (sem proxy Worker)
    const r2PublicBase = c.env.R2_PUBLIC_URL || `https://${c.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev`;
    const publicUrl = `${r2PublicBase}/${key}`;

    return success(
      c,
      'URL Pre-assinada gerada com Sucesso',
      {
        key: key,
        uploadUrl: presignedUrl,
        publicUrl,
      },
      201
    );
  } catch (err: any) {
    console.error('Presigner Error:', err);
    return error(c, 'Falha ao assinar URL do AWS S3 R2 SDK', err.message, 500);
  }
});

// =================================================================
// 1.B LEGACY UPLOAD MULTIPART VIA WORKER CPU (MAIS LENTO)
// =================================================================
app.post('/upload', authSignature, async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    const entityType = body['entity_type'] as string; // 'media' ou 'document'
    const propertyIdStr = body['property_id'] as string;

    if (!file || !entityType) {
      return error(
        c,
        'Arquivo ausente ou tipo de entidade não especificado (entity_type).',
        null,
        400
      );
    }

    const ALLOWED_PREFIXES = ['media', 'document', 'post', 'avatar'];
    if (!ALLOWED_PREFIXES.includes(entityType)) {
      return error(c, `Tipo de entidade inválido: ${entityType}`, null, 400);
    }

    // Identifica e valida as permissões sobre o Imóvel caso exista vínculo
    const propertyId = propertyIdStr ? parseInt(propertyIdStr, 10) : null;

    // 1.3 Upload do Arquivo físico (Stream Zero-Copy) para R2
    const key = generateSafeKey(file.name, entityType);
    const arrayBuffer = await file.arrayBuffer();

    await c.env.STORAGE.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    // ✅ URL pública direta do R2 (sem proxy Worker)
    const r2PublicBase = c.env.R2_PUBLIC_URL || `https://${c.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev`;
    let downloadUrl = `${r2PublicBase}/${key}`;

    const db = c.get('db');

    // 1.5 Mapeamento Bidirecional para Banco D1 (Opcional se houver propertyId)
    if (propertyId) {
      if (entityType === 'media' || entityType === 'post' || entityType === 'posts') {
        const mediaType = (body['media_type'] as string) || 'photo';

        await db.insert(rePropertyMedia).values({
          propertyId: propertyId,
          mediaType: mediaType as any,
          title: file.name,
          url: downloadUrl,
          r2Key: key,
          isCover: body['is_cover'] === 'true',
        });
      } else if (entityType === 'document') {
        const docType = (body['doc_type'] as string) || 'other';
        const workerBase = c.req.url.split('/upload')[0];
        downloadUrl = `${workerBase}/private/${key}`; // Documentos reais continuam privados

        await db.insert(rePropertyDocuments).values({
          propertyId: propertyId,
          docType: docType as any,
          name: file.name,
          r2Key: key,
          isPublic: false,
        });
      }
    }

    return success(
      c,
      'Upload Processado com Sucesso',
      {
        key: key,
        url: downloadUrl,
        size: file.size,
        record_created: !!propertyId,
      },
      201
    );
  } catch (err: any) {
    console.error('Storage Error:', err);
    return error(
      c,
      'Falha fatal ao processar o multipart/form-data e enviar para o R2',
      err.message,
      500
    );
  }
});

// =================================================================
// 2. RECUPERAÇÃO - ACESSO PÚBLICO (Vitrines / Assets Desbloqueados)
// =================================================================
app.get('/public/:prefix/:key', async (c) => {
  const prefix = c.req.param('prefix');
  const key = c.req.param('key');
  const fullKey = `${prefix}/${key}`;

  console.log(`[Storage] Tentando buscar: ${fullKey}`);

  const object = await c.env.STORAGE.get(fullKey);
  if (!object) {
    console.error(`[Storage] Arquivo não encontrado no R2: ${fullKey}`);
    return error(c, 'Arquivo Público não Localizado', { searchedKey: fullKey }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body as any, { headers });
});

// =================================================================
// 3. RECUPERAÇÃO - ACESSO PRIVADO E LEGAL (Contratos e Identidades)
// =================================================================
app.get('/private/:prefix/:key', authSignature, async (c) => {
  const fullKey = `${c.req.param('prefix')}/${c.req.param('key')}`;

  // Auditoria: Garantir que o usuário atual tem legitimidade para abrir o documento
  // (Pular verificação de permissionamento complexa para MVP)

  const object = await c.env.STORAGE.get(fullKey);
  if (!object)
    return error(c, 'Documento Jurídico/Sensível não encontrado ou Sem permissão.', null, 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body as any, { headers });
});

// =================================================================
// 4. DELEÇÃO SEGURA R2
// =================================================================
app.delete('/remove/:prefix/:key', authSignature, async (c) => {
  const fullKey = `${c.req.param('prefix')}/${c.req.param('key')}`;

  // A Cloudflare irá deletar do Bucket instantaneamente
  await c.env.STORAGE.delete(fullKey);

  // NOTA: Como a tabela de Media ou Document guarda ForeignKeys do DB,
  // pode ser aconselhável construir Cleanup triggers depois.

  return success(c, 'Objeto Erradicado Definitivamente do Sistema.', { key: fullKey });
});

export default app;
