import { SiteFooter } from '@/app/[locale]/components/shared/site-footer';
import { SiteHeader } from '@/app/[locale]/components/shared/site-header';
import { Card, Skeleton, Surface } from '@heroui/react';

const FEED_PLACEHOLDERS = 3;

export default function ArticlesLoading() {
  return (
    <div
      className="flex min-h-full flex-1 flex-col font-sans text-foreground"
      aria-busy="true"
    >
      <p className="sr-only">Cargando artículos</p>
      <SiteHeader
        search=""
        order="desc"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-8">
        <HeroSkeleton />
        <div className="grid items-start gap-10 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <section
            className="min-w-0"
            aria-hidden="true"
          >
            <div className="flex flex-col gap-6">
              {Array.from({ length: FEED_PLACEHOLDERS }, (_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
            <div className="mt-10 flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-28 rounded" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24 rounded" />
                <Skeleton className="size-9 rounded" />
                <Skeleton className="h-9 w-24 rounded" />
              </div>
            </div>
          </section>
          <SidebarSkeleton />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <section
      className="px-0 py-10"
      aria-hidden="true"
    >
      <Skeleton className="h-3 w-44 rounded" />
      <Card className="mt-4 grid gap-10 bg-white p-6 shadow-xs shadow-accent-dark/30 md:p-10 lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-8 lg:col-span-7">
          <div className="flex flex-col gap-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-24 rounded-sm" />
              <Skeleton className="h-6 w-28 rounded-sm" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
            <Skeleton className="h-10 w-full rounded md:h-12" />
            <Skeleton className="h-10 w-4/5 rounded md:h-12" />
            <Skeleton className="mt-1 h-5 w-full rounded" />
            <Skeleton className="h-5 w-11/12 rounded" />
            <Skeleton className="h-5 w-3/4 rounded" />
          </div>
          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded" />
              <Skeleton className="size-8 rounded" />
              <Skeleton className="h-8 w-10 rounded" />
            </div>
          </div>
        </div>
        <Skeleton className="min-h-64 rounded lg:col-span-5 lg:min-h-96" />
      </Card>
    </section>
  );
}

function CardSkeleton() {
  return (
    <Card className="flex flex-col gap-4 bg-white p-6 shadow-xs shadow-accent-dark/30 sm:flex-row sm:items-stretch">
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <Skeleton className="h-7 w-4/5 rounded" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-2/3 rounded" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-sm" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-8 rounded" />
            <Skeleton className="size-8 rounded" />
            <Skeleton className="size-8 rounded" />
          </div>
        </div>
      </div>
      <Skeleton className="aspect-3/2 w-full shrink-0 rounded sm:aspect-auto sm:w-48 sm:self-stretch" />
    </Card>
  );
}

function SidebarSkeleton() {
  return (
    <aside
      className="flex flex-col gap-6"
      aria-hidden="true"
    >
      <Surface className="rounded-3xl bg-white p-6 shadow-xs shadow-accent-dark/30">
        <Skeleton className="mb-2 h-3 w-20 rounded" />
        <Skeleton className="mb-4 h-10 w-full rounded" />
        <Skeleton className="mb-2 h-3 w-14 rounded" />
        <Skeleton className="mb-4 h-10 w-full rounded" />
        <Skeleton className="mb-2 h-3 w-36 rounded" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </Surface>
      <Surface className="rounded-3xl bg-white p-6 shadow-xs shadow-accent-dark/30">
        <Skeleton className="mb-4 h-3 w-24 rounded" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-32 rounded" />
          <Skeleton className="h-8 w-44 rounded" />
          <Skeleton className="h-8 w-28 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-40 rounded" />
          <Skeleton className="h-8 w-36 rounded" />
        </div>
      </Surface>
      <Surface className="rounded-3xl bg-white p-6 shadow-xs shadow-accent-dark/30">
        <Skeleton className="h-3 w-36 rounded" />
        <Skeleton className="mt-3 h-6 w-full rounded" />
        <Skeleton className="mt-2 h-6 w-4/5 rounded" />
        <Skeleton className="mt-3 h-3 w-full rounded" />
        <Skeleton className="mt-2 h-3 w-full rounded" />
        <Skeleton className="mt-2 h-3 w-2/3 rounded" />
        <Skeleton className="mt-4 h-9 w-full rounded-sm" />
      </Surface>
    </aside>
  );
}
