import React, { useState, useRef, useCallback } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	Button,
	Box,
	Typography,
	TextField,
	IconButton,
	Tooltip,
	Grid,
	LinearProgress,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { Enhanced3DVisualization } from "../SpectralAnalysis/Spectral/Spectral3DVisualization";
import { AnalysisResults } from "../../types";

interface TextComparisonProps {
	open: boolean;
	onClose: () => void;
	calculateResults: (
		text: string,
		rows: number,
		cols: number
	) => AnalysisResults;
}

export const TextComparison = ({
	open,
	onClose,
	calculateResults,
}: TextComparisonProps) => {
	const [text1, setText1] = useState("");
	const [text2, setText2] = useState("");
	const [fileName1, setFileName1] = useState("");
	const [fileName2, setFileName2] = useState("");
	const [results1, setResults1] = useState<AnalysisResults | null>(null);
	const [results2, setResults2] = useState<AnalysisResults | null>(null);
	const [identityLevel, setIdentityLevel] = useState(0);
	const [isComparing, setIsComparing] = useState(false);

	const fileInputRef1 = useRef<HTMLInputElement>(null);
	const fileInputRef2 = useRef<HTMLInputElement>(null);

	const handleFileUpload = useCallback(
		(fileNum: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
					alert("Пожалуйста, загрузите текстовый файл (.txt)");
					return;
				}

				const reader = new FileReader();
				reader.onload = (e) => {
					const content = e.target?.result as string;
					if (fileNum === 1) {
						setText1(content);
						setFileName1(file.name);
					} else {
						setText2(content);
						setFileName2(file.name);
					}
				};
				reader.readAsText(file);
			}
		},
		[]
	);

	const handleClearFile = useCallback(
		(fileNum: number) => () => {
			if (fileNum === 1) {
				setText1("");
				setFileName1("");
				if (fileInputRef1.current) fileInputRef1.current.value = "";
			} else {
				setText2("");
				setFileName2("");
				if (fileInputRef2.current) fileInputRef2.current.value = "";
			}
		},
		[]
	);

	const calculateIdentityLevel = (
		results1: AnalysisResults,
		results2: AnalysisResults
	) => {
		const spectrum1 = results1.spectrumData;
		const spectrum2 = results2.spectrumData;

		const rowSimilarity = compareSpectrums(
			spectrum1.rowSpectrum.map((x) => x.value),
			spectrum2.rowSpectrum.map((x) => x.value)
		);

		const colSimilarity = compareSpectrums(
			spectrum1.columnSpectrum.map((x) => x.value),
			spectrum2.columnSpectrum.map((x) => x.value)
		);

		return (rowSimilarity + colSimilarity) / 2;
	};

	const compareSpectrums = (
		spectrum1: number[],
		spectrum2: number[]
	): number => {
		const maxLen = Math.max(spectrum1.length, spectrum2.length);
		const normalized1 = normalizeSpectrum(spectrum1, maxLen);
		const normalized2 = normalizeSpectrum(spectrum2, maxLen);

		let similarity = 0;
		for (let i = 0; i < maxLen; i++) {
			const diff = Math.abs(normalized1[i] - normalized2[i]);
			similarity += 1 - diff / Math.max(normalized1[i], normalized2[i], 1);
		}

		return similarity / maxLen;
	};

	const normalizeSpectrum = (
		spectrum: number[],
		targetLength: number
	): number[] => {
		const result = new Array(targetLength).fill(0);
		for (let i = 0; i < targetLength; i++) {
			const pos = (i * spectrum.length) / targetLength;
			const lower = Math.floor(pos);
			const upper = Math.ceil(pos);
			const fraction = pos - lower;

			if (upper >= spectrum.length) {
				result[i] = spectrum[lower] || 0;
			} else {
				result[i] =
					(1 - fraction) * spectrum[lower] + fraction * spectrum[upper];
			}
		}
		return result;
	};

	const handleCompare = useCallback(() => {
		if (!text1.trim() || !text2.trim() || isComparing) return;
		setIsComparing(true);

		try {
			const sqrt1 = Math.ceil(Math.sqrt(text1.length));
			const sqrt2 = Math.ceil(Math.sqrt(text2.length));

			const results1 = calculateResults(text1, sqrt1, sqrt1);
			const results2 = calculateResults(text2, sqrt2, sqrt2);

			setResults1(results1);
			setResults2(results2);

			const identity = calculateIdentityLevel(results1, results2);
			setIdentityLevel(identity);
		} catch (error) {
			console.error("Error comparing texts:", error);
		} finally {
			setIsComparing(false);
		}
	}, [text1, text2, isComparing, calculateResults]);

	return (
		<Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
			<DialogTitle>Сравнение информационных образов</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Первый текст
							</Typography>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<Button
									variant="outlined"
									component="label"
									startIcon={<UploadFileIcon />}
								>
									Загрузить файл
									<input
										type="file"
										hidden
										accept=".txt"
										onChange={handleFileUpload(1)}
										ref={fileInputRef1}
									/>
								</Button>
								{fileName1 && (
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Typography variant="body2" color="text.secondary">
											{fileName1}
										</Typography>
										<Tooltip title="Удалить файл">
											<IconButton size="small" onClick={handleClearFile(1)}>
												<DeleteIcon fontSize="small" />
											</IconButton>
										</Tooltip>
									</Box>
								)}
							</Box>
							<TextField
								fullWidth
								multiline
								rows={4}
								value={text1}
								onChange={(e) => setText1(e.target.value)}
								label="Текст для сравнения"
							/>
						</Box>
					</Grid>

					<Grid item xs={6}>
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Второй текст
							</Typography>
							<Box sx={{ display: "flex", gap: 2, mb: 2 }}>
								<Button
									variant="outlined"
									component="label"
									startIcon={<UploadFileIcon />}
								>
									Загрузить файл
									<input
										type="file"
										hidden
										accept=".txt"
										onChange={handleFileUpload(2)}
										ref={fileInputRef2}
									/>
								</Button>
								{fileName2 && (
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Typography variant="body2" color="text.secondary">
											{fileName2}
										</Typography>
										<Tooltip title="Удалить файл">
											<IconButton size="small" onClick={handleClearFile(2)}>
												<DeleteIcon fontSize="small" />
											</IconButton>
										</Tooltip>
									</Box>
								)}
							</Box>
							<TextField
								fullWidth
								multiline
								rows={4}
								value={text2}
								onChange={(e) => setText2(e.target.value)}
								label="Текст для сравнения"
							/>
						</Box>
					</Grid>

					{results1 && results2 && (
						<>
							<Grid item xs={6}>
								<Enhanced3DVisualization data={results1.spectrumData} />
							</Grid>
							<Grid item xs={6}>
								<Enhanced3DVisualization data={results2.spectrumData} />
							</Grid>
							<Grid item xs={12}>
								<Box sx={{ mt: 2 }}>
									<Typography variant="h6" gutterBottom>
										Уровень идентичности: {identityLevel.toFixed(2)}
									</Typography>
									<LinearProgress
										variant="determinate"
										value={identityLevel * 100}
										sx={{ height: 10, borderRadius: 1 }}
									/>
								</Box>
							</Grid>
						</>
					)}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Закрыть</Button>
				<Button
					variant="contained"
					onClick={handleCompare}
					disabled={!text1.trim() || !text2.trim() || isComparing}
				>
					{isComparing ? "Сравнение..." : "Сравнить"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
