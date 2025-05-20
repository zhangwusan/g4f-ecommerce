'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'

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

type TopSellingProduct = {
    product: string
    sales: number
}

type TopSellingProductsProps = {
    data: TopSellingProduct[]
    title?: string
    description?: string
}

export function TopSellingProducts({
    data,
    title = 'Top Selling Products',
    description = 'Last 30 Days',
}: TopSellingProductsProps) {
    const chartConfig: ChartConfig = {
        sales: {
            label: 'Sales',
            color: 'hsl(var(--chart-1))',
        },
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{ left: -5 }}
                        height={200}
                        barCategoryGap={3}
                    >
                        <XAxis type="number" dataKey="sales" hide />
                        <YAxis
                            dataKey="product"
                            type="category"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            width={100}
                            tick={({ x, y, payload }) => {
                                const maxChars = 10;
                                const value =
                                    payload.value.length > maxChars
                                        ? `${payload.value.slice(0, maxChars)}...`
                                        : payload.value;

                                return (
                                    <text
                                        x={x}
                                        y={y}
                                        dy={4}
                                        textAnchor="end"
                                        className="text-sm fill-foreground"
                                    >
                                        {value}
                                    </text>
                                );
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="sales" fill="hsl(var(--chart-1))" radius={5} barSize={40} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Based on units sold this period
                </div>
            </CardFooter>
        </Card>
    )
}