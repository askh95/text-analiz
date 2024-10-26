import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";

import { FrequencyAnalysis as FrequencyAnalysisType } from "../../types";

interface FrequencyAnalysisProps {
	data: FrequencyAnalysisType;
}

export const FrequencyAnalysis = ({ data }: FrequencyAnalysisProps) => {
	const sortedEntries = Object.entries(data).sort(
		(a, b) => b[1].count - a[1].count
	);
	return (
		<Paper sx={{ p: 2 }}>
			<Typography variant="h6" gutterBottom>
				Частотный анализ
			</Typography>
			<TableContainer>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>Символ</TableCell>
							<TableCell align="right">Количество</TableCell>
							<TableCell align="right">Вероятность</TableCell>
							<TableCell align="right">Информация (бит)</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedEntries.map(([char, info]) => (
							<TableRow key={char}>
								<TableCell>{char === " " ? "␣" : char}</TableCell>
								<TableCell align="right">{info.count}</TableCell>
								<TableCell align="right">
									{info.probability.toFixed(4)}
								</TableCell>
								<TableCell align="right">
									{info.information.toFixed(2)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};
