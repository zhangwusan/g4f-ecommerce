'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from 'recharts'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

type TotalSaleProps = {
    title?: string
    amount: number
    growth?: number
    period?: string
    order: number
}

export function TotalSale({
    title = 'Total Sales',
    amount,
    growth = 0,
    period = 'January – June 2024',
    order = 0,
}: TotalSaleProps) {
    const chartData = [
        {
            category: 'sales',
            sales: amount,
            fill: 'var(--color-sales)',
        },
    ]

    const chartConfig = {
        sales: {
            label: 'Sales',
        },
        totalSales: {
            label: 'Total Sales',
            color: 'hsl(var(--chart-2))',
        },
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{period}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={100}
                        innerRadius={80}
                        outerRadius={140}
                        className='first:fill-blue-500'
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="sales" background />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    ${amount.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Sales
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {growth >= 0 ? (
                        <>
                            Trending up by {growth.toFixed(1)}%
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </>
                    ) : (
                        <>
                            Trending down by {Math.abs(growth).toFixed(1)}%
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        </>
                    )}
                </div>
                <div>
                    Total of order: {order}
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing {title.toLowerCase()} for {period}
                </div>
            </CardFooter>
        </Card>
    )
}