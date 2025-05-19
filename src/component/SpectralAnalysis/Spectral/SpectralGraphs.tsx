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
import { FrequencyAnalysis, SpectrumData } from "../../../types";

interface SpectralGraphsProps {
	data: SpectrumData;
	frequencies?: FrequencyAnalysis;
}

export const SpectralGraphs = ({ data, frequencies }: SpectralGraphsProps) => {
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

	const calculateInformationCapacity = () => {
		if (!frequencies) return 0;
		const uniqueChars = Object.keys(frequencies);
		return Math.log2(uniqueChars.length);
	};

	const calculateEntropy = () => {
		if (!frequencies) return 0;
		return -Object.values(frequencies)
			.filter((f) => f.probability > 0)
			.reduce((sum, f) => {
				return sum + f.probability * Math.log2(f.probability);
			}, 0);
	};

	const calculateAbsoluteRedundancy = (entropy: number, capacity: number) => {
		return capacity - entropy;
	};

	const informationCapacity = calculateInformationCapacity();
	const entropy = calculateEntropy();
	const absoluteRedundancy = calculateAbsoluteRedundancy(
		entropy,
		informationCapacity
	);

	return (
		<Paper
			elevation={2}
			sx={{
				p: 3,
				borderRadius: 2,
				background: theme.palette.background.default,
				boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
			}}
		>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
				<Box>
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
				</Box>

				<Box>
					<Typography variant="h6" gutterBottom>
						Спектр горизонтальной развертки нейролингвистического
						информационного кадра
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
				</Box>

				<Box>
					<Typography variant="h6" gutterBottom>
						Комплексный анализ
					</Typography>
					<Typography variant="subtitle1">
						Информационные характеристики
					</Typography>

					{frequencies && (
						<Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
							<Box>
								<Typography variant="body2">
									Информационная емкость: {informationCapacity.toFixed(2)} бит
								</Typography>
								<Typography variant="body2">
									Энтропия: {entropy.toFixed(2)} бит
								</Typography>
								<Typography variant="body2">
									Избыточность: {absoluteRedundancy.toFixed(2)} бит
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mt: 0.5, fontSize: "0.9rem" }}
								>
									{absoluteRedundancy > 3
										? "Высокая избыточность данных"
										: absoluteRedundancy > 1
										? "Средняя избыточность данных"
										: "Низкая избыточность данных"}
								</Typography>
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</Paper>
	);
};

export default SpectralGraphs;
