'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'

type MonthlySalesBarChartProps = {
    title?: string
    description?: string
    data: { month: string; sales: number }[]
}

export function SalesBarChart({
    title = 'Monthly Sales',
    description = 'Sales over the past 6 months',
    data,
}: MonthlySalesBarChartProps) {
    const chartConfig = {
        sales: {
            label: 'Sales',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `$${v.toLocaleString()}`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <CardDescription>{description}</CardDescription>
                <div className="leading-none text-muted-foreground">
                    Showing {title.toLowerCase()} for {description}
                </div>
            </CardFooter>
        </Card>
    )
}