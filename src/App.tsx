import { useState, useRef, useCallback, useMemo } from "react";
import {
	Container,
	TextField,
	Button,
	Grid,
	AppBar,
	Toolbar,
	Typography,
	Box,
	ThemeProvider,
	createTheme,
	CssBaseline,
	Paper,
	IconButton,
	Tooltip,
	Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextMatrix } from "./component/TextMatrix/TextMatrix";
import { FrequencyAnalysis } from "./component/FrequencyAnalysis/FrequencyAnalysis";
import { InformationMatrix } from "./component/InformationMatrix/InformationMatrix";
import { SpectralAnalysis } from "./component/SpectralAnalysis/SpectralAnalysis";
import MatrixSizeInput from "./component/MatrixSizeInput/MatrixSizeInput";
import { TextComparison } from "./component/TextComparisonModal/TextComparisonModal";
import { createTextMatrix, calculateFrequencies } from "./utils";
import { AnalysisResults } from "./types";
import _ from "lodash";

const theme = createTheme({
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
				},
			},
		},
	},
});

function App() {
	const [text, setText] = useState("");
	const [results, setResults] = useState<AnalysisResults | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [fileName, setFileName] = useState<string>("");
	const [comparisonOpen, setComparisonOpen] = useState(false);

	const [dimensions, setDimensions] = useState<{
		rows?: number;
		cols?: number;
	}>({});
	const fileInputRef = useRef<HTMLInputElement>(null);

	const calculateResults = useMemo(
		() => (inputText: string, rows: number, cols: number) => {
			const textMatrix = createTextMatrix(inputText, rows, cols);
			const frequencyData = calculateFrequencies(textMatrix);

			const informationMatrix = textMatrix.map((row) =>
				row.map((char) => frequencyData[char]?.information || 0)
			);

			const rowSpectrum = informationMatrix.map((row, rowIndex) => {
				const nonEmptyValues = row.filter((val) => val > 0);
				const sum = nonEmptyValues.reduce((acc, val) => acc + val, 0);
				return {
					index: rowIndex,
					value: nonEmptyValues.length > 0 ? sum : 0,
				};
			});

			const columnSpectrum = Array(informationMatrix[0].length)
				.fill(0)
				.map((_, colIndex) => {
					const columnValues = informationMatrix.map((row) => row[colIndex]);
					const nonEmptyValues = columnValues.filter((val) => val > 0);
					const sum = nonEmptyValues.reduce((acc, val) => acc + val, 0);
					return {
						index: colIndex,
						value: nonEmptyValues.length > 0 ? sum : 0,
					};
				});

			return {
				textMatrix,
				informationMatrix,
				frequencyData,
				spectrumData: {
					rowSpectrum,
					columnSpectrum,
				},
				dimensions: { rows, cols },
			};
		},
		[]
	);

	const debouncedSetText = useCallback(
		_.debounce((value: string) => {
			setText(value);
		}, 0),
		[]
	);

	const handleAnalyze = useCallback(() => {
		if (!text.trim() || isProcessing) return;
		setIsProcessing(true);

		try {
			const sqrt = Math.ceil(Math.sqrt(text.length));
			const newResults = calculateResults(
				text,
				dimensions.rows || sqrt,
				dimensions.cols || sqrt
			);
			setResults(newResults);
		} catch (error) {
			console.error("Error analyzing text:", error);
		} finally {
			setIsProcessing(false);
		}
	}, [text, dimensions, isProcessing, calculateResults]);

	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
					alert("Пожалуйста, загрузите текстовый файл (.txt)");
					return;
				}

				setFileName(file.name);
				const reader = new FileReader();

				reader.onload = (e) => {
					const content = e.target?.result as string;
					debouncedSetText(content);
				};

				reader.onerror = (e) => {
					console.error("Error reading file:", e);
					alert("Ошибка при чтении файла");
				};

				reader.readAsText(file);
			}
		},
		[debouncedSetText]
	);

	const handleClearFile = useCallback(() => {
		setText("");
		setFileName("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}, []);

	const handleMatrixSizeChange = useCallback(
		(type: "rows" | "cols") => (value: number | undefined) => {
			setDimensions((prev) => ({ ...prev, [type]: value }));
		},
		[]
	);

	const memoizedResults = useMemo(() => results, [results]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{
					width: "100vw",
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
					bgcolor: "background.default",
				}}
			>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6">
							Информационный анализатор нейролингвистической текстовой
							идентификации
						</Typography>
					</Toolbar>
				</AppBar>

				<Container sx={{ mt: 4, mb: 4 }}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Paper sx={{ p: 2 }}>
								<Box sx={{ mb: 2 }}>
									<Typography variant="h6" gutterBottom>
										Ввод текста
									</Typography>
									<Box
										sx={{ display: "flex", justifyContent: "space-between" }}
									>
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
												onChange={handleFileUpload}
												ref={fileInputRef}
											/>
										</Button>
										<Button
											variant="contained"
											onClick={() => setComparisonOpen(true)}
										>
											Сравнить тексты
										</Button>
										{fileName && (
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 1 }}
											>
												<Typography variant="body2" color="text.secondary">
													{fileName}
												</Typography>
												<Tooltip title="Удалить файл">
													<IconButton size="small" onClick={handleClearFile}>
														<DeleteIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											</Box>
										)}
									</Box>
									<Divider sx={{ my: 2 }} />
									<TextField
										fullWidth
										multiline
										rows={4}
										variant="outlined"
										label="Введите текст для анализа или загрузите файл"
										value={text}
										onChange={(e) => debouncedSetText(e.target.value)}
										disabled={isProcessing}
									/>
								</Box>

								<MatrixSizeInput
									rows={dimensions.rows}
									cols={dimensions.cols}
									onRowsChange={handleMatrixSizeChange("rows")}
									onColsChange={handleMatrixSizeChange("cols")}
									isProcessing={isProcessing}
								/>
								<Button
									variant="contained"
									onClick={handleAnalyze}
									disabled={!text.trim() || isProcessing}
									sx={{ mt: 2 }}
								>
									{isProcessing ? "Анализ..." : "Анализировать"}
								</Button>
							</Paper>
						</Grid>

						{memoizedResults && (
							<>
								<Grid item xs={12} md={6}>
									<TextMatrix matrix={memoizedResults.textMatrix} />
								</Grid>
								<Grid item xs={12} md={6}>
									<InformationMatrix
										matrix={memoizedResults.informationMatrix}
									/>
								</Grid>
								<Grid item xs={12} md={6}>
									<Box sx={{ color: "text.secondary" }}>
										Текущий размер кадра: {memoizedResults.textMatrix.length}×
										{memoizedResults.textMatrix[0].length}
									</Box>
								</Grid>

								<Grid item xs={12}>
									<FrequencyAnalysis data={memoizedResults.frequencyData} />
								</Grid>
								<Grid item xs={12}>
									<SpectralAnalysis
										data={memoizedResults.spectrumData}
										frequencies={memoizedResults.frequencyData}
									/>
								</Grid>
							</>
						)}
					</Grid>
				</Container>
			</Box>
			<TextComparison
				open={comparisonOpen}
				onClose={() => setComparisonOpen(false)}
				calculateResults={calculateResults}
			/>
		</ThemeProvider>
	);
}

export default App;
