import { Paper, Typography, Box } from "@mui/material";
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

	const correlation = calculateCorrelation();
	const identityLevel = Math.abs(correlation) * 100;

	return (
		<Paper sx={{ p: 2, mt: 2 }}>
			<Typography variant="h6" gutterBottom>
				Корреляционный анализ
			</Typography>
			<Box>
				<Typography variant="body1">
					Коэффициент корреляции: {correlation.toFixed(4)}
				</Typography>
				<Typography variant="body1">
					Уровень идентичности: {identityLevel.toFixed(2)}%
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
					{correlation > 0.7
						? "Высокая степень идентичности"
						: correlation > 0.5
						? "Средняя степень идентичности"
						: "Низкая степень идентичности"}
				</Typography>
			</Box>
		</Paper>
	);
};
