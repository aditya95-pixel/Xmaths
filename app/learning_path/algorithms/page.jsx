export default function AlgorithmsPage() {
  return (
    <div className="p-10 dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Algorithm Design</h1>
      <p className="mb-6 text-gray-400">Learn how to solve complex problems efficiently.</p>
      <div className="space-y-4">
        <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex justify-between items-center">
          <span>Sorting & Searching</span>
          <button className="bg-purple-600 px-4 py-2 rounded-lg text-sm">Start Lab</button>
        </div>
        <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex justify-between items-center">
          <span>Dynamic Programming</span>
          <button className="bg-purple-600 px-4 py-2 rounded-lg text-sm">Start Lab</button>
        </div>
      </div>
    </div>
  )
}