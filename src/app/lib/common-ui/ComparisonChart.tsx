"use client";

import { useMemo } from "react";
import { Flame, Dumbbell, Wheat, Droplet } from "lucide-react";

interface NutritionData {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

interface DishData {
  id: number;
  name: string;
  image: string;
  nutrition: NutritionData;
  price: number;
}

interface ComparisonChartProps {
  dishes: DishData[];
}

const COLORS = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
];

const parseNutritionValue = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
};

export default function ComparisonChart({ dishes }: ComparisonChartProps) {
  const nutritionMetrics = useMemo(() => {
    const metrics = dishes.map((dish) => ({
      name: dish.name,
      calories: dish.nutrition.calories,
      protein: parseNutritionValue(dish.nutrition.protein),
      carbs: parseNutritionValue(dish.nutrition.carbs),
      fat: parseNutritionValue(dish.nutrition.fat),
    }));

    const maxValues = {
      calories: Math.max(...metrics.map((m) => m.calories)),
      protein: Math.max(...metrics.map((m) => m.protein)),
      carbs: Math.max(...metrics.map((m) => m.carbs)),
      fat: Math.max(...metrics.map((m) => m.fat)),
    };

    return { metrics, maxValues };
  }, [dishes]);

  if (dishes.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-500 text-center">
          No dishes selected for comparison
        </p>
      </div>
    );
  }

  const { metrics, maxValues } = nutritionMetrics;

  const NutritionBar = ({
    label,
    icon: Icon,
    iconColor,
    values,
    maxValue,
    unit,
  }: {
    label: string;
    icon: typeof Flame;
    iconColor: string;
    values: { name: string; value: number }[];
    maxValue: number;
    unit: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon size={18} className={iconColor} />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="space-y-2">
        {values.map((item, index) => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-24 text-xs text-gray-500 truncate" title={item.name}>
              {item.name}
            </div>
            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${COLORS[index % COLORS.length]} rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                style={{
                  width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  minWidth: item.value > 0 ? "2rem" : "0",
                }}
              >
                <span className="text-xs font-medium text-white whitespace-nowrap">
                  {item.value}
                  {unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Nutritional Comparison
      </h3>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-100">
        {dishes.map((dish, index) => (
          <div key={dish.id} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${COLORS[index % COLORS.length]}`}
            />
            <span className="text-sm text-gray-600">{dish.name}</span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <NutritionBar
          label="Calories"
          icon={Flame}
          iconColor="text-orange-500"
          values={metrics.map((m) => ({ name: m.name, value: m.calories }))}
          maxValue={maxValues.calories}
          unit=""
        />

        <NutritionBar
          label="Protein"
          icon={Dumbbell}
          iconColor="text-blue-500"
          values={metrics.map((m) => ({ name: m.name, value: m.protein }))}
          maxValue={maxValues.protein}
          unit="g"
        />

        <NutritionBar
          label="Carbs"
          icon={Wheat}
          iconColor="text-amber-500"
          values={metrics.map((m) => ({ name: m.name, value: m.carbs }))}
          maxValue={maxValues.carbs}
          unit="g"
        />

        <NutritionBar
          label="Fat"
          icon={Droplet}
          iconColor="text-purple-500"
          values={metrics.map((m) => ({ name: m.name, value: m.fat }))}
          maxValue={maxValues.fat}
          unit="g"
        />
      </div>

      {/* Summary Table */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Summary</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2 font-medium">Dish</th>
                <th className="pb-2 font-medium text-center">Calories</th>
                <th className="pb-2 font-medium text-center">Protein</th>
                <th className="pb-2 font-medium text-center">Carbs</th>
                <th className="pb-2 font-medium text-center">Fat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {metrics.map((m, index) => (
                <tr key={m.name} className="text-gray-700">
                  <td className="py-2 flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${COLORS[index % COLORS.length]}`}
                    />
                    <span className="truncate max-w-[150px]" title={m.name}>
                      {m.name}
                    </span>
                  </td>
                  <td className="py-2 text-center">{m.calories}</td>
                  <td className="py-2 text-center">{m.protein}g</td>
                  <td className="py-2 text-center">{m.carbs}g</td>
                  <td className="py-2 text-center">{m.fat}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
