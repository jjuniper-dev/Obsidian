import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

type Props = {
  content: string;
};

export function MarkdownViewer({ content }: Props) {
  const colors = useColors();

  const renderLines = () => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("# ")) {
        return (
          <Text key={i} style={[styles.h1, { color: colors.foreground }]}>
            {line.slice(2)}
          </Text>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <Text key={i} style={[styles.h2, { color: colors.foreground }]}>
            {line.slice(3)}
          </Text>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <Text key={i} style={[styles.h3, { color: colors.foreground }]}>
            {line.slice(4)}
          </Text>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <View key={i} style={styles.bulletRow}>
            <View
              style={[styles.bullet, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.body, { color: colors.foreground }]}>
              {line.slice(2)}
            </Text>
          </View>
        );
      }
      if (line.startsWith("> ")) {
        return (
          <View
            key={i}
            style={[
              styles.blockquote,
              { borderLeftColor: colors.primary, backgroundColor: colors.secondary },
            ]}
          >
            <Text style={[styles.body, { color: colors.mutedForeground }]}>
              {line.slice(2)}
            </Text>
          </View>
        );
      }
      if (line.startsWith("```")) {
        return null;
      }
      if (line === "") {
        return <View key={i} style={styles.spacer} />;
      }
      return (
        <Text key={i} style={[styles.body, { color: colors.foreground }]}>
          {line}
        </Text>
      );
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {renderLines()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, gap: 4 },
  h1: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
    marginTop: 12,
  },
  h2: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
    marginTop: 10,
  },
  h3: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
    marginTop: 8,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: "Inter_400Regular",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingLeft: 4,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 9,
    flexShrink: 0,
  },
  blockquote: {
    paddingLeft: 12,
    paddingVertical: 8,
    borderLeftWidth: 3,
    borderRadius: 4,
    paddingRight: 8,
  },
  spacer: { height: 6 },
});
