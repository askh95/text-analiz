import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FrequencyAnalysis as FrequencyAnalysisType } from "../../types";

interface FrequencyAnalysisProps {
	data: FrequencyAnalysisType;
}

export const FrequencyAnalysis = ({ data }: FrequencyAnalysisProps) => {
	const sortedEntries = Object.entries(data).sort(
		(a, b) => b[1].count - a[1].count
	);

	return (
		<Accordion defaultExpanded={false}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="frequency-analysis-content"
				id="frequency-analysis-header"
			>
				<Typography variant="h6">Вероятностный анализ</Typography>
			</AccordionSummary>
			<AccordionDetails>
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
			</AccordionDetails>
		</Accordion>
	);
};
