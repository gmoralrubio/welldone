# Práctica Final: WellDone

## KeepCoding Web Development Bootcamp

## Llegó el momento joven padawan

Hermanos del código, llegó el momento de quitaros los ruedines de la bicicleta y que empecéis a pedalear solos.

El objetivo de este proyecto final es poner en práctica todos los conocimientos adquiridos a lo largo del bootcamp, simulando una situación real: desarrollo en equipo de un producto con la arquitectura que hemos estudiado. El desarrollo se hará usando SCRUM, teniendo que coordinar no sólo vuestro propio trabajo y tiempo, sino también el del equipo del cual formáis parte.

Hay que vivirlo como si fuera un proyecto real, solicitado por un cliente, con un plazo muy ajustado (99% de los casos :-)), y donde se debe entregar el mejor y más completo prototipo posible.

Habrá que investigar, tomar decisiones, estudiar y aprender cosas nuevas, tal como en la vida real. ¿Lo fundamental? Aprender, consolidar conocimientos y disfrutar, ya que probablemente será la última vez que podrás enfrentarte a un desarrollo de proyecto con la posibilidad de acudir a tutorías para aclarar dudas.

No se espera que terminéis el proyecto completo, aunque se valorará aquellos equipos que avancen más que los demás. Por ello el proyecto se abordará como un backlog de historias de usuario que tendréis que priorizar ir implementando para conseguir un producto lo más completo posible.

Podéis añadir, reemplazar o modificar funcionalidades a vuestro gusto para conseguir así un producto mejor. Estas modificaciones siempre deberán ser para mejorar o alinear mejor el producto al plan de negocio que tendréis que proponer, en ningún caso para “escaquearse” de trabajo.

## El prototipo: WellDone

WellDone es una red de blogging que pretende ser la competencia de Medium.com. Para ello, necesitamos tener una web superchula pero, al igual que Jobs con el primer Macintosh, queremos que las tripas de la criatura sean también una auténtica belleza, es decir: el código debe de ser sublime.

No os pedimos en absoluto, desarrollar un nuevo Medium.com, si no que, partiendo de esta base nos sorprendáis con vuestro nuevo proyecto. Éste puede ir enfocado a cualquier otra área (verticalizando el producto, por ejemplo). Podéis modificar ampliando el modelo pero nunca hacerlo más básico.

Por tanto, debéis trabajar tanto el código como el producto que ofrece la plataforma, es realmente importante dedicar algún tiempo al inicio de primer Sprint para definir el plan de negocio que se va a aplicar. Somos conscientes de que os pedimos un MVP por lo que, una versión 1.0 en plan de negocio se dará como válida, ¡aún así esperamos que nos sorprendáis!

Por ello, los instructores hemos escrito este documento que describe las funcionalidades o historias de usuario y componentes que creemos que debe tener la plataforma para plantar cara a Medium.com.

## Consideraciones generales

- Nuestras expectativas son muy altas y queremos que nuestra plataforma se utilice en todo el mundo, por tanto la plataforma deberá estar perfectamente preparada para su uso en varios idiomas.
- Tenéis total libertad para la elección de tecnologías y arquitecturas a utilizar: es vuestro producto.
- Para dotar de gran calidad al producto, se deberán gestionar correctamente todos los estados de interfaz que utilice cada componente: cargando, estado ideal, estado con error, estado vacío y estado en progreso.
- La práctica se deberá demostrar en funcionamiento en un servidor que esté accesible desde internet. Podéis elegir el proveedor que deseéis (AWS, Azure, OVH, Digital Ocean, etc…)

## Componentes principales de la plataforma

La plataforma debe contar con tres componentes principales:

