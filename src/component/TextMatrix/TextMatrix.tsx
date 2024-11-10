import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TextMatrix as TextMatrixType } from "../../types";

interface TextMatrixProps {
	matrix: TextMatrixType;
}

export const TextMatrix = ({ matrix }: TextMatrixProps) => {
	return (
		<Accordion defaultExpanded={false}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="text-matrix-content"
				id="text-matrix-header"
			>
				<Typography variant="h6">
					Текстовый нейролингвистический кадр
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<TableContainer>
					<Table size="small">
						<TableBody>
							{matrix.map((row, i) => (
								<TableRow key={i}>
									{row.map((char, j) => (
										<TableCell
											key={j}
											align="center"
											sx={{
												p: 1,
												fontFamily: "monospace",
												border: "1px solid rgba(224, 224, 224, 1)",
											}}
										>
											{char === " " ? "␣" : char}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</AccordionDetails>
		</Accordion>
	);
};
