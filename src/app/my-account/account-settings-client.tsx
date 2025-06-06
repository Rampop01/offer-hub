"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/account-settings/header";
import { Sidebar } from "@/components/account-settings/sidebar";
import { UserInfo } from "@/components/account-settings/user-info";
import { WalletSettings } from "@/components/account-settings/wallet-settings";
import { SecuritySettings } from "@/components/account-settings/security-settings";
import { NotificationSettings } from "@/components/account-settings/notification-settings";
import { ServiceSettings } from "@/components/account-settings/service-settings";
import { ConversionRates, Service } from "@/components/account-settings/types";



const fallbackConversionRates: ConversionRates = {
    XLM: { USD: 0.12, EUR: 0.11 },
    USD: { XLM: 8.33, EUR: 0.92 },
    EUR: { XLM: 9.09, USD: 1.09 }
}

export default function AccountSettings() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isUserActive, setIsUserActive] = useState(true)
    const [walletAddress, setWalletAddress] = useState("")
    const [walletPlaceholder, setWalletPlaceholder] = useState("0x1234...x30d")
    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [jobAlert, setJobAlert] = useState(true)
    const [paymentAlert, setPaymentAlert] = useState(true)
    const [messagesAlert, setMessagesAlert] = useState(true)
    const [securityAlert, setSecurityAlert] = useState(true)
    const [services, setServices] = useState<Service[]>([
        { id: 1, name: "Logo Design", price: "2.617", currency: "XLM" },
        { id: 2, name: "3D Design", price: "0.56", currency: "XLM" },
    ])
    const [newServiceName, setNewServiceName] = useState("")
    const [newServicePrice, setNewServicePrice] = useState("")
    const [newServiceCurrency, setNewServiceCurrency] = useState("XLM")
    const [conversionRates, setConversionRates] = useState<ConversionRates>(fallbackConversionRates)
    const [apiError, setApiError] = useState<string | null>(null)

    // Fetch conversion rates from CoinGecko API
    useEffect(() => {
        const fetchConversionRates = async () => {
            try {
                const response = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd,eur"
                )
                if (!response.ok) throw new Error("Failed to fetch conversion rates")
                const data = await response.json()

                const usdEurResponse = await fetch(
                    "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=eur"
                )
                if (!usdEurResponse.ok) throw new Error("Failed to fetch USD-EUR rate")
                const usdEurData = await usdEurResponse.json()

                const xlmPrice = data.stellar
                const usdToEur = usdEurData["usd-coin"].eur

                const newRates: ConversionRates = {
                    XLM: { USD: xlmPrice.usd, EUR: xlmPrice.eur },
                    USD: { XLM: 1 / xlmPrice.usd, EUR: usdToEur },
                    EUR: { XLM: 1 / xlmPrice.eur, USD: 1 / usdToEur }
                }

                setConversionRates(newRates)
                setApiError(null)
            } catch (error) {
                console.error("Error fetching conversion rates:", error)
                setApiError("Failed to fetch conversion rates. Using fallback rates.")
                setConversionRates(fallbackConversionRates)
            }
        }

        fetchConversionRates()
    }, [])

    // Wallet update function
    const updateWallet = () => {
        if (walletAddress) {
            const trimmedAddress = walletAddress.trim()
            if (trimmedAddress.length >= 4) {
                const shortAddress = `${trimmedAddress.slice(0, 6)}...${trimmedAddress.slice(-4)}`
                setWalletPlaceholder(shortAddress)
                setWalletAddress("")
            }
        }
    }

    // Add service function
    const addService = () => {
        if (newServiceName && newServicePrice) {
            const newService: Service = {
                id: Date.now(),
                name: newServiceName,
                price: newServicePrice,
                currency: newServiceCurrency,
            }
            setServices([...services, newService])
            setNewServiceName("")
            setNewServicePrice("")
            setNewServiceCurrency("XLM")
        }
    }

    // Remove service function
    const removeService = (id: number) => {
        setServices(services.filter((service) => service.id !== id))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className="flex">
                <Sidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isUserActive={isUserActive}
                    setIsUserActive={setIsUserActive}
                />
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
                <div className="flex-1 p-4 sm:p-8">
                    <div className="max-w-5xl">
                        <UserInfo isUserActive={isUserActive} />
                        <Tabs defaultValue="wallet" className="w-full">
                            <TabsList className="grid grid-cols-4 sm:grid-cols-4 mb-8 bg-[#F1F3F7] rounded-full items-center h-13 px-0 sm:px-2 py-1">
                                <TabsTrigger
                                    value="wallet"
                                    className="data-[state=active]:bg-[#002333] data-[state=active]:text-white p-1 sm:p-3 rounded-full text-xs sm:text-sm"
                                >
                                    Wallet
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="data-[state=active]:bg-[#002333] data-[state=active]:text-white p-1 sm:p-3 rounded-full text-xs sm:text-sm"
                                >
                                    Security
                                </TabsTrigger>
                                <TabsTrigger
                                    value="notifications"
                                    className="data-[state=active]:bg-[#002333] data-[state=active]:text-white px-2 py-1 sm:p-3 rounded-full text-xs sm:text-sm"
                                >
                                    Notifications
                                </TabsTrigger>
                                <TabsTrigger
                                    value="services"
                                    className="data-[state=active]:bg-[#002333] data-[state=active]:text-white p-1 sm:p-3 rounded-full text-xs sm:text-sm"
                                >
                                    Services
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="wallet" className="space-y-6">
                                <WalletSettings
                                    walletAddress={walletAddress}
                                    setWalletAddress={setWalletAddress}
                                    walletPlaceholder={walletPlaceholder}
                                    updateWallet={updateWallet}
                                />
                            </TabsContent>
                            <TabsContent value="security" className="space-y-6 bg-white p-4 sm:p-6 rounded-lg">
                                <SecuritySettings
                                    password={password}
                                    setPassword={setPassword}
                                    newPassword={newPassword}
                                    setNewPassword={setNewPassword}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    showNewPassword={showNewPassword}
                                    setShowNewPassword={setShowNewPassword}
                                />
                            </TabsContent>
                            <TabsContent value="notifications" className="space-y-6 bg-white p-4 sm:p-6 rounded-lg">
                                <NotificationSettings
                                    jobAlert={jobAlert}
                                    setJobAlert={setJobAlert}
                                    paymentAlert={paymentAlert}
                                    setPaymentAlert={setPaymentAlert}
                                    messagesAlert={messagesAlert}
                                    setMessagesAlert={setMessagesAlert}
                                    securityAlert={securityAlert}
                                    setSecurityAlert={setSecurityAlert}
                                />
                            </TabsContent>
                            <TabsContent value="services" className="space-y-6 bg-white p-4 sm:p-6 rounded-lg">
                                <ServiceSettings
                                    setServices={setServices}
                                    services={services}
                                    newServiceName={newServiceName}
                                    setNewServiceName={setNewServiceName}
                                    newServicePrice={newServicePrice}
                                    setNewServicePrice={setNewServicePrice}
                                    newServiceCurrency={newServiceCurrency}
                                    setNewServiceCurrency={setNewServiceCurrency}
                                    conversionRates={conversionRates}
                                    apiError={apiError}
                                    addService={addService}
                                    removeService={removeService}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}