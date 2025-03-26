"use client"
import { useTheme } from "next-themes"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { FormatPrice } from "@/utils/formatPrice"

// Modifikasi tipe data input
export function TransactionStatusChart({ 
  data 
}: { 
  data: {
    statusCounts: {
      successful?: number;
      pending?: number;
      failed?: number;
    }
  }
}) {
  const { theme } = useTheme()

  // Transformasi data ke format yang dibutuhkan chart
  const transformStatusData = (statusCounts: {
    successful?: number;
    pending?: number;
    failed?: number;
  }) => {
    const totalTransactions = Object.values(statusCounts).reduce((a, b) => (a || 0) + (b || 0), 0)

    return Object.entries(statusCounts)
      .filter(([_, count]) => count && count > 0)
      .map(([status, count]) => ({
        status: status.toUpperCase(),
        count: count || 0,
        amount: 0, // Anda bisa menambahkan logika perhitungan amount jika diperlukan
        percentage: totalTransactions > 0 
          ? ((count || 0) / totalTransactions * 100).toFixed(1) 
          : '0'
      }));
  }

  // Transform data
  const chartData = transformStatusData(data.statusCounts)

  if (chartData.length === 0) {
    return <div className="flex h-[300px] items-center justify-center">No data available</div>
  }

  // Define colors for each status
  const statusColors = {
    PENDING: "#FFA500",
    SUCCESSFUL: "#2ecc71", // Green
    FAILED: "#e74c3c",  // Red
  }

  // Map status names to more readable labels
  const statusLabels = {
    PENDING: "Pending",
    SUCCESSFUL: "Successful",
    FAILED: "Failed",
  }

  // Format data for the chart
  const formattedData = chartData.map((item) => ({
    name: statusLabels[item.status as keyof typeof statusLabels] || item.status,
    value: item.count,
    amount: item.amount,
    percentage: item.percentage,
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            labelLine={true}
          >
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={statusColors[entry.name as keyof typeof statusColors] || "#999999"}
                stroke={theme === "dark" ? "#1e293b" : "#f8fafc"}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "value") {
                return [`${value} transactions`, "Count"]
              }
              return [FormatPrice(props.payload.amount), "Amount"]
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
