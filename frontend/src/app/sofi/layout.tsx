import { BlogLayout } from 'src/layouts/sofi';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <BlogLayout>{children}</BlogLayout>;
}
