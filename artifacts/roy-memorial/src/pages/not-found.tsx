import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background" dir="rtl">
      <Card className="w-full max-w-md mx-4 bg-background shadow-sm border-dashed">
        <CardContent className="pt-8 text-center space-y-6">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              העמוד לא נמצא
            </h1>
            <p className="text-muted-foreground">
              העמוד שחיפשת לא קיים או שהוסר.
            </p>
          </div>
          <Link href="/" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4">
            חזרה לעמוד הראשי
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}