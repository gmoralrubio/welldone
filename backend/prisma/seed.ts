import process from 'process';
import bcrypt from 'bcrypt';
import { ArticleStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const SEED_PASSWORD = 'Seed1234!';

type SeedArticle = {
  title: string;
  intro: string;
  content: string;
  slug: string;
  status: ArticleStatus;
  publishedAt: Date;
  categorySlug: string;
};

const johnArticles: SeedArticle[] = [
  {
    title:
      'El renacimiento de la arquitectura de software: patrones limpios y simplicidad radical',
    intro:
      'Frente a la fatiga del sobre-diseño, la pureza de dominio y la mesura técnica devuelven claridad a los sistemas.',
    content:
      'Durante años confundimos arquitectura con cantidad de capas. Cada servicio nuevo traía un patrón de moda y una carpeta más, hasta que el mapa del sistema dejó de caber en la cabeza de quien lo mantenía.\n\nLo que está volviendo no es la nostalgia por el monolito, sino la disciplina de nombrar el dominio antes de elegir herramientas. Un módulo con una responsabilidad clara, una frontera explícita y pocas dependencias vale más que un diagrama impecable que nadie consulta.\n\nLa simplicidad radical no es escribir menos código a cualquier precio. Es negarse a introducir una abstracción hasta que el segundo caso de uso la justifique. Cuando esa regla se sostiene, el sistema vuelve a ser legible.',
    slug: 'el-renacimiento-de-la-arquitectura-de-software-patrones',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-01-15T10:00:00.000Z'),
    categorySlug: 'arquitectura-de-software',
  },
  {
    title: 'Por qué los nombres importan más que los frameworks',
    intro:
      'Un buen nombre reduce la necesidad de comentarios, reuniones y documentación que nadie lee.',
    content:
      'El framework de turno se reemplaza. El nombre de un concepto se queda en la base de datos, en las rutas y en la conversación del equipo durante años.\n\nCuando una función se llama processData, todo el mundo tiene que abrirla para saber qué hace. Cuando se llama publishArticle, el contrato cabe en la firma. Esa diferencia parece pequeña hasta que el código tiene cientos de módulos y alguien nuevo intenta orientarse.\n\nElegir nombres es diseño. Si dos ideas distintas comparten palabra, el modelo está mezclado. Si una idea necesita tres palabras para distinguirse, quizá todavía no está clara.',
    slug: 'por-que-los-nombres-importan-mas-que-los-frameworks',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-03-02T09:30:00.000Z'),
    categorySlug: 'arquitectura-de-software',
  },
  {
    title: 'Notas de un incidente que no debió llegar a producción',
    intro:
      'Un despliegue menor dejó el listado de artículos vacío durante cuarenta minutos. Esto es lo que falló antes del código.',
    content:
      'El cambio parecía inocuo: un filtro nuevo sobre la fecha de publicación. En local, con tres artículos, todo respondía. En producción, la consulta excluyó el catálogo entero porque la zona horaria del servidor no coincidía con la de los datos de prueba.\n\nNadie había escrito el caso en el que publishedAt está en el futuro o en otra zona. El test cubría el camino feliz y el equipo dio por buena la revisión porque el diff era corto.\n\nEl arreglo fue una línea. La lección fue otra: un incidente pequeño suele nacer de una suposición que nadie escribió. Desde entonces, cada filtro de fecha lleva un ejemplo con una fecha futura y otro con una fecha pasada.',
    slug: 'notas-de-un-incidente-que-no-debio-llegar-a-produccion',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-05-18T16:00:00.000Z'),
    categorySlug: 'desarrollo-web',
  },
  {
    title: 'La revisión de código como conversación',
    intro:
      'Aprobar un pull request no es firmar un trámite. Es la última ocasión de entender el cambio antes de que viva en producción.',
    content:
      'Las revisiones que solo cazan estilo generan ruido y enseñan al autor a ignorar los comentarios. Las que preguntan por el caso que falta cambian el diseño.\n\nUna buena nota de revisión nombra el riesgo, no el gusto. "Este slug puede repetirse entre autores" es útil. "Yo lo habría escrito distinto" no lo es. El primero se puede discutir con un ejemplo; el segundo solo reparte autoridad.\n\nCuando el equipo trata la revisión como conversación, los cambios pequeños dejan de colarse y los grandes dejan de convertirse en sorpresa el día del despliegue.',
    slug: 'la-revision-de-codigo-como-conversacion',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-08-04T11:15:00.000Z'),
    categorySlug: 'desarrollo-web',
  },
  {
    title: 'Medir antes de optimizar',
    intro:
      'Borrador sobre la tentación de reescribir una consulta que todavía no sabemos si es lenta.',
    content:
      'Esta nota todavía no está lista para publicarse. Quiero reunir tiempos reales del listado de artículos antes de proponer índices nuevos.\n\nLa hipótesis es simple: sin una medición, cualquier optimización es una preferencia. El borrador irá creciendo con los números del entorno local y con el plan de qué no vamos a tocar.',
    slug: 'medir-antes-de-optimizar',
    status: 'DRAFT',
    publishedAt: new Date('2026-09-20T08:00:00.000Z'),
    categorySlug: 'desarrollo-web',
  },
  {
    title: 'Colas, reintentos y la paciencia del sistema',
    intro:
      'Borrador sobre qué debe reintentarse solo y qué debe esperar a una persona.',
    content:
      'Todavía estoy ordenando los ejemplos. Un correo que falla por un timeout merece un reintento. Un pago duplicado no.\n\nCuando el texto distinga esos dos casos con claridad, saldrá de borrador. Hasta entonces se queda aquí, con la estructura y sin la conclusión.',
    slug: 'colas-reintentos-y-la-paciencia-del-sistema',
    status: 'DRAFT',
    publishedAt: new Date('2026-09-28T18:45:00.000Z'),
    categorySlug: 'desarrollo-web',
  },
  {
    title: 'Lo que cambia cuando el equipo crece de tres a diez',
    intro:
      'Las convenciones que sobraban en un grupo pequeño se vuelven el único mapa común.',
    content:
      'Con tres personas, el contexto vive en el chat y en la memoria. Con diez, esa memoria se parte y cada decisión implícita se convierte en un bug de entendimiento.\n\nEste texto recorre qué documentar de verdad: los límites del dominio, los estados de un artículo y quién puede publicarlo. No hace falta un manual. Hace falta que las reglas que ya cumplimos dejen de ser orales.\n\nEstá fechado para más adelante, cuando el equipo haya cerrado el acuerdo y el artículo pueda citarlo sin quedarse corto.',
    slug: 'lo-que-cambia-cuando-el-equipo-crece-de-tres-a-diez',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-11-12T10:00:00.000Z'),
    categorySlug: 'arquitectura-de-software',
  },
  {
    title: 'Un mapa breve de la observabilidad',
    intro:
      'Logs, métricas y trazas sirven a preguntas distintas. Mezclarlas es la forma más rápida de no ver nada.',
    content:
      'Un log cuenta un hecho. Una métrica cuenta cuántas veces ocurrió. Una traza cuenta el camino entre servicios. Pedirle a una sola de las tres que responda las otras dos preguntas acaba en paneles llenos y incidentes opacos.\n\nEl mapa que preparo para enero es corto a propósito: qué evento registramos al publicar, qué contador miramos en el listado y qué traza seguimos cuando una petición cruza la base de datos.\n\nHasta que esa fecha llegue, el artículo permanece programado y fuera del listado público.',
    slug: 'un-mapa-breve-de-la-observabilidad',
    status: 'PUBLISHED',
    publishedAt: new Date('2027-01-20T09:00:00.000Z'),
    categorySlug: 'arquitectura-de-software',
  },
];

const anaArticles: SeedArticle[] = [
  {
    title: 'Escribir en público sin pedir permiso',
    intro:
      'Publicar no exige una audiencia previa. Exige un texto que puedas firmar mañana sin avergonzarte.',
    content:
      'La espera de "estar lista" es una forma elegante de no publicar. Nadie concede el permiso. El primer artículo sale con lectores imaginarios y con la voz todavía prestada de lo que has leído esa semana.\n\nEscribir en público significa aceptar que el texto queda fechado. Dentro de un año puede parecerte ingenuo. Esa ingenuidad es la prueba de que avanzaste, no una razón para borrarlo.\n\nEmpieza por una idea que puedas explicar en un párrafo. Si el párrafo se sostiene, el artículo también.',
    slug: 'escribir-en-publico-sin-pedir-permiso',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-02-10T12:00:00.000Z'),
    categorySlug: 'diseno-ux-ui',
  },
  {
    title: 'El párrafo que sostiene un artículo',
    intro:
      'Antes del título y después de la anécdota, hay una frase que dice para qué existe el texto.',
    content:
      'Muchos borradores acumulan escenas y se olvidan de la afirmación. El lector termina sabiendo que hubo un café, un tren o una reunión, y no sabe qué se le pide que piense.\n\nEl párrafo que sostiene el artículo cabe casi siempre en cuatro líneas. Nombra el problema, la postura y el límite de esa postura. Todo lo demás —ejemplos, citas, cierres— trabaja para ese párrafo.\n\nSi al releer no encuentras esas cuatro líneas, el texto todavía es una colección de notas.',
    slug: 'el-parrafo-que-sostiene-un-articulo',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-04-07T08:20:00.000Z'),
    categorySlug: 'diseno-ux-ui',
  },
  {
    title: 'Lectores, no métricas',
    intro:
      'El número de visitas describe el distribuidor. No describe si el texto merecía quedarse.',
    content:
      'Una métrica responde a una pregunta concreta: ¿alguien abrió la página? No responde si entendió el argumento, si volvió o si el texto cambió una decisión pequeña.\n\nMirar el panel cada mañana empuja a repetir el formato que ya funcionó. La repetición llena el archivo y vacía la voz. Conviene decidir, antes de publicar, qué señal sí importa: un comentario que cita una frase, una respuesta que discute el punto, una relectura tuya a los tres meses.\n\nLas visitas pueden acompañar. No deberían elegir el siguiente título.',
    slug: 'lectores-no-metricas',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-06-21T17:40:00.000Z'),
    categorySlug: 'diseno-ux-ui',
  },
  {
    title: 'Cómo editar lo que ya creías terminado',
    intro:
      'La primera versión demuestra que la idea existe. La segunda demuestra que puedes sostenerla.',
    content:
      'Editar no es corregir comas. Es leer el texto como si lo hubiera escrito otra persona y preguntar qué sobra para que la idea llegue antes.\n\nUn método breve: marca la frase que repetiste tres veces y quédate con la más concreta. Busca el adjetivo que no cambia el sentido y quítalo. Lee el cierre y comprueba que no abre un tema nuevo.\n\nCuando el artículo cabe en una lectura en voz alta sin que te detengas a explicarlo, está más cerca de publicarse que cuando solo "se siente bien".',
    slug: 'como-editar-lo-que-ya-creias-terminado',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-09-01T13:05:00.000Z'),
    categorySlug: 'diseno-ux-ui',
  },
  {
    title: 'Títulos que prometen menos de lo que cumplen',
    intro:
      'Borrador sobre el daño de un título brillante puesto encima de un texto todavía flojo.',
    content:
      'Sigo reuniendo ejemplos de títulos que obligan al artículo a una tesis que el cuerpo no tiene. La nota está a medias: falta decidir si el remedio es bajar el título o subir el texto.\n\nHasta que esa decisión esté escrita con un antes y un después, esto permanece en borrador.',
    slug: 'titulos-que-prometen-menos-de-lo-que-cumplen',
    status: 'DRAFT',
    publishedAt: new Date('2026-09-15T10:10:00.000Z'),
    categorySlug: 'diseno-ux-ui',
  },
  {
    title: 'La voz propia no se encuentra el primer día',
    intro: 'Borrador sobre imitar a propósito y dejar de imitar a tiempo.',
    content:
      'Quiero contar cómo copié la estructura de tres autoras durante un mes y en qué frase noté que ya no las necesitaba. El relato todavía tiene huecos.\n\nCuando cierre esos huecos, el artículo dejará de ser un borrador. Hoy solo guarda la intención.',
    slug: 'la-voz-propia-no-se-encuentra-el-primer-dia',
    status: 'DRAFT',
    publishedAt: new Date('2026-09-30T19:00:00.000Z'),
    categorySlug: 'diseno-ux-ui',
  },
  {
    title: 'Archivos personales y la memoria del blog',
    intro:
      'Un blog sin fechas es un montón de páginas. Con fechas, es una biografía de lo que ibas entendiendo.',
    content:
      'Guardar cada versión publicada permite volver a una idea sin reescribir la historia. El archivo no es nostalgia: es la prueba de que una postura cambió y de cuándo cambió.\n\nEn diciembre quiero publicar una guía corta para ordenar ese archivo: slug estable, fecha visible y una nota al pie cuando el texto se corrija de verdad.\n\nHasta entonces el artículo está programado y no debe aparecer en el listado.',
    slug: 'archivos-personales-y-la-memoria-del-blog',
    status: 'PUBLISHED',
    publishedAt: new Date('2026-12-03T15:30:00.000Z'),
    categorySlug: 'diseno-ux-ui',
  },
  {
    title: 'Una defensa de los textos largos',
    intro:
      'La brevedad es una herramienta. No es una virtud automática ni el formato que mejor piensa.',
    content:
      'Un texto largo se gana el espacio cuando cada sección añade un matiz que la anterior no podía cargar. Si se puede cortar por la mitad sin perder la postura, no era largo: estaba diluido.\n\nEsta defensa sale en febrero, con tres ejemplos editados de artículos que necesitaron más de mil palabras para no mentir por omisión.\n\nLa fecha futura lo mantiene fuera del listado hasta que esos ejemplos estén cerrados.',
    slug: 'una-defensa-de-los-textos-largos',
    status: 'PUBLISHED',
    publishedAt: new Date('2027-02-14T11:00:00.000Z'),
    categorySlug: 'diseno-ux-ui',
  },
];

async function main() {
  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await prisma.$executeRaw`ALTER SEQUENCE "Category_id_seq" RESTART WITH 1`;

  await prisma.category.create({
    data: { name: 'Desarrollo Web', slug: 'desarrollo-web' },
  });
  await prisma.category.create({
    data: { name: 'Arquitectura de Software', slug: 'arquitectura-de-software' },
  });
  await prisma.category.create({
    data: { name: 'Diseño UX/UI', slug: 'diseno-ux-ui' },
  });

  //Encriptación de la contraseña simulando el registro real
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
    const { categorySlug, ...data } = article;
    await prisma.article.create({
      data: {
        ...data,
        categories: { connect: [{ slug: categorySlug }] },
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
