import koosenImg from '../assets/usedForWeb/koosen.jpg'

function Home({ onGoToMain, onGoToLogin }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative bg-charcoal-blue-950"
      style={{ backgroundImage: `url(${koosenImg})` }}
    >
      {/* Dark overlay – palette dark */}
      <div className="absolute inset-0 bg-charcoal-blue-950/80" aria-hidden="true" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-frosted-blue-50 drop-shadow-lg">
          Koosen Club
        </h1>
        <p className="text-lg md:text-xl mb-8 text-charcoal-blue-100 leading-relaxed">
          Коосэн клубын вэб сайтад тавтай морилно уу. Энд та клубуудын мэдээлэл хайж, нэгдэж, шинэ клуб үүсгэх боломжтой.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={onGoToMain}
            className="px-8 py-3 rounded-xl font-semibold bg-light-cyan-600/90 hover:bg-light-cyan-500/90 text-light-cyan-50 transition-colors shadow-sm"
          >
            Клуб хайх
          </button>
          <button
            type="button"
            onClick={onGoToLogin}
            className="px-8 py-3 rounded-xl font-semibold border-2 border-light-cyan-400/80 text-light-cyan-100 hover:bg-light-cyan-900/40 transition-colors"
          >
            Нэвтрэх
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
