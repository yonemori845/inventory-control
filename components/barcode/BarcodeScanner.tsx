"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"

type BarcodeScannerProps = {
  onScan: (barcode: string) => void
  onClose?: () => void
  className?: string
}

export function BarcodeScanner({ onScan, onClose, className = "" }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<InstanceType<
    Awaited<typeof import("@zxing/library")>["BrowserMultiFormatReader"]
  > | null>(null)
  const [status, setStatus] = useState<"idle" | "starting" | "scanning" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const lastScannedRef = useRef<string | null>(null)
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScan = useCallback(
    (barcode: string) => {
      const trimmed = barcode.trim()
      if (!trimmed) return
      // 連続スキャン防止（2秒間同じバーコードは無視）
      if (lastScannedRef.current === trimmed) return
      lastScannedRef.current = trimmed
      if (cooldownRef.current) clearTimeout(cooldownRef.current)
      cooldownRef.current = setTimeout(() => {
        lastScannedRef.current = null
      }, 2000)
      onScan(trimmed)
    },
    [onScan]
  )

  const startScanning = useCallback(async () => {
    if (typeof window === "undefined" || !videoRef.current) return

    setStatus("starting")
    setErrorMessage(null)

    try {
      const { BrowserMultiFormatReader } = await import("@zxing/library")
      const reader = new BrowserMultiFormatReader()

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      readerRef.current = reader
      setStatus("scanning")

      reader.decodeFromConstraints(
        constraints,
        videoRef.current,
        (result) => {
          if (result) {
            handleScan(result.getText())
          }
        }
      )
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "カメラの起動に失敗しました"
      setErrorMessage(
        msg.includes("Permission") || msg.includes("NotAllowedError")
          ? "カメラへのアクセスが許可されていません"
          : "カメラを起動できませんでした。HTTPSまたはlocalhostでお試しください。"
      )
      setStatus("error")
    }
  }, [handleScan])

  const stopScanning = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset()
      readerRef.current = null
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
      videoRef.current.srcObject = null
    }
    if (cooldownRef.current) {
      clearTimeout(cooldownRef.current)
      cooldownRef.current = null
    }
    setStatus("idle")
    setErrorMessage(null)
  }, [])

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  return (
    <div className={`rounded-lg border bg-card p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">バーコードスキャン</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            閉じる
          </Button>
        )}
      </div>

      <div className="relative aspect-video overflow-hidden rounded-md bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
        />
        {status === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/80">
            <p className="text-sm text-muted-foreground">
              カメラでバーコードをスキャンします
            </p>
            <Button onClick={startScanning}>スキャンを開始</Button>
          </div>
        )}
        {status === "starting" && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
            <p className="text-sm text-muted-foreground">
              カメラを起動中...
            </p>
          </div>
        )}
        {status === "scanning" && (
          <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
            バーコードを枠内に合わせてください
          </div>
        )}
      </div>

      {status === "scanning" && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={stopScanning}
        >
          スキャンを停止
        </Button>
      )}

      {errorMessage && (
        <div className="mt-2 rounded-md border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
