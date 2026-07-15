import { supabase } from '@/lib/supabase'

export default async function TestSupabasePage() {
  const { data, error } = await supabase.from('test_table').select('*').limit(1);

  return (
    <main className="p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Test Koneksi Supabase</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-500 p-4 rounded-xl">
          <p className="font-bold">Error: {error.message}</p>
          <br/>
          <p className="text-sm">
            (Jika errornya "relation does not exist", artinya koneksi Anda ke Supabase <strong>BERHASIL!</strong> Database sudah merespon, hanya saja tabel 'test_table' belum Anda buat di dashboard).
          </p>
        </div>
      )}

      {data && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 p-4 rounded-xl">
          Koneksi Berhasil & Tabel Ditemukan! Data: {JSON.stringify(data)}
        </div>
      )}
    </main>
  );
}
