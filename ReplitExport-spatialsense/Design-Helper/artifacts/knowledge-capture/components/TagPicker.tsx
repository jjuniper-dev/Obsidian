import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Tag } from "@/types";

type Props = {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
};

const COLOR_OPTIONS: Tag["color"][] = ["blue", "green", "purple", "orange"];

const TAG_COLORS = {
  blue: { bg: "tagBlue", fg: "tagBlueForeground" },
  green: { bg: "tagGreen", fg: "tagGreenForeground" },
  purple: { bg: "tagPurple", fg: "tagPurpleForeground" },
  orange: { bg: "tagOrange", fg: "tagOrangeForeground" },
} as const;

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function TagPicker({ tags, onTagsChange }: Props) {
  const colors = useColors();
  const [input, setInput] = useState("");
  const [selectedColor, setSelectedColor] = useState<Tag["color"]>("blue");

  const addTag = () => {
    const label = input.trim();
    if (!label) return;
    if (tags.some((t) => t.label.toLowerCase() === label.toLowerCase())) {
      setInput("");
      return;
    }
    onTagsChange([
      ...tags,
      { id: generateId(), label, color: selectedColor },
    ]);
    setInput("");
  };

  const removeTag = (id: string) => {
    onTagsChange(tags.filter((t) => t.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.existing}>
        {tags.map((tag) => {
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
                style={[styles.tagText, { color: (colors as any)[colorKey.fg] }]}
              >
                {tag.label}
              </Text>
              <Pressable onPress={() => removeTag(tag.id)} hitSlop={8}>
                <Feather
                  name="x"
                  size={12}
                  color={(colors as any)[colorKey.fg]}
                />
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.muted,
              color: colors.foreground,
              borderRadius: colors.radius - 4,
            },
          ]}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addTag}
          placeholder="Add tag..."
          placeholderTextColor={colors.mutedForeground}
          returnKeyType="done"
          autoCapitalize="none"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.colorPicker}
          contentContainerStyle={styles.colorPickerContent}
        >
          {COLOR_OPTIONS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setSelectedColor(c)}
              style={[
                styles.colorDot,
                {
                  backgroundColor: (colors as any)[TAG_COLORS[c].bg],
                  borderWidth: selectedColor === c ? 2 : 0,
                  borderColor: (colors as any)[TAG_COLORS[c].fg],
                  borderRadius: 8,
                },
              ]}
            />
          ))}
        </ScrollView>
        <Pressable
          onPress={addTag}
          style={[
            styles.addBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: colors.radius - 4,
            },
          ]}
        >
          <Feather name="plus" size={18} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  existing: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  tagText: { fontSize: 12, fontWeight: "500", fontFamily: "Inter_500Medium" },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  colorPicker: { flexShrink: 1, maxWidth: 100 },
  colorPickerContent: { flexDirection: "row", gap: 6, alignItems: "center" },
  colorDot: { width: 22, height: 22 },
  addBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
