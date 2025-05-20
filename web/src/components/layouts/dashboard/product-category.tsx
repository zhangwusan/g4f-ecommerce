'use client'

import { useState } from 'react'
import {
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    ResponsiveContainer,
    Rectangle,
    CartesianGrid,
} from 'recharts'
import { TrendingUp } from 'lucide-react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type ProductCategoryData = {
    category: string
    count: number
}

type ProductDistributionProps = {
    title?: string
    description?: string
    data: ProductCategoryData[]
    total: number
}

export function ProductCategoryChart({
    title = 'Product Distribution by Category',
    description = 'Total number of products available in each category',
    data,
    total,
}: ProductDistributionProps) {
    const [view, setView] = useState<'pie' | 'bar'>(data.length > 8 ? 'bar' : 'pie')

    // Create dynamic color for pie, single color for bar
    const pieData = data.map((item, index) => ({
        ...item,
        fill: `hsl(var(--chart-${(index % 20) + 1}))`,
    }))

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <Select value={view} onValueChange={(value) => setView(value as 'pie' | 'bar')}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Chart type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pie">Pie Chart</SelectItem>
                            <SelectItem value="bar">Bar Chart</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {view === 'pie' ? (
                            <ChartContainer config={{}}>
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent nameKey="category" hideLabel />} />
                                    <Pie
                                        data={pieData}
                                        dataKey="count"
                                        nameKey="category"
                                        outerRadius={100}
                                        labelLine={false}
                                        label={({ percent, x, y, textAnchor }) => (
                                            <text
                                                x={x}
                                                y={y}
                                                textAnchor={textAnchor}
                                                dominantBaseline="central"
                                                className="text-xs fill-foreground"
                                            >
                                                {`${Math.round(percent * 100)}%`}
                                            </text>
                                        )}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={index} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        ) : (
                            <ChartContainer config={{}}>
                                <BarChart data={data}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        interval={0}
                                        angle={-90}
                                        height={100}
                                        textAnchor="end"
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="hsl(var(--chart-1))"
                                        radius={6}
                                        activeIndex={0}
                                        activeBar={(props: any) => (
                                            <Rectangle
                                                {...props}
                                                fillOpacity={0.9}
                                                stroke="hsl(var(--chart-1))"
                                                strokeDasharray="4"
                                                strokeDashoffset={4}
                                            />
                                        )}
                                    />
                                </BarChart>
                            </ChartContainer>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="text-muted-foreground">Total products: {total}</div>
            </CardFooter>
        </Card>
    )
}