1. Web pública: un sitio web tradicional donde se puede acceder a los contenidos de manera pública. Esta web pública es importante que esté optimizada para SEO ya que se pretende facilitar la labor de posicionamiento de los contenidos de los miembros de la plataforma. Como no podía ser de otra manera, la web pública debe poder utilizarse desde cualquier dispositivo: móviles, tablets y ordenadores de escritorio.
2. Webapp de administración: los usuarios que quieran ser miembros deberán registrarse en la plataforma para tener acceso a la web app de administración. Esta web app es privada (sólo se puede acceder a través de un login). Al ser privada, podemos utilizar tecnologías web como Angular para ofrecer una experiencia de usuario fantástica. Éste es un elemento clave para la fidelización de nuestros usuarios clave: los miembros de la plataforma.
3. API REST: Como no puede ser de otra manera, queremos ofrecer un API Rest para que el día de mañana se pueda desarrollar otros tipos de aplicaciones cliente para plataforma (como aplicaciones móviles o de escritorio). Además, este API REST será utilizada a su vez por la web app de administración.

## Roles definidos

Tras un análisis del proyecto, detectamos los siguientes roles definidos:

- Lector: usuario de la web pública cuyo principal interés es la lectura de artículos.
- Miembro de la plataforma: usuario de la web app de administración cuyo principal interés es la redacción de artículos.

### Resumen roles

| Área                                   | Lector sin registrar | Miembro registrado |
| -------------------------------------- | -------------------- | ------------------ |
| Consultar artículos públicos           | Sí                   | Sí                 |
| Buscar y navegar por artículos         | Sí                   | Sí                 |
| Ver perfiles, comentarios y subrayados | Sí                   | Sí                 |
| Compartir artículos en redes sociales  | Sí                   | Sí                 |
| Gestionar perfil y cuenta              | Sí                   | Sí                 |
| Comentar, responder y marcar favoritos | No                   | Sí                 |
| Seguir autores y subrayar contenido    | No                   | Sí                 |
| Crear y gestionar artículos            | No                   | Sí                 |
| Recibir notificaciones                 | No                   | Sí                 |
| Acceder al dashboard                   | No                   | Sí                 |

## Historias de usuario o funcionalidades

A continuación se detallan las funcionalidades deseables de la plataforma:

## 1. Web pública

### Alta de usuario

Como lector desde la web pública, quiero poder darme de alta en el sistema para poder así autenticarme y poder realizar funciones como miembro de la plataforma indicando mi nombre, apellidos, dirección de e-mail, nombre de usuario o nickname y contraseña de acceso.

**Restricciones/Criterios de aceptación**

- No se podrá utilizar un nombre de usuario que ya exista en el sistema
- No se podrá utilizar un e-mail que ya exista en el sistema
  : endpoint del API REST

### Baja de usuario

Como miembro de la plataforma, quiero poder dar de baja mi cuenta desde la webapp de administración para dejar de ser miembro de la plataforma.

**Restricciones/Criterios de aceptación**

- Se deberá eliminar toda la información relacionada con el usuario miembro cuando se realice la baja
  : endpoint del API REST

### Actualización de datos de usuario

Como miembro de la plataforma quiero poder actualizar mis datos desde la webapp de administración de manera que puedo corregir y poner al día cualquiera de mis datos así como cambiar mi contraseña.

**Restricciones/Criterios de aceptación**

- Un usuario sólo podrá actualizar sus datos si está autenticado
- No podrá cambiar el e-mail o nickname por otro que ya esté siendo utilizado
  : endpoint del API REST

### Recuperación de contraseña

Como miembro de la plataforma quiero poder recuperar mi contraseña por si la olvido para poder así volver a hacer login en la webapp de administración.

**Restricciones/Criterios de aceptación**

- Para recuperar la contraseña, el usuario deberá indicar la dirección de e-mail asociada a su cuenta de usuario
- Cuando el usuario indique el e-mail correcto, deberá recibir un e-mail con un enlace que permita re-establecer su nueva contraseña
  : endpoints del API REST

### Ver listado de últimos artículos

Como lector quiero poder acceder a un listado de los últimos artículos publicados por los miembros de la plataforma al acceder a la página principal del dominio para así acceder a los últimos contenidos de manera rápida.

