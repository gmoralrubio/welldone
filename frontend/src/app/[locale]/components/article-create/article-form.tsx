'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, Input, TextArea } from '@heroui/react';
import 'react-quill-new/dist/quill.snow.css';
import { useTranslations } from 'next-intl';
import { CATEGORY_SLUGS } from '@/lib/category/category.types';
import { CategorySelector } from '@/app/[locale]/components/article-create/category-selector';
import { ArticleDto } from '@/lib/article/articles.types';
import { createArticleFrontendSchema } from '@/lib/article/article-schema';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export type FormErrors = {
  title?: string[];
  intro?: string[];
  content?: string[];
  status?: string[];
  categories?: string[];
  featuredImageUrl?: string[];
  featuredVideoUrl?: string[];
  [key: string]: string[] | undefined;
};

type ActionState = {
  errors?: FormErrors;
  message?: string | null;
  error?: string;
} | void;

type ArticleFormProps = {
  action: string | ((formData: FormData) => Promise<ActionState> | void);
  initialData?: Partial<ArticleDto>;
};

export function ArticleForm({ action, initialData }: ArticleFormProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  const [isDirty, setIsDirty] = useState(false);

  const t = useTranslations('CreateArticlePage');
  type TranslationKey = Parameters<typeof t>[0];

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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ''; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    const formData = new FormData(e.currentTarget);
    setFieldErrors({});
    setGeneralError(null);
    
    const rawImg = formData.get('featuredImageUrl');
    const rawVid = formData.get('featuredVideoUrl');
    const rawPub = formData.get('publishedAt');

    const formValues = {
      title: formData.get('title') as string,
      intro: formData.get('intro') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as string,
      categorySlugs: formData.getAll('categorySlugs') as string[],
      featuredImageUrl: rawImg ? String(rawImg) : null,
      featuredVideoUrl: rawVid ? String(rawVid) : null,
      publishedAt: rawPub ? String(rawPub) : null,
    };

    const result = createArticleFrontendSchema.safeParse(formValues);

    if (!result.success) {
      // Si falla, extraemos las claves de traducción de Zod y abortamos el envío
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = [issue.message];
      });
      setFieldErrors(newErrors);
      return; 
    }
    
    if (typeof action === 'function') {
      const response = await action(formData);
      
      if (response?.errors) {
        setFieldErrors(response.errors);
      } else if (response?.error === 'TITLE_ALREADY_EXISTS') {
        setFieldErrors((prev) => ({ ...prev, title: [t('TITLE_ALREADY_EXISTS')] }));
      } else if (response?.error) {
        setGeneralError(response.error);
      } else {
        // Todo fue un éxito: quitamos el estado sucio para que pueda navegar tranquilamente
        setIsDirty(false);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const fieldSchema = createArticleFrontendSchema.shape[name as keyof typeof createArticleFrontendSchema.shape];

    if (fieldSchema) {
      const result = fieldSchema.safeParse(value.trim());

      if (!result.success) {
        const errorMessages = result.error.issues.map((issue) => issue.message);
        setFieldErrors(prev => ({ ...prev, [name]: errorMessages }));
      } else {
        setFieldErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  return (
    <form 
      id="article-editor-form" 
      onSubmit={handleSubmit}
      onChange={() => setIsDirty(true)} 
      className="flex flex-col gap-6"
    >
      <Card className="p-8 shadow-sm border border-border gap-4">
        <CardContent className="flex flex-col gap-6">
          
          {generalError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-4">
              {generalError}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground ml-1">
              {t('labelTitle')}
            </label>
            <Input
              name="title"
              defaultValue={initialData?.title}
              onBlur={handleBlur}
              placeholder={t('placeholderTitle')}
              variant="secondary"
              className="font-serif text-xl"
            />
            {fieldErrors?.title && (
              <span className="text-sm text-red-500 ml-1 mt-1">
                {t(fieldErrors.title[0] as TranslationKey)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground ml-1">
              {t('labelIntro')}
            </label>
            <TextArea
              name="intro"
              defaultValue={initialData?.intro}
              onBlur={handleBlur}
              placeholder={t('placeholderIntro')}
              variant="secondary"
              rows={2}
              className="font-serif"
            />
            {fieldErrors?.intro && (
              <span className="text-sm text-red-500 ml-1 mt-1">
                {t(fieldErrors.intro[0] as TranslationKey)}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <CategorySelector 
                slugs={CATEGORY_SLUGS}
                initialValues={initialData?.categories?.map(category => category.slug) || []}
            />
          </div>
          {fieldErrors?.categories && (
            <span className="text-sm text-red-500 ml-1 mt-1">
              {t(fieldErrors.categories[0] as TranslationKey)}
            </span>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1 w-full sm:w-1/2">
              <label className="text-sm font-medium text-foreground ml-1">
                {t('labelStatus')}
              </label>
              <select
                name="status"
                defaultValue={initialData?.status || "DRAFT"}
                className="w-full h-10 px-3 rounded-md bg-surface-secondary border-none font-serif text-foreground outline-none focus:ring-2 focus:ring-accent appearance-none"
              >
                <option value="DRAFT">{t('statusDraft')}</option>
                <option value="PUBLISHED">{t('statusPublished')}</option>
              </select>
              {fieldErrors?.status && (
                <span className="text-sm text-red-500 ml-1 mt-1">
                  {t(fieldErrors.status[0] as TranslationKey)}
                </span>
              )}
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
                onBlur={handleBlur}
                placeholder={t('placeholderFeaturedImage')}
                variant="secondary"
                className="w-full"
              />
              {fieldErrors?.featuredImageUrl && (
                <span className="text-sm text-red-500 ml-1 mt-1">
                  {t(fieldErrors.featuredImageUrl[0] as TranslationKey)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-1/2">
              <label className="text-sm font-medium text-foreground ml-1">
                {t('labelFeaturedVideo')}
              </label>
              <Input
                name="featuredVideoUrl"
                defaultValue={initialData?.featuredVideoUrl || ''}
                onBlur={handleBlur}
                placeholder={t('placeholderFeaturedVideo')}
                variant="secondary"
                className="w-full"
              />
              {fieldErrors?.featuredVideoUrl && (
                <span className="text-sm text-red-500 ml-1 mt-1">
                  {t(fieldErrors.featuredVideoUrl[0] as TranslationKey)}
                </span>
              )}
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
                onChange={(val) => {
                  setContent(val);
                  setIsDirty(true); 
                }}
                modules={modules}
                placeholder={t('placeholderContent')}
                className="h-62.5 font-serif"
              />
            </div>
            {fieldErrors?.content && (
              <span className="text-sm text-red-500 ml-1 mt-1">
                {t(fieldErrors.content[0] as TranslationKey)}
              </span>
            )}
          </div>

        </CardContent>
      </Card>
      
    </form>
  );
}