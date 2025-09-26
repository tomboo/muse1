import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-4">
        <Skeleton className="h-9 w-1/2" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="mt-6 grid lg:grid-cols-[300px_1fr] gap-6 items-start">
        <Card>
          <CardHeader>
             <Skeleton className="h-7 w-3/4" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border-b space-y-2">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
             <Skeleton className="h-7 w-1/2" />
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 bg-card rounded-lg border space-y-3">
                      <div className="flex justify-between items-center">
                         <Skeleton className="h-6 w-16 rounded-full" />
                         <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
