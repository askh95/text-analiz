// src/components/SpectralAnalysis/SpectralAnalysis.tsx
import React from "react";
import { Box } from "@mui/material";
import { SpectrumData } from "../../types";
import { SpectralGraphs } from "./SpectralGraphs";
import { Enhanced3DVisualization } from "./Spectral3DVisualization";
import { CorrelationAnalysis } from "./CorrelationAnalysis";

interface SpectralAnalysisProps {
	data: SpectrumData;
}

export const SpectralAnalysis: React.FC<SpectralAnalysisProps> = ({ data }) => {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<SpectralGraphs data={data} />
			<Enhanced3DVisualization data={data} />
			<CorrelationAnalysis data={data} />
		</Box>
	);
};
