export default function DeepLearningPage() {
  return (
    <div className="p-10 dark:text-white">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-600 rounded-full animate-pulse" />
        <h1 className="text-4xl font-bold">Deep Learning & Neural Networks</h1>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="h-40 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">Computer Vision</div>
        <div className="h-40 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">Natural Language Processing</div>
      </div>
    </div>
  )
}