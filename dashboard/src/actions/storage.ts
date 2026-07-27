import axios from 'src/lib/axios';

// ----------------------------------------------------------------------

export async function uploadImage(file: File, entityType: string = 'post') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entity_type', entityType);

  const res = await axios.post('/api/platform/storage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
}
