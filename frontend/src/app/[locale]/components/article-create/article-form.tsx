'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, Input, TextArea } from '@heroui/react';
import 'react-quill-new/dist/quill.snow.css';
import { useTranslations } from 'next-intl';
import { CATEGORY_SLUGS } from '@/lib/category/category.types';
import { CategorySelector } from '@/app/[locale]/components/article-create/category-selector';
import { ArticleDto } from '@/lib/article/articles.types';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type ActionState = {
  errors?: {
    title?: string[];
    [key: string]: string[] | undefined;
  };
  message?: string | null;
  error?: string;
} | void;

type ArticleFormProps = {
  action: string | ((formData: FormData) => Promise<ActionState> | void);
  initialData?: Partial<ArticleDto>;
};

export function ArticleForm({ action, initialData }: ArticleFormProps) {
  const [content, setContent] = useState(initialData?.content || '');

  const [titleError, setTitleError] = useState<string | null>(null);

  const t = useTranslations('CreateArticlePage');

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

  const handleClientAction = async (formData: FormData) => {
    setTitleError(null);
    
    if (typeof action === 'function') {
      const response = await action(formData);
      
      if (response?.errors?.title && response.errors.title.length > 0) {
        setTitleError(response.errors.title[0]);
      }
      
      if (response && response.error === 'TITLE_ALREADY_EXISTS') {
        setTitleError(t('TITLE_ALREADY_EXISTS'));
      }
    }
  };

  return (
    <form 
      id="article-editor-form" 
      action={handleClientAction} 
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
              defaultValue={initialData?.title}
              placeholder={t('placeholderTitle')}
              variant="secondary"
              className="font-serif text-xl"
            />
            {titleError && (
              <span className="text-sm text-red-500 ml-1 mt-1">
                {titleError}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground ml-1">
              {t('labelIntro')}
            </label>
            <TextArea
              required
              name="intro"
              defaultValue={initialData?.intro}
              placeholder={t('placeholderIntro')}
              variant="secondary"
              rows={2}
              className="font-serif"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <CategorySelector 
                slugs={CATEGORY_SLUGS}
                initialValues={initialData?.categories?.map(category => category.slug) || []}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1 w-full sm:w-1/2">
              <label className="text-sm font-medium text-foreground ml-1">
                {t('labelStatus')}
              </label>
              <select
                required
                name="status"
                defaultValue={initialData?.status || "DRAFT"}
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
                defaultValue={initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().slice(0, 16) : ''}
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
                defaultValue={initialData?.featuredImageUrl || ''}
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
                defaultValue={initialData?.featuredVideoUrl || ''}
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
            <input type="hidden" name="content" value={content} />
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
    </form>
  );
}