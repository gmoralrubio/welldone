import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welldone | Artículos',
  description:
    'WellDone es una red de blogging que pretende ser la competencia de Medium.',
};

export default async function ArticlesPage() {
  return <section>Listado de artículos</section>;
}
