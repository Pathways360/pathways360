import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Download, BarChart3, PieChart, LineChart, Target } from "lucide-react";
import { useState } from "react";

interface OutcomeMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  category: string;
}

const OUTCOME_METRICS: OutcomeMetric[] = [
  {
    name: "Housing Stability",
    value: 87,
    target: 90,
    unit: "%",
    trend: "up",
    trendPercent: 5,
    category: "Housing",
  },
  {
    name: "Treatment Engagement",
    value: 92,
    target: 95,
    unit: "%",
    trend: "up",
    trendPercent: 8,
    category: "Treatment",
  },
  {
    name: "Medication Adherence",
    value: 78,
    target: 85,
    unit: "%",
    trend: "up",
    trendPercent: 3,
    category: "Medical",
  },
  {
    name: "Appointment Attendance",
    value: 85,
    target: 90,
    unit: "%",
    trend: "stable",
    trendPercent: 0,
    category: "Healthcare",
  },
  {
    name: "Employment Placement",
    value: 62,
    target: 75,
    unit: "%",
    trend: "up",
    trendPercent: 12,
    category: "Employment",
  },
  {
    name: "Family Reunification",
    value: 71,
    target: 80,
    unit: "%",
    trend: "up",
    trendPercent: 6,
    category: "Family",
  },
  {
    name: "ED Utilization Reduction",
    value: 45,
    target: 50,
    unit: "%",
    trend: "down",
    trendPercent: -2,
    category: "Healthcare",
  },
  {
    name: "Recidivism Reduction",
    value: 68,
    target: 75,
    unit: "%",
    trend: "up",
    trendPercent: 4,
    category: "Justice",
  },
];

const COST_SAVINGS = [
  { category: "Emergency Department", savings: 245000, baseline: 380000, reduction: "35%" },
  { category: "Inpatient Hospitalization", savings: 180000, baseline: 520000, reduction: "31%" },
  { category: "Incarceration Prevention", savings: 420000, baseline: 650000, reduction: "42%" },
  { category: "Child Welfare Services", savings: 95000, baseline: 180000, reduction: "47%" },
];

const PROGRAM_OUTCOMES = [
  { program: "Employment Program", clients: 45, placed: 28, retention: "82%", avgWage: "$18.50/hr" },
  { program: "Housing First", clients: 52, placed: 48, retention: "92%", avgWage: "N/A" },
  { program: "Treatment Program", clients: 38, placed: 35, retention: "89%", avgWage: "N/A" },
  { program: "Mental Health Services", clients: 61, placed: 58, retention: "95%", avgWage: "N/A" },
];

const getTrendIcon = (trend: string) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />;
  if (trend === "down") return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
  return <TrendingUp className="w-4 h-4 text-gray-600" />;
};

const getTrendColor = (trend: string) => {
  if (trend === "up") return "text-green-600";
  if (trend === "down") return "text-red-600";
  return "text-gray-600";
};

export default function ROIDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...new Set(OUTCOME_METRICS.map(m => m.category))];
  const filteredMetrics = selectedCategory === "All" 
    ? OUTCOME_METRICS 
    : OUTCOME_METRICS.filter(m => m.category === selectedCategory);

  const totalCostSavings = COST_SAVINGS.reduce((sum, item) => sum + item.savings, 0);
  const totalBaseline = COST_SAVINGS.reduce((sum, item) => sum + item.baseline, 0);
  const overallReduction = Math.round(((totalBaseline - totalCostSavings) / totalBaseline) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ROI & Outcomes Dashboard</h2>
          <p className="text-gray-600 mt-1">Track program outcomes, cost savings, and performance metrics</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Download className="w-4 h-4 mr-2" />Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Total Cost Savings</p>
            <p className="text-2xl font-bold text-green-600">${(totalCostSavings / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-600 mt-1">vs ${(totalBaseline / 1000).toFixed(0)}K baseline</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Overall Reduction</p>
            <p className="text-2xl font-bold text-green-600">{overallReduction}%</p>
            <p className="text-xs text-gray-600 mt-1">Cost reduction across all programs</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Clients Served</p>
            <p className="text-2xl font-bold text-blue-600">196</p>
            <p className="text-xs text-gray-600 mt-1">Across all programs</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">Avg Outcome Rate</p>
            <p className="text-2xl font-bold text-teal-600">79%</p>
            <p className="text-xs text-gray-600 mt-1">vs 75% target</p>
          </CardContent>
        </Card>
      </div>

      {/* Outcome Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Outcome Metrics</h3>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? "bg-teal-600 text-white" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMetrics.map(metric => (
            <Card key={metric.name} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                    <p className="text-xs text-gray-500">{metric.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                      {metric.trend === "up" ? "+" : metric.trend === "down" ? "-" : ""}{metric.trendPercent}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}{metric.unit}</span>
                    <span className="text-sm text-gray-500">Target: {metric.target}{metric.unit}</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metric.value >= metric.target ? "bg-green-600" : "bg-blue-600"}`}
                      style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{Math.round((metric.value / metric.target) * 100)}% of target</span>
                    <Badge className={metric.value >= metric.target ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                      {metric.value >= metric.target ? "On Track" : "In Progress"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cost Savings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-600" />
            Cost Savings Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Category</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900">Baseline</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900">Current</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900">Savings</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-900">Reduction</th>
                </tr>
              </thead>
              <tbody>
                {COST_SAVINGS.map(item => (
                  <tr key={item.category} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3 text-gray-900 font-medium">{item.category}</td>
                    <td className="text-right py-3 px-3 text-gray-600">${(item.baseline / 1000).toFixed(0)}K</td>
                    <td className="text-right py-3 px-3 text-gray-600">${(item.savings / 1000).toFixed(0)}K</td>
                    <td className="text-right py-3 px-3 font-semibold text-green-600">${((item.baseline - item.savings) / 1000).toFixed(0)}K</td>
                    <td className="text-right py-3 px-3">
                      <Badge className="bg-green-100 text-green-700">{item.reduction}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Program Outcomes */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-600" />
            Program Outcomes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-gray-900">Program</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Clients</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Placed/Engaged</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Retention</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-900">Avg Wage</th>
                </tr>
              </thead>
              <tbody>
                {PROGRAM_OUTCOMES.map(program => (
                  <tr key={program.program} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3 text-gray-900 font-medium">{program.program}</td>
                    <td className="text-center py-3 px-3 text-gray-600">{program.clients}</td>
                    <td className="text-center py-3 px-3">
                      <Badge className="bg-blue-100 text-blue-700">{program.placed}</Badge>
                    </td>
                    <td className="text-center py-3 px-3 font-semibold text-green-600">{program.retention}</td>
                    <td className="text-center py-3 px-3 text-gray-600">{program.avgWage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
