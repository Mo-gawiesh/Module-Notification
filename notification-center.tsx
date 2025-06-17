"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  Settings,
  Home,
  FileText,
  AlertTriangle,
  Info,
  Clock,
  Search,
  Download,
  Archive,
  Trash2,
  RefreshCw,
  Calendar,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
  Send,
  Plus,
  Edit,
  Upload,
  Eye,
  TrendingUp,
  Users,
  Activity,
  Star,
  Share,
  CalendarDays,
  Video,
  Paperclip,
  Smile,
  X,
  User,
  CreditCard,
} from "lucide-react"

// Interfaces
interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  time: string
  date: string
  category: string
  priority: "low" | "medium" | "high"
  isNew?: boolean
  isRead?: boolean
  department?: string
  actionRequired?: boolean
}

interface Document {
  id: string
  name: string
  type: string
  size: string
  modified: string
  author: string
  category: string
  status: "draft" | "approved" | "pending"
  starred?: boolean
}

interface ChatMessage {
  id: string
  sender: string
  message: string
  time: string
  avatar: string
  isOwn?: boolean
  type: "text" | "file" | "image"
}

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  type: "meeting" | "deadline" | "reminder"
  attendees?: string[]
  description?: string
}

export default function NotificationCenter() {
  // State management
  const [activeSection, setActiveSection] = useState("home")
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "отключение воды",
      message: "В связи с плановыми работами будет отключена горячая вода с 10 до 15 часов.",
      time: "23:54",
      date: "08.06.2025",
      category: "Утвержденные документы",
      priority: "high",
      department: "ЖКХ",
      actionRequired: false,
    },
    {
      id: "2",
      type: "warning",
      title: "собрание жильцов",
      message: "Важная информация от управляющей компании о предстоящих изменениях.",
      time: "23:54",
      date: "08.06.2025",
      category: "Новые уведомления",
      priority: "high",
      department: "Управление",
      actionRequired: true,
    },
  ])

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Отчет по ЖКХ за май 2025",
      type: "PDF",
      size: "2.4 MB",
      modified: "08.06.2025",
      author: "Иванов И.И.",
      category: "Отчеты",
      status: "approved",
      starred: true,
    },
    {
      id: "2",
      name: "Новые тарифы на коммунальные услуги",
      type: "DOCX",
      size: "1.2 MB",
      modified: "07.06.2025",
      author: "Петрова А.С.",
      category: "Документы",
      status: "pending",
    },
    {
      id: "3",
      name: "План ремонтных работ",
      type: "XLSX",
      size: "856 KB",
      modified: "06.06.2025",
      author: "Сидоров П.П.",
      category: "Планы",
      status: "draft",
    },
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Анна Петрова",
      message: "Добрый день! Когда планируется завершение ремонта в подъезде?",
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
    {
      id: "3",
      sender: "Иван Сидоров",
      message: "Отлично! Спасибо за информацию.",
      time: "14:40",
      avatar: "ИС",
    },
  ])

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Собрание жильцов",
      date: "2025-06-10",
      time: "18:00",
      type: "meeting",
      attendees: ["Иванов И.И.", "Петрова А.С."],
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
    {
      id: "3",
      title: "Техническое обслуживание",
      date: "2025-06-15",
      time: "09:00",
      type: "reminder",
      description: "Плановое ТО оборудования",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", description: "" })
  const [searchTerm, setSearchTerm] = useState("")
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [darkMode, setDarkMode] = useState(false)

  // Add new state for notification actions
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionForm, setActionForm] = useState({
    response: "",
    priority: "medium",
    assignTo: "",
    dueDate: "",
    notes: "",
  })

  // Auto-refresh notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? "warning" : "info",
        title: "автоматическое уведомление",
        message: "Новое уведомление получено автоматически.",
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toLocaleDateString("ru-RU"),
        category: "Автоматические",
        priority: "medium",
        department: "Система",
        isNew: true,
      }
      setNotifications((prev) => [newNotification, ...prev])
      setLastUpdate(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Helper functions
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
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
      type: "text",
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

  // Add after the existing helper functions, before the stats calculation:

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
    setShowActionModal(true)
    markAsRead(notification.id)
  }

  const handleAction = (actionType: string) => {
    if (!selectedNotification) return

    switch (actionType) {
      case "approve":
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === selectedNotification.id
              ? { ...n, type: "success", title: n.title + " (Одобрено)", actionRequired: false }
              : n,
          ),
        )
        break
      case "reject":
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === selectedNotification.id
              ? { ...n, type: "error", title: n.title + " (Отклонено)", actionRequired: false }
              : n,
          ),
        )
        break
      case "schedule":
        const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          title: selectedNotification.title,
          date: actionForm.dueDate || new Date().toISOString().split("T")[0],
          time: "09:00",
          type: "reminder",
          description: selectedNotification.message,
        }
        setCalendarEvents((prev) => [...prev, newEvent])
        break
      case "assign":
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === selectedNotification.id
              ? { ...n, message: n.message + ` (Назначено: ${actionForm.assignTo})` }
              : n,
          ),
        )
        break
      case "respond":
        const responseMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: "Гулиш Мохамед",
          message: `Ответ на "${selectedNotification.title}": ${actionForm.response}`,
          time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
          avatar: "ГМ",
          isOwn: true,
          type: "text",
        }
        setChatMessages((prev) => [...prev, responseMessage])
        break
    }

    setShowActionModal(false)
    setActionForm({ response: "", priority: "medium", assignTo: "", dueDate: "", notes: "" })
  }

  const getActionButtons = (notification: Notification) => {
    const buttons = []

    if (notification.actionRequired) {
      if (notification.department === "Управление") {
        buttons.push(
          { label: "Одобрить", action: "approve", variant: "default", icon: "CheckCircle" },
          { label: "Отклонить", action: "reject", variant: "destructive", icon: "XCircle" },
        )
      }

      if (notification.department === "ЖКХ" || notification.department === "Техслужба") {
        buttons.push(
          { label: "Запланировать", action: "schedule", variant: "outline", icon: "Calendar" },
          { label: "Назначить", action: "assign", variant: "outline", icon: "User" },
        )
      }

      if (notification.department === "Бухгалтерия") {
        buttons.push(
          { label: "Обработать", action: "approve", variant: "default", icon: "CreditCard" },
          { label: "Требует уточнения", action: "respond", variant: "outline", icon: "MessageSquare" },
        )
      }
    }

    buttons.push(
      { label: "Ответить", action: "respond", variant: "outline", icon: "MessageSquare" },
      { label: "Архивировать", action: "archive", variant: "ghost", icon: "Archive" },
    )

    return buttons
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isNew: false } : n)))
  }

  const stats = {
    notifications: notifications.length,
    unread: notifications.filter((n) => n.isNew).length,
    documents: documents.length,
    messages: chatMessages.length,
    events: calendarEvents.length,
  }

  // Render different sections
  const renderHome = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Уведомления</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {stats.notifications}
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-red-600 border-red-600">
                {stats.unread} новых
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Документы</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.documents}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Сообщения</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.messages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>События</p>
                <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{stats.events}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Последние уведомления</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-600">{notification.message.slice(0, 60)}...</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveSection("notifications")}>
              Показать все
            </Button>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Ближайшие события</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {calendarEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                <CalendarDays className="w-4 h-4 text-blue-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-gray-600">
                    {event.date} в {event.time}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveSection("calendar")}>
              Открыть календарь
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader>
          <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Активность системы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Время работы</p>
              <p className="text-lg font-semibold">2ч 34м</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Обработано</p>
              <p className="text-lg font-semibold">127 уведомлений</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Активных пользователей</p>
              <p className="text-lg font-semibold">23</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Управление документами</h2>
        <div className="flex space-x-2">
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Загрузить
          </Button>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Создать
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Поиск документов..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="reports">Отчеты</SelectItem>
            <SelectItem value="documents">Документы</SelectItem>
            <SelectItem value="plans">Планы</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="approved">Утверждено</SelectItem>
            <SelectItem value="pending">На рассмотрении</SelectItem>
            <SelectItem value="draft">Черновик</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className={`hover:shadow-md transition-shadow ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{doc.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{doc.type}</span>
                      <span>{doc.size}</span>
                      <span>Изменен: {doc.modified}</span>
                      <span>Автор: {doc.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(doc.status)}>
                    {doc.status === "approved"
                      ? "Утверждено"
                      : doc.status === "pending"
                        ? "На рассмотрении"
                        : "Черновик"}
                  </Badge>
                  {doc.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Центр уведомлений</h2>
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`hover:shadow-md transition-shadow ${notification.isNew ? "ring-2 ring-blue-200 bg-blue-50" : ""} ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {notification.date} {notification.title}
                    </span>
                    <div className="flex items-center space-x-2">
                      {notification.isNew && (
                        <Badge variant="default" className="text-xs bg-blue-500">
                          НОВОЕ
                        </Badge>
                      )}
                      <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {notification.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderChat = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Корпоративный чат</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-96">
        <Card className={`lg:col-span-1 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>Контакты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Avatar className="w-8 h-8 bg-blue-500">
                <AvatarFallback className="text-white text-sm">АП</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Анна Петрова</p>
                <p className="text-xs text-gray-500">Онлайн</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Avatar className="w-8 h-8 bg-green-500">
                <AvatarFallback className="text-white text-sm">ИС</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Иван Сидоров</p>
                <p className="text-xs text-gray-500">5 мин назад</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Avatar className="w-8 h-8 bg-purple-500">
                <AvatarFallback className="text-white text-sm">МК</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Мария Козлова</p>
                <p className="text-xs text-gray-500">Офлайн</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`lg:col-span-3 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8 bg-blue-500">
                  <AvatarFallback className="text-white text-sm">АП</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Анна Петрова</p>
                  <p className="text-xs text-gray-500">Онлайн</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-64">
            <div className="flex-1 overflow-y-auto space-y-3 p-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-2 max-w-xs ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <Avatar className="w-6 h-6 bg-blue-500">
                      <AvatarFallback className="text-white text-xs">{message.avatar}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`p-3 rounded-lg ${message.isOwn ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
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
            <div className="border-t p-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Введите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button onClick={sendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderCalendar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Календарь событий</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить событие
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`lg:col-span-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Июнь 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`text-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    day === 8 ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
          <CardHeader>
            <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Добавить событие</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Название</Label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Название события"
              />
            </div>
            <div>
              <Label>Дата</Label>
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Время</Label>
              <Input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Описание события"
              />
            </div>
            <Button onClick={addEvent} className="w-full">
              Добавить
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
        <CardHeader>
          <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Предстоящие события</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {calendarEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    event.type === "meeting" ? "bg-blue-500" : event.type === "deadline" ? "bg-red-500" : "bg-green-500"
                  }`}
                />
                <div>
                  <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{event.title}</p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {event.date} в {event.time}
                  </p>
                  {event.description && (
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>{event.description}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Настройки системы</h2>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Информация профиля</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20 bg-purple-500">
                  <AvatarFallback className="text-white font-semibold text-xl">ГМ</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Изменить фото</Button>
                  <Button variant="outline">Удалить фото</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Имя</Label>
                  <Input value="Гулиш" />
                </div>
                <div>
                  <Label>Фамилия</Label>
                  <Input value="Мохамед" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value="gulish.mohamed@company.com" />
                </div>
                <div>
                  <Label>Телефон</Label>
                  <Input value="+7 (999) 123-45-67" />
                </div>
                <div>
                  <Label>Должность</Label>
                  <Input value="Менеджер по работе с клиентами" />
                </div>
                <div>
                  <Label>Отдел</Label>
                  <Input value="Управление" />
                </div>
              </div>
              <Button>Сохранить изменения</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Настройки уведомлений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Автоматические уведомления</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Звуковые уведомления</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>Email уведомления</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS уведомления</Label>
                <Switch />
              </div>
              <div>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Системные настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Темная тема</Label>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <div>
                <Label>Язык интерфейса</Label>
                <Select defaultValue="ru">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="kz">Қазақша</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Часовой пояс</Label>
                <Select defaultValue="msk">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="msk">Москва (UTC+3)</SelectItem>
                    <SelectItem value="spb">Санкт-Петербург (UTC+3)</SelectItem>
                    <SelectItem value="nsk">Новосибирск (UTC+7)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Действия</Label>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт данных
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Archive className="w-4 h-4 mr-2" />
                    Архивировать старые данные
                  </Button>
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Сбросить настройки
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}>
            <CardHeader>
              <CardTitle className={darkMode ? "text-white" : "text-gray-900"}>Безопасность</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Текущий пароль</Label>
                <Input type="password" placeholder="Введите текущий пароль" />
              </div>
              <div>
                <Label>Новый пароль</Label>
                <Input type="password" placeholder="Введите новый пароль" />
              </div>
              <div>
                <Label>Подтверждение пароля</Label>
                <Input type="password" placeholder="Подтвердите новый пароль" />
              </div>
              <Button>Изменить пароль</Button>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Двухфакторная аутентификация</Label>
                  <Switch />
                </div>
                <p className="text-sm text-gray-500 mt-2">Включите для дополнительной защиты вашего аккаунта</p>
              </div>
              <div className="space-y-2">
                <Label>Активные сессии</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Windows Desktop</p>
                      <p className="text-xs text-gray-500">Текущая сессия • Москва</p>
                    </div>
                    <Badge variant="outline">Активна</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Chrome Browser</p>
                      <p className="text-xs text-gray-500">2 часа назад • Москва</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Завершить
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  // Add this new component after the renderSettings function:

  const renderActionModal = () => {
    if (!selectedNotification || !showActionModal) return null

    const actionButtons = getActionButtons(selectedNotification)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`w-full max-w-2xl mx-4 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-xl`}>
          <div className={`p-6 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getNotificationIcon(selectedNotification.type)}
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {selectedNotification.title}
                  </h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {selectedNotification.department} • {selectedNotification.date} {selectedNotification.time}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowActionModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Описание</h4>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {selectedNotification.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Приоритет:</span>
                <Badge className={`ml-2 ${getPriorityColor(selectedNotification.priority)}`}>
                  {selectedNotification.priority === "high"
                    ? "Высокий"
                    : selectedNotification.priority === "medium"
                      ? "Средний"
                      : "Низкий"}
                </Badge>
              </div>
              <div>
                <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Категория:</span>
                <span className={`ml-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {selectedNotification.category}
                </span>
              </div>
            </div>

            {selectedNotification.actionRequired && (
              <div
                className={`p-4 rounded-lg ${darkMode ? "bg-yellow-900/20 border-yellow-700" : "bg-yellow-50 border-yellow-200"} border`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className={`font-medium ${darkMode ? "text-yellow-400" : "text-yellow-800"}`}>
                    Требует действий
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                  Это уведомление требует вашего внимания и действий для решения.
                </p>
              </div>
            )}

            <Tabs defaultValue="actions" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="actions">Действия</TabsTrigger>
                <TabsTrigger value="details">Детали</TabsTrigger>
              </TabsList>

              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {actionButtons.map((button, index) => (
                    <Button
                      key={index}
                      variant={button.variant as any}
                      onClick={() => handleAction(button.action)}
                      className="flex items-center space-x-2"
                    >
                      {button.icon === "CheckCircle" && <CheckCircle className="w-4 h-4" />}
                      {button.icon === "XCircle" && <XCircle className="w-4 h-4" />}
                      {button.icon === "Calendar" && <Calendar className="w-4 h-4" />}
                      {button.icon === "User" && <User className="w-4 h-4" />}
                      {button.icon === "MessageSquare" && <MessageSquare className="w-4 h-4" />}
                      {button.icon === "Archive" && <Archive className="w-4 h-4" />}
                      {button.icon === "CreditCard" && <CreditCard className="w-4 h-4" />}
                      <span>{button.label}</span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Ответ или комментарий
                    </Label>
                    <Textarea
                      placeholder="Введите ваш ответ или комментарий..."
                      value={actionForm.response}
                      onChange={(e) => setActionForm({ ...actionForm, response: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Назначить
                      </Label>
                      <Select
                        value={actionForm.assignTo}
                        onValueChange={(value) => setActionForm({ ...actionForm, assignTo: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Выберите сотрудника" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ivanov">Иванов И.И.</SelectItem>
                          <SelectItem value="petrov">Петров П.П.</SelectItem>
                          <SelectItem value="sidorov">Сидоров С.С.</SelectItem>
                          <SelectItem value="kozlov">Козлов К.К.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Срок выполнения
                      </Label>
                      <Input
                        type="date"
                        value={actionForm.dueDate}
                        onChange={(e) => setActionForm({ ...actionForm, dueDate: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      ID уведомления:
                    </span>
                    <span className={`font-mono text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {selectedNotification.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Создано:</span>
                    <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      {selectedNotification.date} в {selectedNotification.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Отдел:</span>
                    <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      {selectedNotification.department}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Статус:</span>
                    <Badge variant={selectedNotification.isNew ? "default" : "secondary"}>
                      {selectedNotification.isNew ? "Новое" : "Прочитано"}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h5 className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>История действий</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                        Уведомление создано - {selectedNotification.date} {selectedNotification.time}
                      </span>
                    </div>
                    {!selectedNotification.isNew && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                          Прочитано - {new Date().toLocaleDateString("ru-RU")}{" "}
                          {new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div
            className={`p-6 border-t ${darkMode ? "border-gray-700" : "border-gray-200"} flex justify-end space-x-3`}
          >
            <Button variant="outline" onClick={() => setShowActionModal(false)}>
              Закрыть
            </Button>
            <Button onClick={() => handleAction("respond")}>Выполнить действие</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-gray-100"}`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`w-16 ${darkMode ? "bg-gray-800" : "bg-teal-600"} flex flex-col items-center py-4 space-y-4`}>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 text-white hover:bg-teal-700 ${activeSection === "home" ? "bg-white/20" : ""}`}
            onClick={() => setActiveSection("home")}
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 text-white hover:bg-teal-700 ${activeSection === "documents" ? "bg-white/20" : ""}`}
            onClick={() => setActiveSection("documents")}
          >
            <FileText className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 text-white hover:bg-teal-700 ${activeSection === "notifications" ? "bg-white/20" : ""}`}
            onClick={() => setActiveSection("notifications")}
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 text-white hover:bg-teal-700 ${activeSection === "chat" ? "bg-white/20" : ""}`}
            onClick={() => setActiveSection("chat")}
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 text-white hover:bg-teal-700 ${activeSection === "calendar" ? "bg-white/20" : ""}`}
            onClick={() => setActiveSection("calendar")}
          >
            <Calendar className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 text-white hover:bg-teal-700 ${activeSection === "settings" ? "bg-white/20" : ""}`}
            onClick={() => setActiveSection("settings")}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b px-6 py-4 flex items-center justify-between`}
          >
            <div className="flex items-center space-x-4">
              <Avatar className="w-10 h-10 bg-purple-500">
                <AvatarFallback className="text-white font-semibold">ГМ</AvatarFallback>
              </Avatar>
              <div>
                <h1 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Гулиш Мохамед</h1>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>ID: EMP001</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Clock className="w-3 h-3 mr-1" />
                Обновлено: {lastUpdate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              </Badge>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                {activeSection === "home"
                  ? "Главная"
                  : activeSection === "documents"
                    ? "Документы"
                    : activeSection === "notifications"
                      ? "Уведомления"
                      : activeSection === "chat"
                        ? "Чат"
                        : activeSection === "calendar"
                          ? "Календарь"
                          : "Настройки"}
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div
            className={`${darkMode ? "bg-gray-700 border-gray-600" : "bg-blue-50 border-blue-200"} border-b px-6 py-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                    Система активна • Автообновление каждые 30 сек
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Для сотрудников
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Уведомлений: {stats.notifications}</span>
                <span className="text-red-600">Новых: {stats.unread}</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {activeSection === "home" && renderHome()}
              {activeSection === "documents" && renderDocuments()}
              {activeSection === "notifications" && renderNotifications()}
              {activeSection === "chat" && renderChat()}
              {activeSection === "calendar" && renderCalendar()}
              {activeSection === "settings" && renderSettings()}
            </div>
          </div>
        </div>
      </div>
      {renderActionModal()}
    </div>
  )
}
