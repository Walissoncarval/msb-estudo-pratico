import TelaUploadMSB from '@/components/TelaUploadMSB';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <TelaUploadMSB />
      </div>
    </main>
  );
}