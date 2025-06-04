import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
interface Props {
  title: string;
  value: number;
  icon: string;
  className?: string;
}

export default function ScoreCard({ title, value, icon, className = '' }: Props) {
  const IconComponent = (LucideIcons as any)[icon];

  return (
    <Card className={`relative p-4 rounded-2xl shadow-md h-full ${className}`}>
      <CardContent className="h-full w-full p-0 flex flex-col justify-between">
        <div className="text-sm text-muted-foreground font-medium">{title}</div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-3xl font-bold text-[hsl(var(--chart-1))]">{value}</div>
        </div>
        {IconComponent && (
          <div className="absolute top-4 right-4 text-primary">
            <IconComponent className="w-6 h-6" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}