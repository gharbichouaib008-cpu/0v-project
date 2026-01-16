"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { ExternalLink, Upload, CheckCircle, Loader2, X, ImageIcon } from "lucide-react"

type SubmissionStatus = "idle" | "submitting" | "pending"

export function EarnRewardsTab() {
  const [status, setStatus] = useState<SubmissionStatus>("idle")
  const [email, setEmail] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const PARTNER_LINK = "https://example.com/register?ref=10c"
  const REWARD_AMOUNT = "5.00"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!email.trim() || !file) return

    setStatus("submitting")

    console.log("[v0] Earn Rewards Submission:", {
      email: email.trim(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      file: file,
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStatus("pending")
  }

  const handleOpenPartnerLink = () => {
    window.open(PARTNER_LINK, "_blank", "noopener,noreferrer")
  }

  // Pending state view
  if (status === "pending") {
    return (
      <div className="space-y-6 pb-24">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white text-glow-purple" style={{ fontFamily: "Tanker, sans-serif" }}>
            Earn Rewards
          </h2>
          <p className="text-sm text-white/60">Partner offers for bonus earnings</p>
        </div>

        <div className="glass rounded-2xl p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan/20 border border-cyan/30">
              <CheckCircle className="h-8 w-8 text-cyan" />
            </div>
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Tanker, sans-serif" }}>
              Verification Pending
            </h3>
            <p className="text-sm text-white/60 max-w-xs">
              Your submission has been received. Our team will verify your registration within 24-48 hours.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-cyan/10 border border-cyan/20">
              <p className="text-sm font-medium text-cyan">Reward: {REWARD_AMOUNT} USDT</p>
              <p className="text-xs text-white/60 mt-1">Will be credited after verification</p>
            </div>
            <Button
              variant="outline"
              className="mt-4 bg-white/10 text-white border border-white/10 hover:bg-white/15"
              onClick={() => {
                setStatus("idle")
                setEmail("")
                handleRemoveFile()
              }}
            >
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white text-glow-purple" style={{ fontFamily: "Tanker, sans-serif" }}>
          Earn Rewards
        </h2>
        <p className="text-sm text-white/60">Partner offers for bonus earnings</p>
      </div>

      {/* Task Description Card with present icon */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-start gap-4">
          <Image src="/icons/present.png" alt="Earn" width={50} height={50} className="icon-float shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-gold" style={{ fontFamily: "Tanker, sans-serif" }}>
              Register & Earn
            </h3>
            <p className="text-sm text-white/60 mt-1">
              Register on our partner site to earn <span className="font-bold text-white">{REWARD_AMOUNT} USDT</span>.
              Please use the link below to register, then submit proof of your registration.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Link Button */}
      <Button
        onClick={handleOpenPartnerLink}
        className="w-full h-12 bg-cyan/20 text-cyan border border-cyan/30 glow-cyan hover:bg-cyan/30 font-semibold"
        style={{ fontFamily: "Tanker, sans-serif" }}
      >
        <ExternalLink className="mr-2 h-5 w-5" />
        Open Partner Site
      </Button>

      {/* Submission Form with hand icon */}
      <div className="glass rounded-2xl p-5 space-y-5">
        <div className="flex items-center gap-2">
          <Image src="/icons/hand.png" alt="Submit" width={28} height={28} className="icon-float" />
          <h3 className="font-semibold text-white" style={{ fontFamily: "Tanker, sans-serif" }}>
            Submit Proof
          </h3>
        </div>

        {/* Email/Username Input */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-white/80">
            Your Registered Email/Username
          </Label>
          <Input
            id="email"
            type="text"
            placeholder="Enter the email or username you registered with"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border-white/10 focus:border-cyan text-white placeholder:text-white/40"
            disabled={status === "submitting"}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/80">Upload Screenshot Proof</Label>

          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-cyan/50 hover:bg-cyan/5 transition-colors"
            >
              <Upload className="h-8 w-8 mx-auto text-white/50 mb-2" />
              <p className="text-sm text-white/60">Tap to upload screenshot</p>
              <p className="text-xs text-white/40 mt-1">PNG, JPG up to 10MB</p>
            </div>
          ) : (
            <div className="relative border border-white/20 rounded-xl p-3 bg-white/5">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-16 w-16 flex items-center justify-center bg-white/10 rounded-lg">
                    <ImageIcon className="h-6 w-6 text-white/50" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  <p className="text-xs text-white/60">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="h-8 w-8 shrink-0 text-white/60 hover:text-white hover:bg-white/10"
                  disabled={status === "submitting"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={status === "submitting"}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!email.trim() || !file || status === "submitting"}
          className="w-full h-12 bg-gold/20 text-gold border border-gold/30 glow-gold hover:bg-gold/30 font-semibold disabled:opacity-50"
          style={{ fontFamily: "Tanker, sans-serif" }}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Proof"
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-white/50 px-4">
        Verification typically takes 24-48 hours. Make sure your screenshot clearly shows your registered account.
      </p>
    </div>
  )
}
