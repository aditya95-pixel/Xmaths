export default function MathematicsPage() {
  return (
    <div className="p-10 dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Mathematics for AI</h1>
      <div className="grid gap-6">
        <section className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">Linear Algebra</h2>
          <p className="text-gray-400">Mastering matrices, vectors, and eigenvalues.</p>
        </section>
        <section className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <h2 className="text-xl font-semibold mb-2">Calculus</h2>
          <p className="text-gray-400">Understanding gradients and partial derivatives for optimization.</p>
        </section>
      </div>
    </div>
  )
}