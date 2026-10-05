import { Card, Skeleton } from '@heroui/react';

export default function ArticleDetailLoading() {
  return (
    <main
      className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-10"
      aria-busy="true"
    >
      <p className="sr-only">Cargando artículo</p>

      <div
        className="flex items-center gap-2"
        aria-hidden="true"
      >
        <Skeleton className="h-3 w-12 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
        <Skeleton className="h-3 w-28 rounded" />
      </div>

      <div
        className="flex gap-2"
        aria-hidden="true"
      >
        <Skeleton className="h-6 w-24 rounded-sm" />
        <Skeleton className="h-6 w-28 rounded-sm" />
      </div>

      <header
        className="flex flex-col gap-4"
        aria-hidden="true"
      >
        <Skeleton className="h-12 w-full rounded sm:h-14" />
        <Skeleton className="h-12 w-4/5 rounded sm:h-14" />
        <Skeleton className="h-6 w-full rounded" />
        <Skeleton className="h-6 w-11/12 rounded" />
        <Card className="my-2 flex flex-col justify-between gap-3 bg-white p-4 sm:flex-row sm:items-center">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-10 rounded" />
            <Skeleton className="size-5 rounded" />
            <Skeleton className="size-5 rounded" />
          </div>
        </Card>
      </header>

      <Skeleton
        className="aspect-video w-full rounded"
        aria-hidden="true"
      />

      <div
        className="flex flex-col gap-4"
        aria-hidden="true"
      >
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-11/12 rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-4/5 rounded" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />
      </div>

      <Card
        className="bg-white p-8"
        aria-hidden="true"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-12 rounded" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          </div>
          <Skeleton className="h-9 w-24 rounded" />
        </div>
        <Skeleton className="mt-6 h-4 w-56 rounded" />
        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Skeleton className="h-36 w-full rounded sm:w-1/2" />
          <Skeleton className="h-36 w-full rounded sm:w-1/2" />
        </div>
      </Card>

      <section
        className="mt-4 space-y-6"
        aria-hidden="true"
      >
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-44 rounded" />
          <Skeleton className="h-7 w-10 rounded-xl" />
        </div>
        <Card className="space-y-4 bg-white p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="h-4 w-40 rounded" />
          </div>
          <Skeleton className="h-24 w-full rounded" />
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="size-4 rounded" />
              <Skeleton className="size-4 rounded" />
            </div>
            <Skeleton className="h-9 w-36 rounded" />
          </div>
        </Card>
        <CommentSkeleton />
        <CommentSkeleton />
      </section>
    </main>
  );
}

function CommentSkeleton() {
  return (
    <Card className="space-y-4 bg-white p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
      </div>
      <Skeleton className="h-5 w-full rounded" />
      <Skeleton className="h-5 w-11/12 rounded" />
      <Skeleton className="h-5 w-2/3 rounded" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-10 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    </Card>
  );
}
