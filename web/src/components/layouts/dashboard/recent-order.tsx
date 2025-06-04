import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SaleItem {
  amount: number;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

type RecentSalesProps = {
  title: string;
  description?: string;
  data: SaleItem[];
};

export default function RecentSales({ title, description, data }: RecentSalesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 pr-2">
          <div className="space-y-4">
            {data.map((sale, idx) => (
              <div key={idx} className="flex items-center space-x-4">
                <Avatar>
                  {sale.user.avatar ? (
                    <AvatarImage src={sale.user.avatar} alt={sale.user.name} crossOrigin="anonymous"/>
                  ) : (
                    <AvatarFallback>{sale.user.name[0]}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{sale.user.name}</p>
                  <p className="text-xs text-muted-foreground">{sale.user.email}</p>
                </div>
                <div className="text-sm font-semibold">${sale.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}