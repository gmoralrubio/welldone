'use client';

import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Input,
  TextArea,
} from '@heroui/react';
import { Check } from '@gravity-ui/icons';
import { createArticleAction } from '../actions';

export default function CreateArticlePage() {
  const categories = [
    { id: 1, name: 'Desarrollo Web' },
    { id: 2, name: 'Arquitectura de Software' },
    { id: 3, name: 'Diseño UX/UI' },
  ];

  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-10">
        
        <Breadcrumbs aria-label="Migas de pan">
          <Breadcrumbs.Item className="uppercase" href="/">
            <span className="text-xs">Inicio</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="uppercase" href="/articles">
            <span className="text-xs">Artículos</span>
          </Breadcrumbs.Item>
          <Breadcrumbs.Item className="uppercase">
            <span className="text-xs">Nuevo Artículo</span>
          </Breadcrumbs.Item>
        </Breadcrumbs>

        <header className="flex flex-col gap-4">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl tracking-tight font-serif text-balance">
            Escribe tu historia
          </h1>
          <p className="text-lg xs:text-xl leading-7 font-serif text-muted text-balance">
            Comparte tus conocimientos con la comunidad.
          </p>
        </header>

        <form action={createArticleAction} className="flex flex-col gap-6">
          <Card className="p-2 shadow-sm border border-border">
            <CardContent className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground ml-1">Título del artículo *</label>
                <Input
                  required
                  name="title"
                  placeholder="Ej: Patrones de diseño en React..."
                  variant="secondary"
                  className="font-serif text-xl"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground ml-1">Introducción *</label>
                <TextArea
                  required
                  name="intro"
                  placeholder="Un breve resumen para enganchar al lector..."
                  variant="secondary"
                  rows={2}
                  className="font-serif"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <label className="text-sm font-medium text-foreground ml-1">Categoría principal *</label>
                  <select
                    required
                    name="categoryId"
                    className="w-full h-10 px-3 rounded-md bg-surface-secondary border-none font-serif text-foreground outline-none focus:ring-2 focus:ring-accent appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <label className="text-sm font-medium text-foreground ml-1">Estado de publicación *</label>
                  <select
                    required
                    name="status"
                    defaultValue="DRAFT"
                    className="w-full h-10 px-3 rounded-md bg-surface-secondary border-none font-serif text-foreground outline-none focus:ring-2 focus:ring-accent appearance-none"
                  >
                    <option value="DRAFT">Guardar como Borrador</option>
                    <option value="PUBLISHED">Publicar Inmediatamente</option>
                  </select>
                </div>
              </div>

              {/* NUEVO: Campo para programar la fecha de publicación */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground ml-1">Fecha y hora de publicación (Opcional)</label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  className="w-full h-10 px-3 rounded-md bg-surface-secondary border-none font-serif text-foreground outline-none focus:ring-2 focus:ring-accent"
                />
                <span className="text-xs text-muted ml-1">Si lo dejas en blanco, se usará la fecha actual.</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <label className="text-sm font-medium text-foreground ml-1">URL de Imagen Destacada (Opcional)</label>
                  <Input
                    name="featuredImageUrl"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    variant="secondary"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <label className="text-sm font-medium text-foreground ml-1">URL de Vídeo Destacado (Opcional)</label>
                  <Input
                    name="featuredVideoUrl"
                    placeholder="https://ejemplo.com/video.mp4"
                    variant="secondary"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-foreground ml-1">Contenido *</label>
                <TextArea
                  required
                  name="content"
                  placeholder="Escribe el contenido completo de tu artículo aquí..."
                  variant="secondary"
                  rows={10}
                  className="font-serif text-lg leading-relaxed"
                />
              </div>

            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
            <Button className="bg-black text-white" type="submit">
              <Check width={18} />
              Guardar Artículo
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}