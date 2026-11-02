import { CoordinateForm } from './components/CoordinateForm'
import { CoordinateList } from './components/CoordinateList'
import { SectionTitle } from './components/SectionTitle'
import { useCoordinates } from './hooks/useCoordinates'

function App() {
  const { coordinates, add, remove } = useCoordinates()

  return (
    <div className="min-h-screen">
      <header className="bg-linear-to-b from-hero-from to-hero-to px-4 pt-16 pb-12 text-center">
        <p className="font-display text-xs tracking-[0.4em] text-accent uppercase">
          SKY CHILDREN OF THE LIGHT
        </p>
        <h1 className="display-heading mt-3 text-5xl text-ink">
          Sky Closet
        </h1>
        <div className="mx-auto mt-4 h-px w-12 bg-accent" />
        <p className="mt-4 text-sm tracking-[0.3em] text-ink/80">
          星を紡ぐコーデ帳
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-4 py-12 lg:grid-cols-[400px_1fr]">
        <section className="lg:sticky lg:top-6 lg:self-start">
          <SectionTitle no="01" en="New Coordinate" ja="コーデを登録する" />
          <CoordinateForm onSubmit={add} />
        </section>

        <section>
          <SectionTitle
            no="02"
            en="Collection"
            ja="保存したコーデ"
            aside={
              <span className="display-heading text-lg text-ink/60">
                {coordinates.length}
                <span className="ml-1 text-xs">looks</span>
              </span>
            }
          />
          <CoordinateList coordinates={coordinates} onDelete={remove} />
        </section>
      </main>

      <footer className="bg-linear-to-b from-footer-from to-footer-to py-10 text-center text-footer-ink">
        <p className="display-heading text-sm tracking-[0.3em] uppercase opacity-80">
          Sky Closet
        </p>
        <p className="mt-2 text-[10px] tracking-wider opacity-60">
          非公式のファンメイドアプリです。ゲーム内の画像の著作権は thatgamecompany に帰属します。
        </p>
      </footer>
    </div>
  )
}

export default App
