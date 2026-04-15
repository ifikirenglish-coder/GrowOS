import { AbsoluteFill, useCurrentFrame } from "remotion";

export const TestComp: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#ffffff",
          fontSize: 60,
          fontFamily: "sans-serif",
          opacity: frame / 60,
        }}
      >
        GrowOS x iFikir English
      </h1>
    </AbsoluteFill>
  );
};
