import AsbestosReportForm from "./components/AsbestosReportForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-100 font-sans dark:bg-zinc-900">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <AsbestosReportForm />
      </main>
    </div>
  );
}
