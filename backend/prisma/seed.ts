import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { username: 'John' },
    update: {},
    create: {
      email: 'john@example.com',
      password: 'seed-password',
      name: 'John',
      surname: 'Doe',
      username: 'jdoe',
    },
  });

  await prisma.article.upsert({
    where: {
      authorId_slug: {
        authorId: user.id,
        slug: 'el-renacimiento-de-la-arquitectura-de-software-patrones',
      },
    },
    update: {},
    create: {
      title:
        'El renacimiento de la arquitectura de software: patrones limpios y simplicidad radical',
      intro:
        'Frente a la fatiga del sobre-diseño y las arquitecturas infladas, redescubrimos cómo la pureza de dominio, la simetría modular y la mesura técnica devuelven el alma a los sistemas contemporáneos.',
      content:
        'Afew weeks ago, I noticed I’d developed a very specific talent. I could unlock my phone to check the weather and somehow end up watching someone reorganize their pantry, review airport bathrooms, or explain why waking up at 4:37 a.m. was apparently the secret to success.  At first, it was an innocent twenty-minute session, then forty, and then 3 hours! The worst part wasn’t that I was wasting time. It was that I wasn’t even enjoying it anymore. I had a headache after that, but I couldn’t seem to stop doing it!  As someone who genuinely loves the internet, that realization surprised me. I love discovering interesting things. I love reading random facts. I can happily lose an hour researching why octopuses have three hearts or how ancient libraries organized their books.  Somewhere along the way, though, the internet became… three apps.  Even books weren’t a complete cure. I’d finish a chapter, feel wonderfully relaxed, and then immediately reach for my phone “just for a minute.” You already know how that story ends.  So instead of trying to use the internet less, I tried using it differently.  Over the past few months, I’ve been bookmarking websites that made me feel curious instead of exhausted, places that made me learn something, laugh at something, or simply reminded me that the web is still full of delightful surprises. And I am sharing all that with you!  Radio Garden The first time I opened Radio Garden, I genuinely planned to stay for five minutes.  An hour later, I had listened to jazz from New Orleans, a tiny radio station in Iceland, and a morning talk show somewhere in Japan that I couldn’t understand but somehow still enjoyed.  The idea is beautifully simple. You spin a digital globe, click almost anywhere, and instantly hear live radio from that part of the world.  It’s oddly comforting.  Sometimes I leave it playing quietly while making coffee, and for a few minutes, my kitchen feels connected to somewhere thousands of miles away.  Window Swap If social media shows everyone’s carefully edited lives, Window Swap shows something much nicer. It shows the reality of people from around the world who submit videos from their windows. Exciting, right?  There are some overlooking busy streets. Others face forests, beaches, rainy rooftops, or sleepy neighborhoods. I don’t know why watching someone else’s rainy Tuesday is so relaxing.  Maybe because in this chaotic age of consumerism, there is a website that’s not trying to sell me anything. It’s just… a window, and somehow, that’s enough.  Earth.fm Whenever my brain feels like it has forty browser tabs open, I visit Earth.fm. It’s a collection of sound recordings from forests, rivers, beaches, mountains, and national parks around the world.  There’re no motivational speeches or productivity hacks. Just birds, wind, rain.  I often play it while reading, and it genuinely helps me settle into a book instead of reaching for my phone every ten minutes.  Internet Archive Calling Internet Archive a website feels unfair. It’s more like an enormous digital museum.  You can borrow books, browse old magazines, watch vintage films, listen to music, or even explore archived versions of websites that disappeared years ago.  Every time I visit, I end up discovering something I wasn’t looking for. It’s the kind of rabbit hole that leaves you feeling smarter instead of strangely guilty.  Atlas Obscura Most travel websites tell you where everyone goes. Atlas Obscura tells you where almost nobody does.  It has secret tunnels, tiny museums, abandoned castles, and libraries hidden inside old monasteries.  Even if you aren’t planning a trip, it’s impossible not to get lost reading about the wonderfully strange places that exist around the world.  Btw, if you’re reading it today, the place of today is Sedlec Ossuary Bone Church, which is decorated with 40,000 human skeletons, creepy right? and may be…worth seeing too?',
      slug: 'el-renacimiento-de-la-arquitectura-de-software-patrones',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-15T10:00:00.000Z'),
      authorId: user.id,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
