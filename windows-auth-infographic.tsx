"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react"
import { useState } from "react"
import NotificationCenter from "./notification-center"

export default function Component() {
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)

  if (showNotificationCenter) {
    return <NotificationCenter />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Аутентификация Windows</h1>
          <p className="text-lg text-gray-600">Современный дизайн интерфейса входа и регистрации</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Login Screen */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-blue-700 mb-2">Экран Входа</h2>
              <p className="text-gray-600">Интерфейс аутентификации пользователя</p>
            </div>

            <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white">
              <CardHeader className="space-y-1 pb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center font-light">Добро пожаловать</CardTitle>
                <p className="text-center text-blue-100 text-sm">Войдите в свою учетную запись</p>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-700 font-medium">
                      Электронная почта
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Введите вашу почту"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-700 font-medium">
                      Пароль
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Введите ваш пароль"
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Eye className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-id" className="text-gray-700 font-medium">
                      ID Сотрудника
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="employee-id"
                        type="text"
                        placeholder="Введите ID сотрудника"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded border-gray-300" />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Запомнить меня
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Забыли пароль?
                  </a>
                </div>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium"
                  onClick={() => setShowNotificationCenter(true)}
                >
                  Войти
                </Button>

                <div className="text-center">
                  <span className="text-gray-600 text-sm">{"Нет учетной записи? "}</span>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Создать аккаунт
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Screen */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-blue-700 mb-2">Экран Регистрации</h2>
              <p className="text-gray-600">Создание новой учетной записи</p>
            </div>

            <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white">
              <CardHeader className="space-y-1 pb-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center font-light">Создать Аккаунт</CardTitle>
                <p className="text-center text-gray-300 text-sm">Присоединяйтесь к нам сегодня</p>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-gray-700 font-medium">
                      Имя пользователя
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Выберите имя пользователя"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-700 font-medium">
                      Электронная почта
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Введите вашу почту"
                        className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-700 font-medium">
                      Пароль
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Создайте пароль"
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <EyeOff className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
                      Подтверждение пароля
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Подтвердите ваш пароль"
                        className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <EyeOff className="absolute right-3 top-3 h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="terms" className="rounded border-gray-300 mt-1" />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    Я согласен с{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Условиями использования
                    </a>{" "}
                    и{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Политикой конфиденциальности
                    </a>
                  </Label>
                </div>

                <Button className="w-full h-12 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-medium">
                  Создать Аккаунт
                </Button>

                <div className="text-center">
                  <span className="text-gray-600 text-sm">Уже есть аккаунт? </span>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Войти
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Design Features */}
        <div className="mt-16">
          <Separator className="mb-8" />
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Особенности Дизайна</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Удобный Интерфейс</h4>
              <p className="text-gray-600 text-sm">Чистый и интуитивно понятный дизайн с четкой визуальной иерархией</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-gray-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Ориентация на Безопасность</h4>
              <p className="text-gray-600 text-sm">Переключатель видимости пароля и защищенные поля ввода</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Профессиональный Стиль</h4>
              <p className="text-gray-600 text-sm">Современные градиентные заголовки с единой цветовой схемой</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
