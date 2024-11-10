import { Paper, Typography, Box } from "@mui/material";
import { FrequencyAnalysis, SpectrumData } from "../../../types";

interface CorrelationAnalysisProps {
	data: SpectrumData;
	frequencies: FrequencyAnalysis;
}

export const CorrelationAnalysis = ({
	frequencies,
}: CorrelationAnalysisProps) => {
	const calculateInformationCapacity = () => {
		const uniqueChars = Object.keys(frequencies);
		return Math.log2(uniqueChars.length);
	};

	const calculateEntropy = () => {
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
		<Paper sx={{ p: 2, mt: 2 }}>
			<Typography variant="h6" gutterBottom>
				Комплексный анализ
			</Typography>

			<Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
				<Box>
					<Typography variant="subtitle1" color="primary" gutterBottom>
						Информационные характеристики
					</Typography>
					<Typography variant="body2">
						Информационная емкость: {informationCapacity.toFixed(2)} бит
					</Typography>
					<Typography variant="body2">
						Энтропия: {entropy.toFixed(2)} бит
					</Typography>
					<Typography variant="body2">
						Абсолютная избыточность: {absoluteRedundancy.toFixed(2)} бит
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

			<Box sx={{ mt: 2, bgcolor: "grey.50", p: 1.5, borderRadius: 1 }}>
				<Typography variant="body2" color="text.secondary">
					Информационная емкость показывает максимально возможное количество
					информации в системе. Энтропия отражает реальное количество
					информации. Абсолютная избыточность (C - H) показывает разницу между
					максимальной и реальной информацией в битах.
				</Typography>
			</Box>
		</Paper>
	);
};