**Restricciones/Criterios de aceptación**

- Se deben mostrar los últimos artículos publicados por orden cronológico, siendo el primero el más reciente y el último el más antiguo
- No se deben mostrar todos los artículos publicados en la página inicial, se debe poner un límite al número de artículos mostrados
- Sólo se deberán mostrar los artículos publicados, en ningún caso los artículos en borrador o con fecha de publicación a futuro
- La UI deberá ser consistente a otros listados de artículos para lectores como el listado de artículos de una categoría, listado de artículos de un miembro de la plataforma o los resultados de una búsqueda
- Cada artículo deberá mostrar: su título, su vídeo o imagen destacada (si tuviera), un texto a modo de introducción, la fecha de publicación, el miembro de la plataforma autor del artículo
- Los artículos en estado borrador nunca deberán ser visibles en la web pública
- Los artículos cuya fecha de publicación sea futura nunca deberán ser visibles en la parte pública

### Ver artículos de una categoría

Como lector quiero poder acceder a un listado de los últimos artículos publicados por los miembros de la plataforma en una categoría específica al pulsar sobre el enlace de una categoría (desde el menú principal o cualquier otro enlace que lleve a la URL de la categoría)

**Restricciones/Criterios de aceptación**

- Se deben mostrar los últimos artículos publicados en la categoría por orden cronológico, siendo el primero el más reciente y el último el más antiguo
- No se deben mostrar todos los artículos publicados en la categoría, se debe poner un límite al número de artículos mostrados
- Sólo se deberán mostrar los artículos publicados, en ningún caso los artículos en borrador o con fecha de publicación a futuro
- La UI deberá ser consistente a otros listados de artículos para lectores como el listado de últimos artículos, listado de artículos de un miembro de la plataforma o los resultados de una búsqueda
- Cada artículo deberá mostrar: su título, su vídeo o imagen destacada (si tuviera), un texto a modo de introducción, la fecha de publicación, el miembro de la plataforma autor del artículo
- Los artículos en estado borrador nunca deberán ser visibles en la web pública
- Los artículos cuya fecha de publicación sea futura nunca deberán ser visibles en la parte pública

### Ver artículos de un miembro

Como lector quiero poder acceder a un listado de los últimos artículos publicados por un miembro de la plataforma específico cuando accedo a la url de su perfil

**Restricciones/Criterios de aceptación**

- Las URLs de los miembros de la plataforma deberán ser `/<nombre_de_usuario_del_miembro>/`
- Se deben mostrar los últimos artículos publicados por dicho miembro la categoría por orden cronológico, siendo el primero el más reciente y el último el más antiguo
- No se deben mostrar todos los artículos publicados por el miembro de la plataforma, se debe poner un límite al número de artículos mostrados
- Sólo se deberán mostrar los artículos publicados, en ningún caso los artículos en borrador o con fecha de publicación a futuro
- La UI deberá ser consistente a otros listados de artículos para lectores como el listado de últimos artículos, listado de artículos de una categoría o los resultados de una búsqueda
- Cada artículo deberá mostrar: su título, su vídeo o imagen destacada (si tuviera), un texto a modo de introducción, la fecha de publicación, el miembro de la plataforma autor del artículo
- Los artículos en estado borrador nunca deberán ser visibles en la web pública
- Los artículos cuya fecha de publicación sea futura nunca deberán ser visibles en la parte pública

### Buscar (y encontrar) artículos

Como lector quiero poder buscar artículos utilizando un buscador para así encontrar rápidamente artículos que traten sobre lo que me interesa en un momento dado.

**Restricciones/Criterios de aceptación**

