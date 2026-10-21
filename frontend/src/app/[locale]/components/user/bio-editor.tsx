'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@heroui/react';
import { Pencil, Check, Xmark } from '@gravity-ui/icons';
import { useTranslations } from 'next-intl';
import { updateAccount } from '@/app/[locale]/(site)/dashboard/(menues)/[...username]/actions';
import { parseBio } from '@/lib/user/parse-bio';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface BioEditorProps {
  initialBio?: string | null;
}

export function BioEditor({ initialBio }: BioEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialBio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations('ProfileAbout');

  // Barra de herramientas simplificada
  const modules = {
    toolbar: [
      ['bold', 'italic'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const isEmpty = content.replace(/<[^>]*>?/gm, '').trim().length === 0;
    const finalContent = isEmpty ? null : content;

    try {
      const response = await updateAccount({ bio: finalContent });

      if (response.status === 200) {
        setIsEditing(false);
      } else {
        setError(t('saveError'));
      }
    } catch {
      setError(t('saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(initialBio || '');
    setIsEditing(false);
    setError(null);
  };

  // ESTADO 1: Editando
  if (isEditing) {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 w-full">
        <div className="bg-surface rounded-lg overflow-hidden border border-separator">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder={t('placeholder')}
            className="min-h-37.5 font-serif"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            onPress={handleCancel}
            isDisabled={isSaving}
          >
            <Xmark width={16} /> {t('cancel')}
          </Button>

          <Button
            variant="primary"
            onPress={handleSave}
            isDisabled={isSaving}
          >
            <Check width={16} /> {isSaving ? '...' : t('save')}
          </Button>
        </div>
      </div>
    );
  }

  const bio = initialBio ? parseBio(initialBio) : null;

  // ESTADO 2: Tiene contenido (modo lectura)
  if (bio) {
    return (
      <div className="group relative rounded-lg p-6 bg-surface-secondary border border-transparent hover:border-separator transition-all w-full">
        <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none font-serif text-muted leading-relaxed">
          {bio}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          onPress={() => setIsEditing(true)}
        >
          <Pencil width={14} /> {t('edit')}
        </Button>
      </div>
    );
  }

  // ESTADO 3: Vacío
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface-secondary rounded-lg w-full border-2 border-dashed border-transparent hover:border-separator transition-colors">
      <h3 className="text-xl font-bold font-serif mb-4 text-foreground">
        {t('emptyTitle')}
      </h3>
      <p className="text-muted max-w-lg mb-6">{t('emptyDescription')}</p>
      <Button
        variant="outline"
        className="rounded-full font-medium"
        onPress={() => setIsEditing(true)}
      >
        {t('getStarted')}
      </Button>
    </div>
  );
}
