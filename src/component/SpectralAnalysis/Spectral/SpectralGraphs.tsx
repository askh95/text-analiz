import { Paper, Typography, Box, useTheme } from "@mui/material";
import {
	LineChart,
	Line,
	YAxis,
	XAxis,
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

	const adjustedColumnSpectrum = data.columnSpectrum.map((point) => ({
		...point,
		index: point.index + 1,
	}));

	const adjustedRowSpectrum = data.rowSpectrum.map((point) => ({
		...point,
		index: point.index + 1,
	}));

	const calculateStats = (spectrum: { index: number; value: number }[]) => {
		const values = spectrum.map((p) => p.value);
		const nonEmptyValues = values.filter((v) => v > 0);
		const max = Math.max(...values);
		const min = Math.min(...nonEmptyValues);
		const avg =
			nonEmptyValues.length > 0
				? nonEmptyValues.reduce((acc, val) => acc + val, 0) /
				  nonEmptyValues.length
				: 0;

		return {
			max: max.toFixed(3),
			min: min.toFixed(3),
			avg: avg.toFixed(3),
		};
	};

	const rowStats = calculateStats(data.rowSpectrum);
	const colStats = calculateStats(data.columnSpectrum);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					Спектр вертикальной развертки нейролингвистического информационного
					кадра
				</Typography>
				<Box sx={{ width: "100%", height: 300 }}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={adjustedColumnSpectrum}
							margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="index" tick={false} axisLine={true} />
							<YAxis
								tick={{ fontSize: 12 }}
								tickFormatter={(value) => value.toFixed(2)}
								domain={[Number(colStats.min), Number(colStats.max)]}
							/>
							<Tooltip
								formatter={(value: number) => value.toFixed(3)}
								labelFormatter={(label) => `Столбец ${label}`}
							/>
							<Line
								type="natural"
								dataKey="value"
								stroke={theme.palette.primary.main}
								dot={false}
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</Box>

				<Box sx={{ mt: 2 }}>
					<Typography variant="subtitle1">
						Статистика вертикального спектра:
					</Typography>
					<Typography variant="body2">Максимум: {colStats.max} /бит</Typography>
					<Typography variant="body2">Минимум: {colStats.min} /бит</Typography>
					<Typography variant="body2">
						Среднее значение: {colStats.avg} /бит
					</Typography>
				</Box>
			</Paper>

			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					Спектр горизонтальной развертки нейролингвистического информационного
					кадра
				</Typography>
				<Box sx={{ width: "100%", height: 300 }}>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={adjustedRowSpectrum}
							margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="index" tick={false} axisLine={true} />
							<YAxis
								tick={{ fontSize: 12 }}
								tickFormatter={(value) => value.toFixed(2)}
								domain={[Number(rowStats.min), Number(rowStats.max)]}
							/>
							<Tooltip
								formatter={(value: number) => value.toFixed(3)}
								labelFormatter={(label) => `Строка ${label}`}
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
					<Typography variant="subtitle1">
						Статистика горизонтального спектра:
					</Typography>
					<Typography variant="body2">Максимум: {rowStats.max} /бит</Typography>
					<Typography variant="body2">Минимум: {rowStats.min} /бит</Typography>
					<Typography variant="body2">
						Среднее значение: {rowStats.avg} /бит
					</Typography>
				</Box>
			</Paper>
		</Box>
	);
};

export default SpectralGraphs;
