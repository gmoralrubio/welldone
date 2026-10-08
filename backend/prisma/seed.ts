import process from 'process';
import bcrypt from 'bcrypt';
import { ArticleStatus, PrismaClient } from '@prisma/client';
import {
  CATEGORIES,
  type CategorySlug,
} from '../src/domain/category/categories';
import { sanitizeArticleContent } from '../src/infrastructure/article/sanitizers/sanitizeArticleContent';

const prisma = new PrismaClient();

export const SEED_PASSWORD = 'Seed1234!';

function featuredImageUrl(slug: string) {
  return `https://picsum.photos/seed/${slug}/960/640`;
}

type SeedArticle = {
  title: string;
  intro: string;
  content: string;
  slug: string;
  status: ArticleStatus;
  publishedAt: Date;
  categorySlugs: CategorySlug[];
};

const johnArticles: SeedArticle[] = [
  {
    title:
      'El renacimiento de la arquitectura de software: patrones limpios y simplicidad radical',
    intro:
      'Frente a la fatiga del sobre-diseño, la pureza de dominio y la mesura técnica devuelven claridad a los sistemas.',
    content: `<h2>Menos capas, más dominio</h2><p>Durante años confundimos arquitectura con cantidad de capas. Cada servicio nuevo traía un patrón de moda y una carpeta más, hasta que el mapa del sistema dejó de caber en la cabeza de quien lo mantenía.</p><h3>Qué está volviendo</h3><p>Lo que está volviendo no es la nostalgia por el monolito, sino la disciplina de <strong>nombrar el dominio</strong> antes de elegir herramientas. Un módulo con una responsabilidad clara, una frontera explícita y pocas dependencias vale más que un diagrama impecable que nadie consulta.</p><p>La simplicidad radical no es escribir menos código a cualquier precio. Es <em>negarse a introducir una abstracción</em> hasta que el segundo caso de uso la justifique. Cuando esa regla se sostiene, el sistema vuelve a ser legible.</p>`,
    slug: 'el-renacimiento-de-la-arquitectura-de-software-patrones',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-01-15T10:00:00.000Z'),
    categorySlugs: ['arquitectura-de-software'],
  },
  {
    title: 'Por qué los nombres importan más que los frameworks',
    intro:
      'Un buen nombre reduce la necesidad de comentarios, reuniones y documentación que nadie lee.',
    content: `<p>El framework de turno se reemplaza. El nombre de un concepto se queda en la base de datos, en las rutas y en la conversación del equipo durante años.</p><blockquote>Cuando una función se llama processData, todo el mundo tiene que abrirla para saber qué hace. Cuando se llama publishArticle, el contrato cabe en la firma.</blockquote><p>Esa diferencia parece pequeña hasta que el código tiene cientos de módulos y alguien nuevo intenta orientarse. Elegir nombres es diseño. Si dos ideas distintas comparten palabra, el modelo está mezclado.</p><p>Hay una guía breve en <a href="https://martinfowler.com/bliki/TwoHardThings.html" rel="noopener noreferrer" target="_blank">Two Hard Things</a> que sigue siendo un buen recordatorio.</p>`,
    slug: 'por-que-los-nombres-importan-mas-que-los-frameworks',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-02T09:30:00.000Z'),
    categorySlugs: ['arquitectura-de-software', 'desarrollo-web'],
  },
  {
    title: 'Notas de un incidente que no debió llegar a producción',
    intro:
      'Un despliegue menor dejó el listado de artículos vacío durante cuarenta minutos. Esto es lo que falló antes del código.',
    content: `<p>El cambio parecía inocuo: un filtro nuevo sobre la fecha de publicación. En local, con tres artículos, todo respondía. En producción, la consulta excluyó el catálogo entero porque la zona horaria del servidor no coincidía con la de los datos de prueba.</p><h3>Qué faltaba en la revisión</h3><ul><li>Un caso con <em>publishedAt</em> en el futuro</li><li>Un caso con otra zona horaria</li><li>Un listado vacío esperado, no accidental</li></ul><p>El test cubría el camino feliz y el equipo dio por buena la revisión porque el diff era corto. El arreglo fue una línea. La lección, otra:</p><ol><li>Escribir la suposición que nadie nombró</li><li>Añadir un ejemplo con fecha futura</li><li>Añadir un ejemplo con fecha pasada</li></ol>`,
    slug: 'notas-de-un-incidente-que-no-debio-llegar-a-produccion',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-05-18T16:00:00.000Z'),
    categorySlugs: ['desarrollo-web', 'devops'],
  },
  {
    title: 'La revisión de código como conversación',
    intro:
      'Aprobar un pull request no es firmar un trámite. Es la última ocasión de entender el cambio antes de que viva en producción.',
    content: `<p>Las revisiones que solo cazan estilo generan ruido y enseñan al autor a ignorar los comentarios.</p><p>Las que preguntan por el caso que falta cambian el diseño.<br>Una buena nota de revisión nombra el riesgo, no el gusto.</p><p><u>Este slug puede repetirse entre autores</u> es útil. <s>Yo lo habría escrito distinto</s> no lo es. El primero se puede discutir con un ejemplo; el segundo solo reparte autoridad.</p><p>Cuando el equipo trata la revisión como conversación, los cambios pequeños dejan de colarse y los grandes dejan de convertirse en sorpresa el día del despliegue.</p>`,
    slug: 'la-revision-de-codigo-como-conversacion',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-08-04T11:15:00.000Z'),
    categorySlugs: ['desarrollo-web'],
  },
  {
    title: 'Medir antes de optimizar',
    intro:
      'Borrador sobre la tentación de reescribir una consulta que todavía no sabemos si es lenta.',
    content: `<p>Esta nota todavía no está lista para publicarse. Quiero reunir tiempos reales del listado de artículos antes de proponer índices nuevos.</p><p>La hipótesis es simple: sin una medición, cualquier optimización es una preferencia. El borrador irá creciendo con los números del entorno local y con el plan de qué no vamos a tocar.</p>`,
    slug: 'medir-antes-de-optimizar',
    status: 'DRAFT',
    publishedAt: new Date('2026-09-20T08:00:00.000Z'),
    categorySlugs: ['desarrollo-web'],
  },
  {
    title: 'Colas, reintentos y la paciencia del sistema',
    intro:
      'Borrador sobre qué debe reintentarse solo y qué debe esperar a una persona.',
    content: `<p>Todavía estoy ordenando los ejemplos. Un correo que falla por un timeout merece un reintento. Un pago duplicado no.</p><p>Cuando el texto distinga esos dos casos con claridad, saldrá de borrador. Hasta entonces se queda aquí, con la estructura y sin la conclusión.</p>`,
    slug: 'colas-reintentos-y-la-paciencia-del-sistema',
    status: 'DRAFT',
    publishedAt: new Date('2026-09-28T18:45:00.000Z'),
    categorySlugs: ['devops'],
  },
  {
    title: 'Lo que cambia cuando el equipo crece de tres a diez',
    intro:
      'Las convenciones que sobraban en un grupo pequeño se vuelven el único mapa común.',
    content: `<h2>El contexto deja de caber en el chat</h2><p>Con tres personas, el contexto vive en el chat y en la memoria. Con diez, esa memoria se parte y cada decisión implícita se convierte en un bug de entendimiento.</p><p>Qué documentar de verdad:</p><ul><li>Los límites del dominio</li><li>Los estados de un artículo</li><li>Quién puede publicarlo</li></ul><p>No hace falta un manual. Hace falta que las reglas que ya cumplimos dejen de ser orales.</p>`,
    slug: 'lo-que-cambia-cuando-el-equipo-crece-de-tres-a-diez',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-11-12T10:00:00.000Z'),
    categorySlugs: ['arquitectura-de-software'],
  },
  {
    title: 'Un mapa breve de la observabilidad',
    intro:
      'Logs, métricas y trazas sirven a preguntas distintas. Mezclarlas es la forma más rápida de no ver nada.',
    content: `<p>Un log cuenta un hecho. Una métrica cuenta cuántas veces ocurrió. Una traza cuenta el camino entre servicios.</p><p>El mapa que preparo para enero es corto a propósito:</p><pre>publish_article.started
publish_article.failed{reason}
listing.query.duration_ms
request.trace_id → db.query</pre><p>Hasta que esa fecha llegue, el artículo permanece programado y fuera del listado público.</p>`,
    slug: 'un-mapa-breve-de-la-observabilidad',
    status: 'PUBLISHED',
    publishedAt: new Date('2027-01-20T09:00:00.000Z'),
    categorySlugs: ['devops', 'arquitectura-de-software'],
  },
  {
    title: 'Qué puede hacer un modelo y qué no debería decidir',
    intro:
      'La IA acelera un borrador. No debería publicar, ni elegir la categoría, ni firmar el texto.',
    content: `<h2>Un asistente, no un autor</h2><p>Un modelo puede proponer un título, recortar un párrafo o señalar una repetición. Eso ahorra tiempo. Lo que no puede hacer es <strong>responder</strong> por ti cuando el texto sale a la plaza pública.</p><h3>Límites útiles</h3><ul><li>Borrador: sí</li><li>Revisión de claridad: sí</li><li>Publicar o asignar categoría: no</li></ul><p>Si el artículo necesita una postura, esa postura tiene que poder defenderse sin el modelo en la sala.</p>`,
    slug: 'que-puede-hacer-un-modelo-y-que-no-deberia-decidir',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-07-08T09:00:00.000Z'),
    categorySlugs: ['inteligencia-artificial'],
  },
];

