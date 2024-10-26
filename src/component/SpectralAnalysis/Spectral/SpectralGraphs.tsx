import { Paper, Typography, Box, useTheme } from "@mui/material";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { SpectrumData } from "../../../types";

interface SpectralGraphsProps {
	data: SpectrumData;
}

export const SpectralGraphs = ({ data }: SpectralGraphsProps) => {
	const theme = useTheme();

	const combinedData = data.rowSpectrum.map((point, index) => ({
		index: point.index,
		"Строчный спектр": point.value,
		"Столбцовый спектр": data.columnSpectrum[index]?.value || 0,
	}));

	return (
		<Paper sx={{ p: 2 }}>
			<Typography variant="h6" gutterBottom>
				Информационные спектры
			</Typography>

			<Box sx={{ width: "100%", height: 400 }}>
				<ResponsiveContainer>
					<LineChart
						data={combinedData}
						margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="index"
							label={{
								value: "Индекс",
								position: "bottom",
								style: { textAnchor: "middle" },
							}}
						/>
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
						<Legend verticalAlign="top" height={36} />
						<Line
							type="monotone"
							dataKey="Строчный спектр"
							stroke={theme.palette.primary.main}
							dot={false}
							strokeWidth={2}
						/>
						<Line
							type="monotone"
							dataKey="Столбцовый спектр"
							stroke={theme.palette.secondary.main}
							dot={false}
							strokeWidth={2}
						/>
					</LineChart>
				</ResponsiveContainer>
			</Box>

			{/* Добавляем статистику по спектрам */}
			<Box sx={{ mt: 2, display: "flex", gap: 4 }}>
				<Box>
					<Typography variant="subtitle2">Строчный спектр:</Typography>
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
				<Box>
					<Typography variant="subtitle2">Столбцовый спектр:</Typography>
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
			</Box>

			{/* Добавляем описание интерпретации */}
			<Box sx={{ mt: 2, bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
				<Typography variant="body2" color="text.secondary">
					Графики показывают распределение информационной значимости в тексте:
					строчный спектр отражает горизонтальные закономерности, а столбцовый -
					вертикальные. Близость графиков может указывать на структурную
					симметрию текста.
				</Typography>
			</Box>
		</Paper>
	);
};
