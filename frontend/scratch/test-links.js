
const { kebabCase } = require('es-toolkit');

const mockPosts = [
  { title: 'Créditos de Carbono: O Novo Ouro Verde', category: 'Meio Ambiente', slug: 'creditos-carbono-ouro-verde' },
  { title: 'Energia Limpa e Mineração Sustentável', category: 'Meio Ambiente', slug: '' },
];

const category = 'Meio Ambiente';

const viewPosts = mockPosts.filter(
  (post) => post.category.toLowerCase() === category.toLowerCase()
);

console.log('--- TESTE DE LINKS MEIO AMBIENTE ---');
viewPosts.forEach((post, index) => {
  const slug = post.slug || kebabCase(post.title);
  const detailsHref = `/news/${slug}`;
  console.log(`Post ${index + 1}: ${post.title}`);
  console.log(`Generated Link: ${detailsHref}`);
});
