import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";

function Logo({ size = "medium" }) {
  const theme = useTheme();
  
  // Determine sizes based on prop
  const sizes = {
    small: { mainFont: 20, subFont: 12 },
    medium: { mainFont: 32, subFont: 16 },
    large: { mainFont: 48, subFont: 24 }
  };
  
  const { mainFont, subFont } = sizes[size];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontSize: `${mainFont}px`,
            fontWeight: 700,
            color: theme.palette.mode === "dark" ? "#ffffff" : "#0d47a1",
            letterSpacing: "0.5px",
            lineHeight: 1,
          }}
        >
          COHERENT
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: '"Arial", "Helvetica", sans-serif',
          fontSize: `${subFont}px`,
          fontWeight: 400,
          color: theme.palette.mode === "dark" ? "#e0e0e0" : "#0a0a1a",
          letterSpacing: "1px",
          marginTop: "4px",
          textAlign: "center",
        }}
      >
        MARKET INSIGHTS
      </Typography>
    </Box>
  );
}

export default Logo;

