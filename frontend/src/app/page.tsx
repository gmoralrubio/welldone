export default async function Home() {
  const response = await fetch('http://localhost:3001/api/hello');
  const data = await response.json();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Welldone</h1>
      <p>Proyecto final KC web 20</p>
      <p>{data.title}</p>
      <p>{data.content}</p>
    </div>
  );
}
