'use client';

import { CategorySlug } from '@/app/[locale]/category/category.types';
import { Checkbox, CheckboxGroup, Label } from '@heroui/react';
import { useTranslations } from 'next-intl';

type CategorySelectorProps = {
  slugs: CategorySlug[];
};

export function CategorySelector({ slugs }: CategorySelectorProps) {
  const t = useTranslations('CreateArticlePage');
  const tCategories = useTranslations('Categories');

  return (
    <div className="flex w-full flex-col gap-1">
      <Label className="ml-1 text-sm font-medium text-foreground">
        {t('labelCategory')}
      </Label>
      <CheckboxGroup
        name="categorySlugs"
        className="flex flex-row flex-wrap space-x-2"
        isRequired
      >
        {slugs.map((slug) => (
          <Checkbox
            key={slug}
            value={slug}
            variant="secondary"
          >
            <Checkbox.Content className="group flex w-full flex-row gap-4 rounded-full bg-surface px-2 py-1 transition-all data-[selected=true]:bg-accent/20 group">
              <Checkbox.Control className="size-5 rounded-full before:rounded-full">
                <Checkbox.Indicator />
              </Checkbox.Control>
              <span>{tCategories(slug)}</span>
            </Checkbox.Content>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
