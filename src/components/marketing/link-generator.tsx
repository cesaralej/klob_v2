'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Influencer } from '@/types/marketing-types'
import { Link2, Copy, QrCode, Check } from 'lucide-react'

interface LinkGeneratorProps {
  influencers: Influencer[]
}

export function LinkGenerator({ influencers }: LinkGeneratorProps) {
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>('')
  const [campaign, setCampaign] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    if (!selectedInfluencer || !campaign) return ''
    const influencer = influencers.find(i => i.id === selectedInfluencer)
    if (!influencer) return ''
    return `https://shop.klob.com?ref=${influencer.handle.slice(1)}&campaign=${campaign.toLowerCase().replace(/\s+/g, '-')}`
  }

  const handleCopy = () => {
    const link = generateLink()
    if (link) {
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const generatedLink = generateLink()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Influencer Link Generator
        </CardTitle>
        <CardDescription>Create trackable links for influencer campaigns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Influencer Selection */}
        <div className="space-y-2">
          <Label htmlFor="influencer">Select Influencer</Label>
          <Select value={selectedInfluencer} onValueChange={setSelectedInfluencer}>
            <SelectTrigger id="influencer">
              <SelectValue placeholder="Choose an influencer..." />
            </SelectTrigger>
            <SelectContent>
              {influencers.map((influencer) => (
                <SelectItem key={influencer.id} value={influencer.id}>
                  <div className="flex items-center gap-2">
                    <span>{influencer.avatar}</span>
                    <span>{influencer.name}</span>
                    <span className="text-muted-foreground text-xs">{influencer.handle}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Campaign Name */}
        <div className="space-y-2">
          <Label htmlFor="campaign">Campaign Name</Label>
          <Input
            id="campaign"
            placeholder="e.g., Summer Sale 2024"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
          />
        </div>

        {/* Generated Link */}
        {generatedLink && (
          <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Generated Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="bg-background font-mono text-sm"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed bg-background p-6">
              <div className="text-center space-y-2">
                <QrCode className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">QR Code would appear here</p>
              </div>
            </div>

            {/* Tracking Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-background p-3 text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground">Clicks</p>
              </div>
              <div className="rounded-lg bg-background p-3 text-center">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-muted-foreground">Conversions</p>
              </div>
            </div>
          </div>
        )}

        {!generatedLink && (
          <div className="rounded-lg border-2 border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Select an influencer and enter a campaign name to generate a trackable link
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
