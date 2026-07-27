import type { IPostItem } from 'src/types/blog';

import * as z from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { _tags } from 'src/_mock';
import { uploadImage } from 'src/actions/storage';
import { createPost, updatePost } from 'src/actions/blog';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { PostDetailsPreview } from './post-details-preview';

// ----------------------------------------------------------------------

export type PostCreateSchemaType = z.infer<typeof PostCreateSchema>;

export const PostCreateSchema = z.object({
  title: z.string().min(1, { message: 'Title is required!' }),
  slug: z.string().min(1, { message: 'Slug is required!' }),
  description: z.string().min(1, { message: 'Description is required!' }).max(160),
  content: z.string().min(10, { message: 'Content must be at least 10 characters' }),
  coverUrl: schemaUtils.file({ message: 'Cover is required!' }),
  coverAlt: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required!' }),
  tags: z.string().array().min(2, { message: 'Must have at least 2 items!' }),
  metaKeywords: z.string().array().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  publish: z.boolean().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  currentPost?: IPostItem;
};

export function PostCreateEditForm({ currentPost }: Props) {
  const router = useRouter();

  const showPreview = useBoolean();
  const openDetails = useBoolean(true);
  const openProperties = useBoolean(true);

  const defaultValues: PostCreateSchemaType = {
    title: '',
    slug: '',
    description: '',
    content: '',
    coverUrl: null,
    coverAlt: '',
    category: 'Tecnologia',
    tags: [],
    metaKeywords: [],
    metaTitle: '',
    metaDescription: '',
    publish: true,
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(PostCreateSchema),
    defaultValues,
    values: currentPost
      ? {
          ...currentPost,
          publish: currentPost.publish === 'published',
          category: currentPost.category || 'Tecnologia',
          slug: currentPost.slug || '',
        }
      : defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const handleAutoSlug = useCallback(() => {
    const title = watch('title');
    if (title && !currentPost) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [currentPost, setValue, watch]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let coverUrl = data.coverUrl;

      // 1. Handle image upload if it's a new file
      if (typeof data.coverUrl !== 'string' && data.coverUrl) {
        const uploadRes = await uploadImage(data.coverUrl as unknown as File);
        coverUrl = uploadRes.data.url;
      }

      // 2. Prepare payload for backend
      const payload = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        coverUrl,
        coverAlt: data.coverAlt,
        category: data.category,
        tags: data.tags,
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || data.description,
        metaKeywords: data.metaKeywords,
        status: data.publish ? 'published' : 'draft',
      };

      // 3. API Call
      if (currentPost) {
        await updatePost(currentPost.id, payload);
      } else {
        await createPost(payload);
      }

      reset();
      showPreview.onFalse();
      toast.success(currentPost ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.post.root);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong!');
      console.error(error);
    }
  });

  const handleRemoveFile = useCallback(() => {
    setValue('coverUrl', null);
  }, [setValue]);

  const renderCollapseButton = (value: boolean, onToggle: () => void) => (
    <IconButton onClick={onToggle}>
      <Iconify icon={value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
    </IconButton>
  );

  const renderDetails = () => (
    <Card>
      <CardHeader
        title="Details"
        subheader="Title, short description, image..."
        action={renderCollapseButton(openDetails.value, openDetails.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openDetails.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Field.Text name="title" label="Post title" onBlur={handleAutoSlug} />
            <Field.Text name="slug" label="Slug (URL)" />
          </Stack>

          <Field.Text name="description" label="Description" multiline rows={3} />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Content</Typography>
            <Field.Editor name="content" sx={{ maxHeight: 480 }} />
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Field.Select name="category" label="Category">
              <MenuItem value="Tecnologia">Tecnologia</MenuItem>
              <MenuItem value="Economia">Economia</MenuItem>
              <MenuItem value="Geopolítica">Geopolítica</MenuItem>
              <MenuItem value="Meio Ambiente">Meio Ambiente</MenuItem>
            </Field.Select>

            <Field.Text name="coverAlt" label="Image Alt Text (SEO)" />
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Cover</Typography>
            <Field.Upload name="coverUrl" maxSize={3145728} onDelete={handleRemoveFile} />
          </Stack>
        </Stack>
      </Collapse>
    </Card>
  );

  const renderProperties = () => (
    <Card>
      <CardHeader
        title="Properties"
        subheader="Additional functions and attributes..."
        action={renderCollapseButton(openProperties.value, openProperties.onToggle)}
        sx={{ mb: 3 }}
      />

      <Collapse in={openProperties.value}>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Autocomplete
            name="tags"
            label="Tags"
            placeholder="+ Tags"
            multiple
            freeSolo
            disableCloseOnSelect
            options={_tags.map((option) => option)}
            getOptionLabel={(option) => option}
            slotProps={{
              chip: { color: 'info' },
            }}
          />

          <Field.Text name="metaTitle" label="Meta title" />

          <Field.Text
            name="metaDescription"
            label="Meta description"
            fullWidth
            multiline
            rows={3}
          />

          <Field.Autocomplete
            name="metaKeywords"
            label="Meta keywords"
            placeholder="+ Keywords"
            multiple
            freeSolo
            disableCloseOnSelect
            options={_tags.map((option) => option)}
            getOptionLabel={(option) => option}
            slotProps={{
              chip: { color: 'info' },
            }}
          />

          <FormControlLabel
            label="Enable comments"
            control={<Switch defaultChecked slotProps={{ input: { id: 'comments-switch' } }} />}
          />
        </Stack>
      </Collapse>
    </Card>
  );

  const renderActions = () => (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Field.Switch name="publish" label="Publish" sx={{ pl: 3, flexGrow: 1 }} />

      <div>
        <Button color="inherit" variant="outlined" size="large" onClick={showPreview.onTrue}>
          Preview
        </Button>

        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentPost ? 'Create post' : 'Save changes'}
        </Button>
      </div>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails()}
        {renderProperties()}
        {renderActions()}
      </Stack>

      <PostDetailsPreview
        isValid={isValid}
        onSubmit={onSubmit}
        title={values.title}
        open={showPreview.value}
        content={values.content}
        onClose={showPreview.onFalse}
        coverUrl={values.coverUrl}
        isSubmitting={isSubmitting}
        description={values.description}
      />
    </Form>
  );
}