- Se deben mostrar los artículos que encajen en la búsqueda por orden cronológico, siendo el primero el más reciente y el último el más antiguo
- No se deben mostrar todos los artículos que encajan en la búsqueda, se debe poner un límite al número de artículos mostrados
- Sólo se deberán mostrar los artículos publicados, en ningún caso los artículos en borrador o con fecha de publicación a futuro
- La UI deberá ser consistente a otros listados de artículos para lectores como el listado de últimos artículos, listado de artículos de una categoría o el listado de artículos de un miembro de la plataforma
- Cada artículo deberá mostrar: su título, su vídeo o imagen destacada (si tuviera), un texto a modo de introducción, la fecha de publicación, el miembro de la plataforma autor del artículo
- Los artículos en estado borrador nunca deberán ser visibles en la web pública
- Los artículos cuya fecha de publicación sea futura nunca deberán ser visibles en la parte pública

### Ver artículos más antiguos o más recientes

Como lector quiero acceder a artículos más antiguos o más recientes desde los diferentes listados de artículos (últimos artículos, artículos de un miembro de la plataforma, artículos de una categoría o resultados de búsqueda) para poder así navegar por todos los artículos que hay en el listado que estoy utilizando.

**Restricciones/Criterios de aceptación**

- Sólo se podrán visualizar artículos más antiguos si los hay
- Sólo se podrán visualizar artículos más recientes si los hay
- Los artículos en estado borrador nunca deberán ser visibles en la web pública
- Los artículos cuya fecha de publicación sea futura nunca deberán ser visibles en la parte pública

### Ver detalle de un artículo

Como lector quiero poder acceder al detalle de un artículo desde algún listado de artículos para poder leer todo su contenido.

**Restricciones/Criterios de aceptación**

- Cada artículo deberá tener una URL única
- La imagen destacada del artículo deberá ser responsive (deberán existir varios formatos de imagen para servir la mejor imagen en función del dispositivo)
- La URL de un artículo deberán ser SEO-Friendly: `/<nombre_de_usuario_del_miembro>/<titulo_del_articulo_en_formato_slug>/`
- Los artículos en estado borrador nunca deberán ser visibles en la web pública
- Los artículos cuya fecha de publicación sea futura nunca deberán ser visibles en la parte pública

### Ver comentarios que tiene un artículo

Como lector quiero poder ver los comentarios que tiene un artículo para así leer lo que opinan otros miembros de la plataforma sobre el mismo.

**Restricciones/Criterios de aceptación**

- Se deberán mostrar los artículos en orden cronológico, del más reciente al más antiguo
- No se deberán mostrar todos los comentarios de un artículo, sino que se deberán poder paginar

### Comentar un artículo

Como miembro de la plataforma quiero poder comentar artículos de otros miembros de la plataforma para intercambiar opiniones

**Restricciones/Criterios de aceptación**

- Sólo los miembros de la plataforma podrán comentar artículos de otros miembros de la plataforma

### Ver el número de comentarios que tiene un artículo

Como lector, quiero poder ver el número de comentarios que tiene un artículo tanto en los listados como en el detalle de los mismos para así poder navegar al listado de comentarios haciendo click

**Restricciones/Criterios de aceptación**

- En cada artículo se deberá mostrar el número de comentarios que tiene dicho artículo

### Responder a un artículo

Como miembro de la plataforma, quiero poder crear un artículo en respuesta a otro artículo pulsando algún botón en el detalle del artículo que deseo responder.

**Restricciones/Criterios de aceptación**

- Se deberá indicar en el detalle de un artículo que un artículo es respuesta a otro artículo.
- Sólo los usuarios miembros podrán ver la opción de responder al artículo

### Guardar un artículo como favorito

Como miembro de la plataforma deseo poder guardar artículos como favoritos para luego poder consultarlos desde la web app de administración.

**Restricciones/Criterios de aceptación**

- Sólo los usuarios miembros podrán guardar artículos como favoritos
- Se podrán guardar como favoritos tantos mis artículos como los artículos de otros miembros

### Compartir un artículo en redes sociales

