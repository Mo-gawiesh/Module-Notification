"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Bell,
  Settings,
  Home,
  FileText,
  AlertTriangle,
  Info,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  Minimize2,
  Pin,
  PinOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Plus,
  Send,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Search,
  CalendarDays,
  Archive,
} from "lucide-react"

interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  time: string
  date: string
  department?: string
  priority: "low" | "medium" | "high"
  isNew?: boolean
  actionRequired?: boolean
}

interface Document {
  id: string
  name: string
  type: string
  size: string
  modified: string
  status: "draft" | "approved" | "pending"
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  time: string
  avatar: string
  isOwn?: boolean
}

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  type: "meeting" | "deadline" | "reminder"
  description?: string
}

export default function DesktopWidget() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [newMessage, setNewMessage] = useState("")
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", description: "" })
  const [searchTerm, setSearchTerm] = useState("")

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Отключение воды",
      message: "В связи с плановыми работами будет отключена горячая вода с 10:00 до 15:00",
      time: "23:54",
      date: "08.06.2025",
      department: "ЖКХ",
      priority: "high",
      isNew: true,
      actionRequired: true,
    },
    {
      id: "2",
      type: "info",
      title: "Собрание жильцов",
      message: "Обсуждение новых тарифов на коммунальные услуги",
      time: "23:50",
      date: "08.06.2025",
      department: "Управление",
      priority: "medium",
      isNew: true,
      actionRequired: true,
    },
    {
      id: "3",
      type: "success",
      title: "Платеж получен",
      message: "Ваш платеж за коммунальные услуги успешно обработан",
      time: "22:30",
      date: "08.06.2025",
      department: "Бухгалтерия",
      priority: "low",
      isNew: false,
    },
    {
      id: "4",
      type: "error",
      title: "Техническая неисправность",
      message: "Обнаружена неисправность в системе отопления",
      time: "21:15",
      date: "08.06.2025",
      department: "Техслужба",
      priority: "high",
      isNew: true,
    },
    {
      id: "5",
      type: "info",
      title: "Новый документ",
      message: "Добавлен новый регламент по обслуживанию",
      time: "20:45",
      date: "08.06.2025",
      department: "Управление",
      priority: "medium",
      isNew: true,
    },
  ])

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Отчет по ЖКХ за май 2025.pdf",
      type: "PDF",
      size: "2.4 MB",
      modified: "08.06.2025",
      status: "approved",
    },
    {
      id: "2",
      name: "Новые тарифы.docx",
      type: "DOCX",
      size: "1.2 MB",
      modified: "07.06.2025",
      status: "pending",
    },
    {
      id: "3",
      name: "План ремонтных работ.xlsx",
      type: "XLSX",
      size: "856 KB",
      modified: "06.06.2025",
      status: "draft",
    },
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Анна Петрова",
      message: "Добрый день! Когда планируется завершение ремонта?",
      time: "14:30",
      avatar: "АП",
    },
    {
      id: "2",
      sender: "Гулиш Мохамед",
      message: "Здравствуйте! Ремонт планируется завершить до конца недели.",
      time: "14:35",
      avatar: "ГМ",
      isOwn: true,
    },
  ])

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Собрание жильцов",
      date: "2025-06-10",
      time: "18:00",
      type: "meeting",
      description: "Обсуждение новых тарифов",
    },
    {
      id: "2",
      title: "Подача отчета",
      date: "2025-06-12",
      time: "12:00",
      type: "deadline",
      description: "Срок подачи месячного отчета",
    },
  ])

  // Auto-refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? "warning" : Math.random() > 0.5 ? "info" : "success",
        title: "Автоматическое уведомление",
        message: "Новое уведомление получено автоматически для сотрудника",
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toLocaleDateString("ru-RU"),
        department: "Система",
        priority: "medium",
        isNew: true,
      }
      setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]) // Keep only 20 notifications
      setLastUpdate(new Date())

      if (soundEnabled) {
        console.log("🔔 Новое уведомление!")
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [soundEnabled])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "ЖКХ":
        return "🏠"
      case "Бухгалтерия":
        return "💰"
      case "Управление":
        return "📋"
      case "Техслужба":
        return "🔧"
      default:
        return "📢"
    }
  }

  const handleQuickAction = (notificationId: string, action: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === notificationId) {
          switch (action) {
            case "approve":
              return { ...n, type: "success", actionRequired: false, isNew: false }
            case "dismiss":
              return { ...n, isNew: false }
            case "archive":
              return { ...n, isNew: false, actionRequired: false }
            default:
              return n
          }
        }
        return n
      }),
    )
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: "Гулиш Мохамед",
      message: newMessage,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      avatar: "ГМ",
      isOwn: true,
    }
    setChatMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time || "09:00",
      type: "meeting",
      description: newEvent.description,
    }
    setCalendarEvents((prev) => [...prev, event])
    setNewEvent({ title: "", date: "", time: "", description: "" })
  }

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => n.isNew).length,
    actionRequired: notifications.filter((n) => n.actionRequired).length,
    documents: documents.length,
    messages: chatMessages.length,
    events: calendarEvents.length,
  }

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg relative"
        >
          <Bell className="w-7 h-7 text-white" />
          {stats.unread > 0 && (
            <Badge className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {stats.unread > 99 ? "99+" : stats.unread}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 h-[600px] bg-white shadow-2xl border-0 overflow-hidden">
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 bg-white/20">
                <AvatarFallback className="text-white text-sm font-semibold">ГМ</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-base font-semibold">Центр уведомлений</h3>
                <p className="text-xs text-teal-100">
                  {stats.unread} новых • {stats.actionRequired} требуют действий
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-white hover:bg-white/20"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsPinned(!isPinned)}
              >
                {isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Navigation Tabs */}
        <div className="flex border-b bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 h-10 text-xs ${activeSection === "dashboard" ? "bg-white border-b-2 border-teal-500" : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <Home className="w-4 h-4 mr-1" />
            Главная
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 h-10 text-xs ${activeSection === "notifications" ? "bg-white border-b-2 border-teal-500" : ""}`}
            onClick={() => setActiveSection("notifications")}
          >
            <Bell className="w-4 h-4 mr-1" />
            Уведомления
          </Button>
        </div>

        {/* Content */}
        <CardContent className="p-0 h-[480px]">
          {activeSection === "dashboard" && (
            <div className="p-4 space-y-4">
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="text-center">
                    <Bell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                    <p className="text-sm text-blue-700">Всего</p>
                  </div>
                </Card>
                <Card className="p-4 bg-red-50 border-red-200">
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-900">{stats.unread}</p>
                    <p className="text-sm text-red-700">Новых</p>
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Быстрые действия</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 text-xs justify-start"
                    onClick={() => setActiveSection("documents")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Документы
                    <Badge variant="secondary" className="ml-auto">
                      {stats.documents}
                    </Badge>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 text-xs justify-start"
                    onClick={() => setActiveSection("chat")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Чат
                    <Badge variant="secondary" className="ml-auto">
                      {stats.messages}
                    </Badge>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 text-xs justify-start"
                    onClick={() => setActiveSection("calendar")}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Календарь
                    <Badge variant="secondary" className="ml-auto">
                      {stats.events}
                    </Badge>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 text-xs justify-start"
                    onClick={() => setActiveSection("settings")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Настройки
                  </Button>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Последние уведомления</h4>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                          notification.isNew ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                        }`}
                        onClick={() => handleQuickAction(notification.id, "dismiss")}
                      >
                        <div className="flex items-start space-x-2">
                          <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {getDepartmentIcon(notification.department)} {notification.title}
                              </span>
                              <div className="flex items-center space-x-1">
                                {notification.isNew && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{notification.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setActiveSection("notifications")}
                >
                  Показать все уведомления
                </Button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск уведомлений..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Notifications List */}
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                        notification.isNew ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => handleQuickAction(notification.id, "dismiss")}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {getDepartmentIcon(notification.department)} {notification.title}
                            </span>
                            <div className="flex items-center space-x-1">
                              {notification.isNew && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">{notification.message}</p>
                          {notification.actionRequired && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleQuickAction(notification.id, "approve")
                                }}
                              >
                                ✓ Одобрить
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleQuickAction(notification.id, "archive")
                                }}
                              >
                                📦 Архив
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredNotifications.length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Уведомления не найдены</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {activeSection === "documents" && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Документы</h3>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-1" />
                  Загрузить
                </Button>
              </div>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.type} • {doc.size} • {doc.modified}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge
                            className={
                              doc.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : doc.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {doc.status === "approved"
                              ? "Утверждено"
                              : doc.status === "pending"
                                ? "На рассмотрении"
                                : "Черновик"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {activeSection === "chat" && (
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Чат</h3>
              <ScrollArea className="h-64 border rounded-lg p-3">
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex items-start space-x-2 max-w-xs ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        <Avatar className="w-6 h-6 bg-blue-500">
                          <AvatarFallback className="text-white text-xs">{message.avatar}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`p-2 rounded-lg ${message.isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex space-x-2">
                <Input
                  placeholder="Введите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {activeSection === "calendar" && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Календарь</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить
                </Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Название события"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="flex-1"
                  />
                  <Button onClick={addEvent}>Добавить</Button>
                </div>
              </div>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {calendarEvents.map((event) => (
                    <Card key={event.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CalendarDays className="w-6 h-6 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-gray-500">
                              {event.date} в {event.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">Настройки</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Звуковые уведомления</Label>
                  <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Закрепить виджет</Label>
                  <Switch checked={isPinned} onCheckedChange={setIsPinned} />
                </div>
                <div className="space-y-2">
                  <Label>Интервал обновления</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 секунд</SelectItem>
                      <SelectItem value="30">30 секунд</SelectItem>
                      <SelectItem value="60">1 минута</SelectItem>
                      <SelectItem value="300">5 минут</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Действия</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Archive className="w-4 h-4 mr-2" />
                      Архивировать старые уведомления
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Экспорт данных
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Сбросить настройки
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Последнее обновление: {lastUpdate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setLastUpdate(new Date())}>
              <RefreshCw className="w-3 h-3 mr-1" />
              Обновить
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