const anaArticles: SeedArticle[] = [
  {
    title: 'Escribir en público sin pedir permiso',
    intro:
      'Publicar no exige una audiencia previa. Exige un texto que puedas firmar mañana sin avergonzarte.',
    content: `<h2>Nadie concede el permiso</h2><p>La espera de <em>estar lista</em> es una forma elegante de no publicar. El primer artículo sale con lectores imaginarios y con la voz todavía prestada de lo que has leído esa semana.</p><h3>El texto queda fechado</h3><p>Escribir en público significa aceptar que dentro de un año puede parecerte ingenuo. Esa ingenuidad es la prueba de que avanzaste, no una razón para borrarlo.</p><p><strong>Empieza por una idea que puedas explicar en un párrafo.</strong> Si el párrafo se sostiene, el artículo también.</p>`,
    slug: 'escribir-en-publico-sin-pedir-permiso',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-02-10T12:00:00.000Z'),
    categorySlugs: ['diseno-ux-ui'],
  },
  {
    title: 'El párrafo que sostiene un artículo',
    intro:
      'Antes del título y después de la anécdota, hay una frase que dice para qué existe el texto.',
    content: `<p>Muchos borradores acumulan escenas y se olvidan de la afirmación. El lector termina sabiendo que hubo un café, un tren o una reunión, y no sabe qué se le pide que piense.</p><blockquote>El párrafo que sostiene el artículo cabe casi siempre en cuatro líneas. Nombra el problema, la postura y el límite de esa postura.</blockquote><p>Todo lo demás —ejemplos, citas, cierres— trabaja para ese párrafo. Si al releer no encuentras esas cuatro líneas, el texto todavía es una colección de notas. Hay un recordatorio útil en <a href="https://www.gutenberg.org/ebooks/2701" rel="noopener noreferrer" target="_blank">cómo se sostiene una tesis larga</a>.</p>`,
    slug: 'el-parrafo-que-sostiene-un-articulo',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-04-07T08:20:00.000Z'),
    categorySlugs: ['diseno-ux-ui'],
  },
  {
    title: 'Lectores, no métricas',
    intro:
      'El número de visitas describe el distribuidor. No describe si el texto merecía quedarse.',
    content: `<p>Una métrica responde a una pregunta concreta: ¿alguien abrió la página? No responde si entendió el argumento, si volvió o si el texto cambió una decisión pequeña.</p><p>Señales que sí importan:</p><ul><li>Un comentario que cita una frase</li><li>Una respuesta que discute el punto</li><li>Una relectura tuya a los tres meses</li></ul><p>Cómo no dejar que el panel elija el siguiente título:</p><ol><li>Decidir la señal antes de publicar</li><li>Mirar visitas como acompañamiento, no como veredicto</li><li>Repetir un formato solo si la idea lo pide</li></ol>`,
    slug: 'lectores-no-metricas',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-06-21T17:40:00.000Z'),
    categorySlugs: ['diseno-ux-ui'],
  },
  {
    title: 'Cómo editar lo que ya creías terminado',
    intro:
      'La primera versión demuestra que la idea existe. La segunda demuestra que puedes sostenerla.',
    content: `<p>Editar no es corregir comas. Es leer el texto como si lo hubiera escrito otra persona y preguntar qué sobra para que la idea llegue antes.</p><p>Un método breve:<br>marca la frase que repetiste tres veces y quédate con la más concreta.</p><p>Busca el adjetivo que no cambia el sentido y quítalo. Lee el cierre y comprueba que no abre un tema nuevo. <u>Cuando el artículo cabe en una lectura en voz alta</u> sin que te detengas a explicarlo, está más cerca de publicarse que cuando solo <s>se siente bien</s>.</p>`,
    slug: 'como-editar-lo-que-ya-creias-terminado',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-09-01T13:05:00.000Z'),
    categorySlugs: ['diseno-ux-ui'],
  },
  {
    title: 'Títulos que prometen menos de lo que cumplen',
    intro:
      'Borrador sobre el daño de un título brillante puesto encima de un texto todavía flojo.',
    content: `<p>Sigo reuniendo ejemplos de títulos que obligan al artículo a una tesis que el cuerpo no tiene. La nota está a medias: falta decidir si el remedio es bajar el título o subir el texto.</p><p>Hasta que esa decisión esté escrita con un antes y un después, esto permanece en borrador.</p>`,
    slug: 'titulos-que-prometen-menos-de-lo-que-cumplen',
    status: 'DRAFT',
    publishedAt: new Date('2026-09-15T10:10:00.000Z'),
    categorySlugs: ['diseno-ux-ui'],
  },
  {
    title: 'La voz propia no se encuentra el primer día',
    intro: 'Borrador sobre imitar a propósito y dejar de imitar a tiempo.',
    content: `<p>Quiero contar cómo copié la estructura de tres autoras durante un mes y en qué frase noté que ya no las necesitaba. El relato todavía tiene huecos.</p><p>Cuando cierre esos huecos, el artículo dejará de ser un borrador. Hoy solo guarda la intención.</p>`,
    slug: 'la-voz-propia-no-se-encuentra-el-primer-dia',
    status: 'DRAFT',
    publishedAt: new Date('2026-09-30T19:00:00.000Z'),
    categorySlugs: ['diseno-ux-ui'],
  },
  {
    title: 'Archivos personales y la memoria del blog',
    intro:
      'Un blog sin fechas es un montón de páginas. Con fechas, es una biografía de lo que ibas entendiendo.',
    content: `<h2>El archivo no es nostalgia</h2><p>Guardar cada versión publicada permite volver a una idea sin reescribir la historia. Es la prueba de que una postura cambió y de cuándo cambió.</p><p>En diciembre quiero publicar una guía corta: slug estable, fecha visible y una nota al pie cuando el texto se corrija de verdad. Un ejemplo de archivo largo está en <a href="https://blog.codinghorror.com/" rel="noopener noreferrer" target="_blank">Coding Horror</a>.</p><p>Hasta entonces el artículo está programado y no debe aparecer en el listado.</p>`,
    slug: 'archivos-personales-y-la-memoria-del-blog',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-12-03T15:30:00.000Z'),
    categorySlugs: ['diseno-ux-ui'],
  },
  {
    title: 'Una defensa de los textos largos',
    intro:
      'La brevedad es una herramienta. No es una virtud automática ni el formato que mejor piensa.',
    content: `<p>Un texto largo se gana el espacio cuando cada sección añade un matiz que la anterior no podía cargar. Si se puede cortar por la mitad sin perder la postura, no era largo: estaba diluido.</p><blockquote>Esta defensa sale en febrero, con tres ejemplos editados de artículos que necesitaron más de mil palabras para no mentir por omisión.</blockquote><p>La fecha futura lo mantiene fuera del listado hasta que esos ejemplos estén cerrados.</p>`,
    slug: 'una-defensa-de-los-textos-largos',
    status: 'PUBLISHED',
    publishedAt: new Date('2027-02-14T11:00:00.000Z'),
    categorySlugs: ['diseno-ux-ui'],
  },
  {
    title: 'Secretos que no deberían vivir en el repositorio',
    intro:
      'Un token en un commit es un incidente. Aunque lo borres después, el historial lo recuerda.',
    content: `<p>La forma más rápida de filtrar una clave no es un atacante sofisticado. Es un archivo de entorno subido sin querer. Si está en git, asume que alguien lo copió.</p><ul><li>No commitear archivos de entorno</li><li>Rotar cualquier secreto que haya viajado en un diff</li><li>Revisar el historial, no solo el último commit</li></ul><p>OWASP resume el patrón en <a href="https://owasp.org/www-community/vulnerabilities/Use_of_hard-coded_cryptographic_key" rel="noopener noreferrer" target="_blank">hard-coded cryptographic key</a>.</p>`,
    slug: 'secretos-que-no-deberian-vivir-en-el-repositorio',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-08-22T14:00:00.000Z'),
    categorySlugs: ['ciberseguridad'],
  },
];

async function main() {
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$executeRaw`ALTER SEQUENCE "Category_id_seq" RESTART WITH 1`;

  await prisma.category.createMany({
    data: CATEGORIES.map(({ slug, name }) => ({ slug, name })),
  });

  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 10);

  const john = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John',
      surname: 'Doe',
      username: 'jdoe',
    },
  });

  const ana = await prisma.user.create({
    data: {
      email: 'ana@example.com',
      password: hashedPassword,
      name: 'Ana',
      surname: 'Ruiz',
      username: 'aruiz',
    },
  });

  const articles = [
    ...johnArticles.map((article) => ({ ...article, authorId: john.id })),
    ...anaArticles.map((article) => ({ ...article, authorId: ana.id })),
  ];

  for (const article of articles) {
    const { categorySlugs, content, ...data } = article;
    await prisma.article.create({
      data: {
        ...data,
        content: sanitizeArticleContent(content),
        featuredImageUrl: featuredImageUrl(article.slug),
        categories: {
          connect: categorySlugs.map((slug) => ({ slug })),
        },
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
