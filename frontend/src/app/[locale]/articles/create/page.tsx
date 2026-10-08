'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Breadcrumbs, Button, Card, CardContent, Input, TextArea } from '@heroui/react';
import { Check } from '@gravity-ui/icons';
import { createArticleAction } from '../actions';
import 'react-quill-new/dist/quill.snow.css';
import { useLocale, useTranslations } from 'next-intl';
import { getPathname } from '@/i18n/navigation';
import { CATEGORY_SLUGS } from '@/app/[locale]/category/category.types';
import { CategorySelector } from '@/app/[locale]/components/article-create/category-selector';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreateArticlePage() {
  const [content, setContent] = useState('');
  const locale = useLocale();
  const t = useTranslations('CreateArticlePage');

  const homeHref = getPathname({ locale, href: '/' });
  const articlesHref = getPathname({ locale, href: '/articles' });

  const modules = {
    toolbar: [
      [{ header: [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
        <Breadcrumbs aria-label={t('breadCrumbsAria')}>
          <Breadcrumbs.Item
            className="uppercase"
            href={homeHref}
          >
            <span className="text-xs">{t('breadCrumbsHome')}</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item
            className="uppercase"
            href={articlesHref}
          >
            <span className="text-xs">{t('breadCrumbsArticles')}</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="uppercase">
            <span className="text-xs">{t('breadCrumbsNew')}</span>
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <header className="flex flex-col gap-4">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl tracking-tight font-serif text-balance">
            {t('title')}
          </h1>
          <p className="text-lg xs:text-xl leading-7 font-serif text-muted text-balance">
            {t('subtitle')}
          </p>
        </header>

        <form
          action={createArticleAction.bind(null, locale)}
          className="flex flex-col gap-6"
        >
          <Card className="p-8 shadow-sm border border-border gap-4">
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground ml-1">
                  {t('labelTitle')}
                </label>
                <Input
                  required
                  name="title"
                  placeholder={t('placeholderTitle')}
                  variant="secondary"
                  className="font-serif text-xl"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground ml-1">
                  {t('labelIntro')}
                </label>
                <TextArea
                  required
                  name="intro"
                  placeholder={t('placeholderIntro')}
                  variant="secondary"
                  rows={2}
                  className="font-serif"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <CategorySelector slugs={CATEGORY_SLUGS} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <label className="text-sm font-medium text-foreground ml-1">
                    {t('labelStatus')}
                  </label>
                  <select
                    required
                    name="status"
                    defaultValue="DRAFT"
                    className="w-full h-10 px-3 rounded-md bg-surface-secondary border-none font-serif text-foreground outline-none focus:ring-2 focus:ring-accent appearance-none"
                  >
                    <option value="DRAFT">{t('statusDraft')}</option>
                    <option value="PUBLISHED">{t('statusPublished')}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <label className="text-sm font-medium text-foreground ml-1">
                    {t('labelPublishedAt')}
                  </label>
                  <input
                    type="datetime-local"
                    name="publishedAt"
                    className="w-full h-10 px-3 rounded-md bg-surface-secondary border-none font-serif text-foreground outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <label className="text-sm font-medium text-foreground ml-1">
                    {t('labelFeaturedImage')}
                  </label>
                  <Input
                    name="featuredImageUrl"
                    placeholder={t('placeholderFeaturedImage')}
                    variant="secondary"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <label className="text-sm font-medium text-foreground ml-1">
                    {t('labelFeaturedVideo')}
                  </label>
                  <Input
                    name="featuredVideoUrl"
                    placeholder={t('placeholderFeaturedVideo')}
                    variant="secondary"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground ml-1">
                  {t('labelContent')}
                </label>
                <input
                  type="hidden"
                  name="content"
                  value={content}
                />
                <div className="bg-surface-secondary text-foreground rounded-md overflow-hidden min-h-75 border-none">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    placeholder={t('placeholderContent')}
                    className="h-62.5 font-serif"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 mt-2">
            <Button
              variant="ghost"
              type="button"
            >
              {t('cancel')}
            </Button>
            <Button
              className="bg-black text-white"
              type="submit"
            >
              <Check width={18} /> {t('submit')}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
