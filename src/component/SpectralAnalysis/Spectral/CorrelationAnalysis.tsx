import { Paper, Typography, Box, Divider } from "@mui/material";
import { SpectrumData } from "../../../types";

interface CorrelationAnalysisProps {
	data: SpectrumData;
}

export const CorrelationAnalysis = ({ data }: CorrelationAnalysisProps) => {
	const calculateCorrelation = () => {
		const rowValues = data.rowSpectrum.map((point) => point.value);
		const colValues = data.columnSpectrum.map((point) => point.value);

		const n = Math.min(rowValues.length, colValues.length);

		const meanRow = rowValues.reduce((a, b) => a + b, 0) / n;
		const meanCol = colValues.reduce((a, b) => a + b, 0) / n;

		let numerator = 0;
		let denomRow = 0;
		let denomCol = 0;

		for (let i = 0; i < n; i++) {
			const diffRow = rowValues[i] - meanRow;
			const diffCol = colValues[i] - meanCol;
			numerator += diffRow * diffCol;
			denomRow += diffRow * diffRow;
			denomCol += diffCol * diffCol;
		}

		const correlation = numerator / Math.sqrt(denomRow * denomCol);
		return correlation;
	};

	// Расчет информационной емкости
	const calculateInformationCapacity = () => {
		const allValues = [...data.rowSpectrum, ...data.columnSpectrum].map(
			(p) => p.value
		);
		const max = Math.max(...allValues);
		const min = Math.min(...allValues);

		// Информационная емкость как логарифм от количества возможных уровней
		const levels = (max - min) / 0.001; // предполагаем точность 0.001
		return Math.log2(levels);
	};

	// Расчет энтропии
	const calculateEntropy = () => {
		const values = [...data.rowSpectrum, ...data.columnSpectrum].map(
			(p) => p.value
		);
		const total = values.reduce((a, b) => a + b, 0);

		// Расчет вероятностей
		const probabilities = values.map((v) => v / total).filter((p) => p > 0);

		// Формула энтропии Шеннона
		return -probabilities.reduce((sum, p) => sum + p * Math.log2(p), 0);
	};

	// Расчет избыточности
	const calculateRedundancy = (entropy: number, capacity: number) => {
		return (1 - entropy / capacity) * 100;
	};

	const correlation = calculateCorrelation();
	const identityLevel = Math.abs(correlation) * 100;

	const informationCapacity = calculateInformationCapacity();
	const entropy = calculateEntropy();
	const redundancy = calculateRedundancy(entropy, informationCapacity);

	return (
		<Paper sx={{ p: 2, mt: 2 }}>
			<Typography variant="h6" gutterBottom>
				Комплексный анализ
			</Typography>

			<Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
				<Box>
					<Typography variant="subtitle1" color="primary" gutterBottom>
						Корреляционный анализ
					</Typography>
					<Typography variant="body2">
						Коэффициент корреляции: {correlation.toFixed(4)}
					</Typography>
					<Typography variant="body2">
						Уровень идентичности: {identityLevel.toFixed(2)}%
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 0.5, fontSize: "0.9rem" }}
					>
						{correlation > 0.7
							? "Высокая степень идентичности"
							: correlation > 0.5
							? "Средняя степень идентичности"
							: "Низкая степень идентичности"}
					</Typography>
				</Box>

				<Divider orientation="vertical" flexItem />

				<Box>
					<Typography variant="subtitle1" color="primary" gutterBottom>
						Информационные характеристики
					</Typography>
					<Typography variant="body2">
						Информационная емкость: {informationCapacity.toFixed(2)} бит
					</Typography>
					<Typography variant="body2">
						Энтропия: {entropy.toFixed(2)} бит/символ
					</Typography>
					<Typography variant="body2">
						Избыточность: {redundancy.toFixed(2)}%
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 0.5, fontSize: "0.9rem" }}
					>
						{redundancy > 70
							? "Высокая избыточность данных"
							: redundancy > 30
							? "Средняя избыточность данных"
							: "Низкая избыточность данных"}
					</Typography>
				</Box>
			</Box>

			<Box sx={{ mt: 2, bgcolor: "grey.50", p: 1.5, borderRadius: 1 }}>
				<Typography variant="body2" color="text.secondary">
					Информационная емкость показывает максимально возможное количество
					информации в системе. Энтропия отражает реальное количество
					информации, а избыточность - степень повторяемости и предсказуемости
					данных.
				</Typography>
			</Box>
		</Paper>
	);
};
