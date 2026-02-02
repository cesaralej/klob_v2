'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress' // Need to shadcn add progress if not exists, implied standard shadcn

export default function UploadDropzone() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [errorDetails, setErrorDetails] = useState<string[]>([])
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      setFile(acceptedFiles[0])
      setStatus('idle')
      setMessage('')
      setErrorDetails([])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  })

  async function handleUpload() {
    if (!file) return

    setStatus('uploading')
    setErrorDetails([])
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok) {
        // Extract detailed errors if available
        if (data.details && Array.isArray(data.details)) {
          setErrorDetails(data.details)
        }
        // Build a more descriptive error message
        let errorMsg = data.error || 'Upload failed'
        if (data.stats) {
          errorMsg += ` (Valid: ${data.stats.validSales || 0} sales, ${data.stats.validProducts || 0} products, ${data.stats.validTransfers || 0} transfers)`
        }
        throw new Error(errorMsg)
      }

      setStatus('success')
      const counts = data.counts || {}
      setMessage(`Successfully processed ${counts.sales || 0} sales, ${counts.products || 0} products, ${counts.transfers || 0} transfers.`)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  return (
    <div className="grid gap-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'}
          ${file ? 'bg-gray-50 border-primary' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
            {file ? (
                <>
                    <File className="h-10 w-10 text-primary" />
                    <div className="text-sm font-medium">{file.name}</div>
                    <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</div>
                </>
            ) : (
                <>
                    <Upload className="h-10 w-10 text-gray-400" />
                    <div className="text-sm text-gray-600">
                        Drag & drop a file here, or click to select
                    </div>
                </>
            )}
        </div>
      </div>

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
            {errorDetails.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium">Show {errorDetails.length} validation error(s)</summary>
                <ul className="mt-2 list-disc list-inside text-xs max-h-40 overflow-y-auto">
                  {errorDetails.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </details>
            )}
          </AlertDescription>
        </Alert>
      )}

      {status === 'success' && (
        <Alert className="border-green-500 text-green-700 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button 
        onClick={handleUpload} 
        disabled={!file || status === 'uploading' || status === 'success'}
        className="w-full"
      >
        {status === 'uploading' ? 'Processing...' : 'Upload File'}
      </Button>
    </div>
  )
}
