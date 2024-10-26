import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from "@mui/material";

import { InformationMatrix as InformationMatrixType } from "../../types";

interface InformationMatrixProps {
	matrix: InformationMatrixType;
}

export const InformationMatrix = ({ matrix }: InformationMatrixProps) => {
	const maxValue = Math.max(...matrix.flat());

	const getCellColor = (value: number) => {
		const intensity = value / maxValue;
		return `rgba(25, 118, 210, ${intensity})`;
	};

	return (
		<Paper sx={{ p: 2 }}>
			<Typography variant="h6" gutterBottom>
				Информационная матрица
			</Typography>
			<TableContainer>
				<Table size="small">
					<TableBody>
						{matrix.map((row, i) => (
							<TableRow key={i}>
								{row.map((value, j) => (
									<TableCell
										key={j}
										align="center"
										sx={{
											p: 1,
											fontFamily: "monospace",
											border: "1px solid rgba(224, 224, 224, 1)",
											backgroundColor: getCellColor(value),
											color: value / maxValue > 0.5 ? "white" : "black",
										}}
									>
										{value.toFixed(2)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};
