"use client"

import { trpc } from "@/utils/trpc"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Clock, AlarmClock } from "lucide-react"

export function BannerSlider() {
  const bannerQuery = trpc.main.getBanners.useQuery()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [flashSaleIndex, setFlashSaleIndex] = useState(0)
  const [isFlashSaleExpired, setIsFlashSaleExpired] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [timeDigits, setTimeDigits] = useState<{ days?: string; hours?: string; minutes?: string; seconds?: string }>(
    {},
  )
  const [flashSaleDirection, setFlashSaleDirection] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  const backgroundUrl = "https://res.cloudinary.com/dstvymie8/image/upload/v1741104865/download_1_bzlrrj.webp"

  const handleNext = useCallback(() => {
    if (!bannerQuery.data?.data?.banners.length) return
    setDirection(1)
    setCurrentIndex((prevIndex) =>
      prevIndex === (bannerQuery.data?.data?.banners.length || 1) - 1 ? 0 : prevIndex + 1,
    )
    setAutoplay(false)
  }, [bannerQuery.data?.data?.banners.length])

  const handlePrev = useCallback(() => {
    if (!bannerQuery.data?.data?.banners.length) return
    setDirection(-1)
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? (bannerQuery.data?.data?.banners.length || 1) - 1 : prevIndex - 1,
    )
    setAutoplay(false)
  }, [bannerQuery.data?.data?.banners.length])

  // Banner autoplay
  useEffect(() => {
    if (!autoplay || !bannerQuery.data?.data?.banners.length) return

    const interval = setInterval(() => {
      handleNext()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [autoplay, bannerQuery.data?.data?.banners.length, handleNext])

  // Flash sale autoplay
  useEffect(() => {
    if (!bannerQuery.data?.data?.flashSale.length) return

    const interval = setInterval(() => {
      setFlashSaleDirection(1)
      setFlashSaleIndex((prevIndex) =>
        prevIndex === (bannerQuery.data?.data?.flashSale.length || 1) - 1 ? 0 : prevIndex + 1,
      )
    }, 3000) // Change flash sale item every 3 seconds

    return () => clearInterval(interval)
  }, [bannerQuery.data?.data?.flashSale.length])

  // Check flash sale expiration and update countdown
  useEffect(() => {
    if (!bannerQuery.data?.data?.flashSale.length) return

    // Get the first flash sale item's expiration date as the global expiration date
    const expiredDate = bannerQuery.data?.data?.flashSale[0]?.expiredFlashSale

    if (!expiredDate) {
      setIsFlashSaleExpired(true)
      return
    }

    const updateTimeLeft = () => {
      const now = new Date()
      const expireTime = new Date(expiredDate)

      // Check if flash sale is expired
      if (now >= expireTime) {
        setIsFlashSaleExpired(true)
        setTimeLeft("")
        setTimeDigits({})
        return
      }

      // Calculate time difference
      const diff = expireTime.getTime() - now.getTime()

      // Convert to days, hours, minutes, seconds
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      // Format the time left
      let timeLeftText = ""
      if (days > 0) {
        timeLeftText = `${days}d ${hours}h`
        setTimeDigits({
          days: days.toString().padStart(2, "0"),
          hours: hours.toString().padStart(2, "0"),
        })
      } else if (hours > 0) {
        timeLeftText = `${hours}h ${minutes}m`
        setTimeDigits({
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
        })
      } else {
        timeLeftText = `${minutes}m ${seconds}s`
        setTimeDigits({
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
        })
      }

      setTimeLeft(timeLeftText)
      setIsFlashSaleExpired(false)
    }

    // Update immediately
    updateTimeLeft()

    // Then update every second
    const interval = setInterval(updateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [bannerQuery.data?.data?.flashSale])

  // Reset autoplay after pause
  useEffect(() => {
    if (autoplay) return

    const timeout = setTimeout(() => {
      setAutoplay(true)
    }, 10000)

    return () => clearTimeout(timeout)
  }, [autoplay])

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check initially
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  if (!bannerQuery.data?.data?.banners.length) {
    return null
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  // Digit flip animation component
  const DigitCard = ({ digit, label }: { digit: string; label?: string }) => {
    const digits = digit.split("")

    return (
      <div className="flex flex-col items-center">
        <div className="flex">
          {digits.map((d, i) => (
            <AnimatePresence mode="popLayout" key={`${label}-${i}`}>
              <motion.div
                key={`${label}-${i}-${d}`}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ rotateX: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative bg-black/70 rounded-sm mx-0.5 w-4 md:w-5 h-5 md:h-6 flex items-center justify-center overflow-hidden"
                style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
              >
                <span className="text-[10px] md:text-xs font-bold text-yellow-300">{d}</span>
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
        {label && <span className="text-[8px] text-yellow-300/80 mt-0.5">{label}</span>}
      </div>
    )
  }


  // If flash sale is expired, don't render the flash sale section
  const renderFlashSale = () => {
    if (isFlashSaleExpired  || bannerQuery.data.data.flashSale.length <= 0) {
      return null
    }

    return (
      <div className="relative rounded-lg p-3 overflow-hidden">
        <div className="flex items-center justify-between mb-2 md:mb-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1">
              <Clock className="text-yellow-300" size={isMobile ? 14 : 16} />
              <h2 className="text-xs md:text-sm lg:text-base font-bold text-white">FLASH SALE</h2>
            </div>
            {/* Animated countdown display */}
            <div className="bg-black/50 rounded px-1.5 md:px-2 py-1 flex items-center gap-1 md:gap-2">
              {timeDigits.days && (
                <>
                  <DigitCard digit={timeDigits.days}  />
                  <span className="text-yellow-300 font-bold">:</span>
                </>
              )}
              {timeDigits.hours && <DigitCard digit={timeDigits.hours}  />}
              {timeDigits.minutes && (
                <>
                  <span className="text-yellow-300 font-bold">:</span>
                  <DigitCard digit={timeDigits.minutes} />
                </>
              )}
              {timeDigits.seconds && (
                <>
                  <span className="text-yellow-300 font-bold">:</span>
                  <DigitCard digit={timeDigits.seconds}  />
                </>
              )}
            </div>
          </div>
          <div className="bg-yellow-500 text-black text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full">
            Limited Time!
          </div>
        </div>

        {/* Flash Sale Items */}
        <div className="relative h-auto min-h-16 md:min-h-20 md:h-24 mb-6 md:mb-0">
          <AnimatePresence custom={1} mode="popLayout">
            <motion.div
              key={flashSaleIndex}
              custom={1}
              variants={{
                enter: (direction: number) => ({
                  x: "100%",
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (direction: number) => ({
                  x: "-100%",
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 h-full">
                {bannerQuery.data?.data.flashSale.map((item, index) => {
                  // Show all items on desktop, only current item on mobile
                  const shouldShow = window.innerWidth >= 768 || index === flashSaleIndex

                  if (!shouldShow) return null

                  return (
                    <motion.div
                      key={item.layanan}
                      className="border border-white/20 rounded-lg flex gap-2 items-center cursor-pointer h-16 md:h-20"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 ml-1">
                        <Image
                          src={item.bannerFlashSale ?? ""}
                          alt={item.judulFlashSale || item.layanan}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex flex-col pr-2">
                        <h3 className="text-white font-medium text-[10px] md:text-xs line-clamp-2">
                          {item.judulFlashSale || item.layanan}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <AlarmClock size={isMobile ? 10 : 12} className="text-yellow-300" />
                          <p className="text-yellow-300 font-bold text-[10px] md:text-xs">
                            Rp {item.hargaFlashSale?.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Dots Indicator for Flash Sale - More visible */}
       
      </div>
    )
  }

  return (
    <div
      className="relative w-full py-4 md:py-8 rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-full">
        <div className="relative h-full flex flex-col space-y-3 md:space-y-6 z-10">
          {/* Banner Slider */}
          <div className="relative w-full h-40 sm:h-48 md:h-64 lg:h-96 overflow-hidden rounded-lg">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute w-full h-full"
              >
                <Image
                  width={1000}
                  height={500}
                  src={bannerQuery.data?.data.banners[currentIndex]?.path || "/placeholder.svg"}
                  alt={`Banner ${currentIndex + 1}`}
                  className={`w-full h-full ${isMobile ? "object-contain" : "object-cover"} rounded-lg`}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 md:p-2 transition-all duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft size={isMobile ? 18 : 24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 md:p-2 transition-all duration-200"
              aria-label="Next slide"
            >
              <ChevronRight size={isMobile ? 18 : 24} />
            </button>

            {/* Dots Indicator - More responsive positioning */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 md:space-x-2 z-10 px-2 md:px-4 py-1 md:py-2 bg-black/20 rounded-full">
              {bannerQuery.data?.data.banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                    setAutoplay(false)
                  }}
                  className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex ? "bg-white scale-125" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          {renderFlashSale()}
        </div>
      </div>
    </div>
  )
}

