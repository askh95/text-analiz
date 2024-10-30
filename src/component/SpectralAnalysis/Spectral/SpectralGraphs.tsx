import { Paper, Typography, Box, useTheme } from "@mui/material";
import {
	LineChart,
	Line,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { SpectrumData } from "../../../types";

interface SpectralGraphsProps {
	data: SpectrumData;
}

export const SpectralGraphs = ({ data }: SpectralGraphsProps) => {
	const theme = useTheme();

	const rowData = data.rowSpectrum.map((point) => ({
		index: point.index,
		value: point.value,
	}));

	const columnData = data.columnSpectrum.map((point) => ({
		index: point.index,
		value: point.value,
	}));

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					Вертикальный информационный спектр
				</Typography>
				<Box sx={{ width: "100%", height: 300 }}>
					<ResponsiveContainer>
						<LineChart
							data={columnData}
							margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
						>
							<CartesianGrid strokeDasharray="3 3" />

							<YAxis
								label={{
									value: "Значение спектра (бит)",
									angle: -90,
									position: "insideLeft",
									style: { textAnchor: "middle" },
								}}
							/>
							<Tooltip
								formatter={(value: number) => value.toFixed(3)}
								labelFormatter={(label) => `Индекс: ${label}`}
							/>
							<Line
								type="natural"
								dataKey="value"
								stroke={theme.palette.primary.main}
								dot={false}
								strokeWidth={2}
								activeDot={{ r: 4 }}
								isAnimationActive={true}
								animationDuration={1000}
								animationEasing="ease-in-out"
							/>
						</LineChart>
					</ResponsiveContainer>
				</Box>

				<Box sx={{ mt: 2 }}>
					<Typography variant="subtitle2">Статистика:</Typography>
					<Typography variant="body2">
						Макс. значение:{" "}
						{Math.max(...data.columnSpectrum.map((p) => p.value)).toFixed(3)}
					</Typography>
					<Typography variant="body2">
						Ср. значение:{" "}
						{(
							data.columnSpectrum.reduce((acc, p) => acc + p.value, 0) /
							data.columnSpectrum.length
						).toFixed(3)}
					</Typography>
				</Box>
			</Paper>

			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					Горизонтальный информационный спектр
				</Typography>
				<Box sx={{ width: "100%", height: 300 }}>
					<ResponsiveContainer>
						<LineChart
							data={rowData}
							margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
						>
							<CartesianGrid strokeDasharray="3 3" />

							<YAxis
								label={{
									value: "Значение спектра (бит)",
									angle: -90,
									position: "insideLeft",
									style: { textAnchor: "middle" },
								}}
							/>
							<Tooltip
								formatter={(value: number) => value.toFixed(3)}
								labelFormatter={(label) => `Индекс: ${label}`}
							/>
							<Line
								type="monotone"
								dataKey="value"
								stroke={theme.palette.secondary.main}
								dot={false}
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Box>

				<Box sx={{ mt: 2 }}>
					<Typography variant="subtitle2">Статистика:</Typography>
					<Typography variant="body2">
						Макс. значение:{" "}
						{Math.max(...data.rowSpectrum.map((p) => p.value)).toFixed(3)}
					</Typography>
					<Typography variant="body2">
						Ср. значение:{" "}
						{(
							data.rowSpectrum.reduce((acc, p) => acc + p.value, 0) /
							data.rowSpectrum.length
						).toFixed(3)}
					</Typography>
				</Box>
			</Paper>

			<Paper sx={{ p: 2, bgcolor: "background.default" }}>
				<Typography variant="body2" color="text.secondary">
					Графики показывают распределение информационной значимости в тексте:
					горизонтальный спектр отражает строчные закономерности, а вертикальный
					- столбцовые. Каждый график теперь представлен отдельно для более
					детального анализа.
				</Typography>
			</Paper>
		</Box>
	);
};

export default SpectralGraphs;
