import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import UploadDropzone from '@/components/upload-dropzone'

export default function UploadPage() {
  return (
    <main className="flex-1 p-8 pt-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Sales Data</CardTitle>
          <CardDescription>
            Upload a .csv or .xlsx file containing your sales records.
            <br />
            Required columns: <code>sale_date</code>, <code>sku</code>, <code>quantity</code>, <code>net_revenue</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadDropzone />
        </CardContent>
      </Card>
    </main>
  )
}
