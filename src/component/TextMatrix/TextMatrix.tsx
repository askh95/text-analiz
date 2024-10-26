import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from "@mui/material";

import { TextMatrix as TextMatrixType } from "../../types";

interface TextMatrixProps {
	matrix: TextMatrixType;
}

export const TextMatrix = ({ matrix }: TextMatrixProps) => {
	return (
		<>
			<Paper sx={{ p: 2 }}>
				<Typography variant="h6" gutterBottom>
					Текстовая матрица
				</Typography>
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
			</Paper>
		</>
	);
};