Como usuario quiero poder compartir un artículo en redes sociales y así compartir con mis conexiones artículos que me resultan interesantes

**Restricciones/Criterios de aceptación**

- Se deberá poder compartir al menos en Twitter o Facebook

### Seguir a un miembro de la plataforma

Como miembro de la plataforma quiero poder seguir a otros miembros de la plataforma haciendo click en la información de autor en el detalle de un artículo para así recibir notificaciones de cuando estos miembros publican nuevos artículos.

**Restricciones/Criterios de aceptación**

- Sólo los miembros de la plataforma pueden seguir a otros miembros de la plataforma

### Dejar de seguir a un miembro de la plataforma

Como miembro de la plataforma quiero poder dejar seguir a miembros de la plataforma haciendo click en la información de autor en el detalle de un artículo para así dejar recibir notificaciones de cuando estos miembros publican nuevos artículos.

**Restricciones/Criterios de aceptación**

- Sólo se puede dejar de seguir a un miembro que ya sigues

### Subrayar contenido

Como miembro de la plataforma, quiero poder subrayar contenidos en el detalle de los artículos para así destacar contenidos de valor e importancia al resto de usuarios.

**Restricciones/Criterios de aceptación**

- Sólo los miembros de la plataforma pueden subrayar contenidos.
- Cuando un contenido se subraya, se deberá presentar subrayado al resto de usuarios.
- Si varios usuarios subrayan el mismo contenido, sólo deberá aparecer resaltado una vez.

### Eliminar contenido subrayado

Como miembro de la plataforma quiero poder eliminar un subrayado desde el detalle del artículo donde realicé el subrayado.

**Restricciones/Criterios de aceptación**

- Sólo podrá eliminar un subrayados el miembro que lo realizó

## 2. Webapp de administración

### Login de usuario

Como miembro de la plataforma quiero poder hacer login en la plataforma para acceder a la webapp de administración y así poder acceder a todas las funcionalidades de la misma.

**Restricciones/Criterios de aceptación**

- Sólo podrán autenticarse usuarios registrados (miembros de la plataforma)
- Para autenticarse deberán indicar su nombre de usuario y contraseña

### Logout de usuario

Como miembro de la plataforma quiero poder cerrar la sesión de mi plataforma para evitar que un usuario no autorizado pueda utilizar mi cuenta desde un ordenador sin mi autorización.

**Restricciones/Criterios de aceptación**

- Sólo se podrá cerrar la sesión si un usuario autenticado

### Ver listado de todos mis artículos

Como miembro, quiero poder acceder al listado de todos mis artículos en la web app de administración para poder editarlos o eliminarlos.

**Restricciones/Criterios de aceptación**

- Un miembro sólo podrá ver los artículos creados por él
- Será necesario estar autenticado para acceder al listado de artículos

### Crear un artículo

Como miembro de la plataforma quiero poder crear a través de un formulario fácil de usar donde pueda rellenar todos los campos que forman un artículo:

**Restricciones/Criterios de aceptación**

- Sólo los usuarios miembros podrán crear artículos
- Un artículo estará formado por:
  - Título
  - Vídeo o imagen destacada (si tuviera)
  - Texto a modo de introducción
  - Contenido
  - Fecha de publicación: permite programar la publicación de artículos a futuro
  - Estado: borrador o publicado
  - Categorías donde se publica
- Las categorías de publicación estarán inicialmente preestablecidas por el sistema. Es decir, el usuario no puede crear o eliminar categorías, debe seleccionar entre las existentes.
- Los artículos en estado borrador nunca deberán ser visibles en la web pública
- Los artículos cuya fecha de publicación sea futura nunca deberán ser visibles en la parte pública
- Cuando el miembro cree el artículo, deberá quedar automáticamente reflejado que él es el autor
- Es deseable que el editor de contenido sea WYSIWYG
- La imagen destacada deberá generar sus versiones responsive para que posteriormente puedan ser utilizadas en la web pública para optimizar la web para diferentes dispositivos.

