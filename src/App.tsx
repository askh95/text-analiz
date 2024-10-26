// src/App.tsx
import { useState } from "react";
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
} from "@mui/material";
import { TextMatrix } from "./component/TextMatrix/TextMatrix";
import { FrequencyAnalysis } from "./component/FrequencyAnalysis/FrequencyAnalysis";
import { InformationMatrix } from "./component/InformationMatrix/InformationMatrix";
import { SpectralAnalysis } from "./component/SpectralAnalysis/SpectralAnalysis";
import {
	createTextMatrix,
	calculateFrequencies,
	calculateSpectrum,
} from "./utils/matrix";
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

	const handleAnalyze = () => {
		if (!text.trim() || isProcessing) return;

		setIsProcessing(true);

		try {
			const textMatrix = createTextMatrix(text);
			const frequencyData = calculateFrequencies(text);

			// Создаем информационную матрицу
			const informationMatrix = textMatrix.map((row) =>
				row.map((char) => frequencyData[char]?.information || 0)
			);

			// Создаем последовательности для спектрального анализа
			const rowSequence = informationMatrix.flat();
			const columnSequence = informationMatrix[0]
				.map((_, colIndex) => informationMatrix.map((row) => row[colIndex]))
				.flat();

			setResults({
				textMatrix,
				informationMatrix,
				frequencyData,
				spectrumData: {
					rowSpectrum: calculateSpectrum(rowSequence),
					columnSpectrum: calculateSpectrum(columnSequence),
				},
			});
		} catch (error) {
			console.error("Error analyzing text:", error);
			// Здесь можно добавить отображение ошибки пользователю
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
			>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6">Анализатор текста</Typography>
					</Toolbar>
				</AppBar>

				<Container sx={{ mt: 4, mb: 4 }}>
					<Grid container spacing={3}>
						{/* Ввод текста */}
						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								rows={4}
								variant="outlined"
								label="Введите текст для анализа"
								value={text}
								onChange={(e) => setText(e.target.value)}
								disabled={isProcessing}
							/>
							<Box sx={{ mt: 2 }}>
								<Button
									variant="contained"
									onClick={handleAnalyze}
									disabled={!text.trim() || isProcessing}
								>
									{isProcessing ? "Анализ..." : "Анализировать"}
								</Button>
							</Box>
						</Grid>

						{/* Результаты анализа */}
						{results && (
							<>
								<Grid item xs={12} md={6}>
									<TextMatrix matrix={results.textMatrix} />
								</Grid>

								<Grid item xs={12} md={6}>
									<InformationMatrix matrix={results.informationMatrix} />
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
