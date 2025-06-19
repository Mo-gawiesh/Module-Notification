import DesktopWidget from "../desktop-widget"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Desktop Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Desktop Content */}
      <div className="relative z-10 p-8">
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl font-bold mb-2"><br></h1>
          <p className="text-blue-200"><br></p>
        </div>

        {/* Simulated Desktop Icons */}
        <div className="grid grid-cols-8 gap-4 max-w-2xl">
          {[
            { name: "Документы", icon: "📄" },
            { name: "Браузер", icon: "🌐" },
            { name: "Почта", icon: "📧" },
            { name: "Календарь", icon: "📅" },
            { name: "Настройки", icon: "⚙️" },
            { name: "Файлы", icon: "📁" },
            { name: "Калькулятор", icon: "🧮" },
            { name: "Заметки", icon: "📝" },
          ].map((app, index) => (
            <div key={index} className="text-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
              <div className="text-3xl mb-1">{app.icon}</div>
              <p className="text-xs text-white">{app.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Widget */}
      <DesktopWidget />
    </div>
  )
}