### Editar un artículo

Como miembro de la plataforma quiero poder acceder a la edición de un artículo a través del listado de mis artículos de la web app de administración para poder así modificar el artículo a mi gusto.

**Restricciones/Criterios de aceptación**

- Esta historia de usuario tiene las mismas restricciones que la historia de usuario “Crear artículo”
- Sólo el miembro propietario del artículo podrá editar el artículo

### Borrar un artículo

Como miembro de la plataforma quiero poder eliminar un artículo a través de la web app de administración para poder así eliminar contenidos que no deseo mantener.

**Restricciones/Criterios de aceptación**

- Sólo el miembro propietario del artículo podrá eliminar el artículo
- Se deberá confirmar con el usuario la eliminación del artículo para evitar eliminaciones por error

### Mencionar a un miembro en un artículo

Como miembro de la plataforma, quiero poder realizar menciones a otros miembros de la plataforma poniendo su nombre de usuario precedido de una @ para que les llegue una notificación de que han sido nombrados en un artículo.

**Restricciones/Criterios de aceptación**

- El formato deberá ser `@<nombre_del_miembro_de_la_plataforma>` (el mismo que la URL)
- Cuando se menciona a un usuario, se deberá enviar una notificación de mención al usuario o usuarios mencionados

### Recibir una notificación de mención en un artículo

Como miembro de la plataforma quiero recibir notificaciones cuando alguien me mencione en un artículo para poder acceder al artículo donde me han mencionado y leer qué dicen sobre mi.

**Restricciones/Criterios de aceptación**

- Si el miembro está conectado (ya sea a la web pública o a la web app de administración), deberá mostrarse en tiempo real una notificación indicando que ha sido nombrado en un artículo. Al pulsar en la notificación, deberá abrirse el artículo donde ha sido mencionado.
- Sólo se deberá recibir la mención si el artículo es público.
- Si el miembro no está conectado, se deberá enviar un e-mail indicando que ha sido nombrado en un artículo. En este e-mail deberá existir un enlace que lleve al usuario al artículo.

### Recibir una notificación cuando un autor al que sigo publica un nuevo artículo

Como miembro de la plataforma quiero recibir notificaciones cuando un autor al que sigo publica un nuevo artículo para poder disfrutar de inmediato de los contenidos generados por uno de mis autores favoritos.

**Restricciones/Criterios de aceptación**

- Si el miembro está conectado (ya sea a la web pública o a la web app de administración), deberá mostrarse en tiempo real una notificación indicando que el autor X ha publicado el artículo Y. Al pulsar en la notificación, deberá mostrar al usuario el nuevo artículo.
- Sólo se deberá recibir la mención si el artículo es público.
- Si el miembro no está conectado, se deberá enviar un e-mail indicando que el autor X ha publicado el artículo Y. En este e-mail deberá existir un enlace que lleve al usuario al artículo.

### Ver artículos favoritos

Como miembro de la plataforma quiero poder acceder a mis artículos guardados como favoritos para volver a leerlos o eliminarlos como favoritos

**Restricciones/Criterios de aceptación**

- Un miembro de la plataforma sólo debe ver los artículos que él ha guardado como favoritos

### Eliminar un artículo como favorito

Como miembro de la plataforma quiero poder eliminar los artículos que he guardado como favoritos para quitar aquellos que ya no son mis favoritos

**Restricciones/Criterios de aceptación**

- Un miembro sólo podrá eliminar sus artículos guardados como favoritos

### Ver mis contenidos subrayados

Como miembro de la plataforma quiero poder ver mis contenidos subrayados desde la web app de administración para que, haciendo click en ellos me lleven al artículo donde se realizó el subrayado y así poder volver a leer el artículo o eliminar el subrayado.

**Restricciones/Criterios de aceptación**

- Un miembro sólo podrá ver el listado de contenidos que él ha subrayado (no los que han subrayado otros miembros).
