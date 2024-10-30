import { useState, useRef } from "react";
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
import { createTextMatrix, calculateFrequencies } from "./utils";
import { AnalysisResults } from "./types";

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
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleAnalyze = () => {
		if (!text.trim() || isProcessing) return;
		setIsProcessing(true);

		try {
			const textMatrix = createTextMatrix(text);
			const frequencyData = calculateFrequencies(text);

			const informationMatrix = textMatrix.map((row) =>
				row.map((char) => frequencyData[char]?.information || 0)
			);

			const rowSequence = informationMatrix.map((row) =>
				row.reduce((sum, val) => sum + val, 0)
			);

			const columnSequence = Array(informationMatrix[0].length)
				.fill(0)
				.map((_, colIndex) =>
					informationMatrix.reduce((sum, row) => sum + (row[colIndex] || 0), 0)
				);

			setResults({
				textMatrix,
				informationMatrix,
				frequencyData,
				spectrumData: {
					rowSpectrum: rowSequence.map((value, index) => ({
						index,
						value: value / informationMatrix[0].length,
					})),
					columnSpectrum: columnSequence.map((value, index) => ({
						index,
						value: value / informationMatrix.length,
					})),
				},
			});
		} catch (error) {
			console.error("Error analyzing text:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
				setText(content);
			};

			reader.onerror = (e) => {
				console.error("Error reading file:", e);
				alert("Ошибка при чтении файла");
			};

			reader.readAsText(file);
		}
	};

	const handleClearFile = () => {
		setText("");
		setFileName("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

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
							Информационный анализатор нейролингвистический текстовой
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
												onChange={handleFileUpload}
												ref={fileInputRef}
											/>
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
										onChange={(e) => setText(e.target.value)}
										disabled={isProcessing}
									/>
								</Box>
								<Button
									variant="contained"
									onClick={handleAnalyze}
									disabled={!text.trim() || isProcessing}
								>
									{isProcessing ? "Анализ..." : "Анализировать"}
								</Button>
							</Paper>
						</Grid>

						{results && (
							<>
								<Grid item xs={12} md={6}>
									<TextMatrix matrix={results.textMatrix} />
								</Grid>
								<Grid item xs={12} md={6}>
									<InformationMatrix matrix={results.informationMatrix} />
								</Grid>
								<Grid xs={12} md={6} sx={{ pl: 3, pt: 1 }}>
									<Box sx={{ color: "text.secondary" }}>
										Размер матрицы:{" "}
										<Box
											component="span"
											sx={{
												color: "text.primary",
												fontWeight: 600,
											}}
										>
											{`${results.textMatrix.length}×${results.textMatrix[0].length}`}
										</Box>
									</Box>
								</Grid>
								<Grid item xs={12}>
									<FrequencyAnalysis data={results.frequencyData} />
								</Grid>
								<Grid item xs={12}>
									<SpectralAnalysis data={results.spectrumData} />
								</Grid>
							</>
						)}
					</Grid>
				</Container>
			</Box>
		</ThemeProvider>
	);
}

export default App;
