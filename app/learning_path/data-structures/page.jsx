export default function DataStructuresPage() {
  return (
    <div className="p-10 dark:text-white">
      <h1 className="text-4xl font-bold mb-4">Fundamentals of Data Structures</h1>
      <div className="grid gap-4">
        {['Arrays & Lists', 'Stacks & Queues', 'Trees & Graphs', 'Hash Tables'].map((item) => (
          <div key={item} className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}