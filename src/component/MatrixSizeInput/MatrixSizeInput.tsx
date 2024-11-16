import React from "react";
import { Box, TextField, Typography } from "@mui/material";

interface MatrixSizeInputProps {
	rows: number | undefined;
	cols: number | undefined;
	onRowsChange: (value: number | undefined) => void;
	onColsChange: (value: number | undefined) => void;
	isProcessing: boolean;
}

const MatrixSizeInput: React.FC<MatrixSizeInputProps> = ({
	rows,
	cols,
	onRowsChange,
	onColsChange,
	isProcessing,
}) => {
	const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const numValue = value === "" ? undefined : parseInt(value);
		onRowsChange(numValue);
	};

	const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const numValue = value === "" ? undefined : parseInt(value);
		onColsChange(numValue);
	};

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
			<TextField
				label="Строки"
				type="text"
				value={rows || ""}
				onChange={handleRowsChange}
				disabled={isProcessing}
				sx={{ width: 120 }}
				inputProps={{
					inputMode: "numeric",
					pattern: "[0-9]*",
				}}
			/>
			<Typography variant="h6">×</Typography>
			<TextField
				label="Столбцы"
				type="text"
				value={cols || ""}
				onChange={handleColsChange}
				disabled={isProcessing}
				sx={{ width: 120 }}
				inputProps={{
					inputMode: "numeric",
					pattern: "[0-9]*",
				}}
			/>
			<Typography variant="body2" color="text.secondary">
				Оставьте пустым для автоматического размера
			</Typography>
		</Box>
	);
};

export default MatrixSizeInput;
