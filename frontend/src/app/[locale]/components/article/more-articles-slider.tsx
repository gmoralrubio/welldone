'use client';

import { articleHref, formatDate } from '@/lib/article/article-presenters';
import { ArticleDto } from '@/lib/article/articles.types';
import { Link } from '@/i18n/navigation';
import { Card } from '@heroui/react';
import { ArrowLeft, ArrowRight } from '@gravity-ui/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

type MoreArticlesSliderProps = {
  articles: ArticleDto[];
};

const arrowClassName =
  'absolute top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center text-foreground disabled:pointer-events-none disabled:opacity-[0.35] [&.swiper-button-lock]:hidden';

export function MoreArticlesSlider({ articles }: MoreArticlesSliderProps) {
  const t = useTranslations('ArticleDetailPage');
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    <div className="relative min-w-0">
      <button
        type="button"
        ref={setPrevEl}
        aria-label={t('commentsPrevious')}
        className={`${arrowClassName} -left-8`}
      >
        <ArrowLeft className="size-4" />
      </button>
      <button
        type="button"
        ref={setNextEl}
        aria-label={t('commentsNext')}
        className={`${arrowClassName} -right-8`}
      >
        <ArrowRight className="size-4" />
      </button>
      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl, nextEl }}
        watchOverflow
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
        }}
        className="w-full min-w-0"
      >
        {articles.map((article) => {
          const category = article.categories[0]?.name;

          return (
            <SwiperSlide
              key={article.id}
              className="h-auto"
            >
              <Card className="group flex h-full flex-col justify-between p-6 transition-shadow hover:shadow-md">
                <div>
                  {category ? (
                    <span className="text-xs font-medium uppercase text-accent">
                      {category}
                    </span>
                  ) : null}
                  <h5 className="mt-2 text-balance font-serif text-xl font-semibold leading-tight">
                    <Link
                      href={articleHref(article)}
                      className="text-foreground no-underline transition-colors group-hover:text-accent"
                    >
                      {article.title}
                    </Link>
                  </h5>
                </div>
                <span className="mt-4 inline text-sm text-muted">
                  {formatDate(article.publishedAt)}
                </span>
              </Card>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
