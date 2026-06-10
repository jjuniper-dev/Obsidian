import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { Note } from "@/types";

type Props = {
  note: Note;
  compact?: boolean;
};

const TYPE_ICONS = {
  text: "file-text",
  webclip: "globe",
  voice: "mic",
} as const;

const TAG_COLORS = {
  blue: { bg: "tagBlue", fg: "tagBlueForeground" },
  green: { bg: "tagGreen", fg: "tagGreenForeground" },
  purple: { bg: "tagPurple", fg: "tagPurpleForeground" },
  orange: { bg: "tagOrange", fg: "tagOrangeForeground" },
} as const;

export function NoteCard({ note, compact = false }: Props) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d}d ago`;
    if (h > 0) return `${h}h ago`;
    if (m > 0) return `${m}m ago`;
    return "just now";
  };

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={() => router.push(`/note/${note.id}`)}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View style={styles.header}>
            <View
              style={[
                styles.typeIcon,
                { backgroundColor: colors.secondary, borderRadius: 8 },
              ]}
            >
              <Feather
                name={TYPE_ICONS[note.type]}
                size={14}
                color={colors.primary}
              />
            </View>
            <Text
              style={[styles.title, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {note.title}
            </Text>
            <Text style={[styles.time, { color: colors.mutedForeground }]}>
              {timeAgo(note.createdAt)}
            </Text>
          </View>

          {!compact && (
            <Text
              style={[styles.summary, { color: colors.mutedForeground }]}
              numberOfLines={2}
            >
              {note.summary}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.tags}>
              {note.tags.slice(0, 3).map((tag) => {
                const colorKey = TAG_COLORS[tag.color];
                return (
                  <View
                    key={tag.id}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: (colors as any)[colorKey.bg],
                        borderRadius: 6,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: (colors as any)[colorKey.fg] },
                      ]}
                    >
                      {tag.label}
                    </Text>
                  </View>
                );
              })}
            </View>
            {note.linkedNoteIds.length > 0 && (
              <View style={styles.linksRow}>
                <MaterialCommunityIcons
                  name="link-variant"
                  size={13}
                  color={colors.mutedForeground}
                />
                <Text
                  style={[styles.linksText, { color: colors.mutedForeground }]}
                >
                  {note.linkedNoteIds.length}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  time: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  summary: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Inter_400Regular",
    paddingLeft: 36,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 36,
  },
  tags: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
  },
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  linksText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
