import { CoordinateForm } from './components/CoordinateForm'
import { CoordinateList } from './components/CoordinateList'
import { useCoordinates } from './hooks/useCoordinates'

function App() {
  const { coordinates, add, remove } = useCoordinates()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl">Sky Closet</h1>
        <p className="mt-1 text-sm">星を紡ぐコーデ帳</p>
      </header>

      <main className="grid gap-12 lg:grid-cols-[400px_1fr]">
        <section className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="mb-3 text-lg">コーデを登録する</h2>
          <CoordinateForm onSubmit={add} />
        </section>

        <section>
          <h2 className="mb-3 text-lg">
            保存したコーデ（{coordinates.length}）
          </h2>
          <CoordinateList coordinates={coordinates} onDelete={remove} />
        </section>
      </main>
    </div>
  )
}

export default App
