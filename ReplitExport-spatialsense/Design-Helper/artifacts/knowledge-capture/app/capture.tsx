import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TagPicker } from "@/components/TagPicker";
import { useVault } from "@/context/VaultContext";
import { useColors } from "@/hooks/useColors";
import { CaptureType, Note, Tag } from "@/types";

const TYPE_OPTIONS: { type: CaptureType; icon: any; label: string }[] = [
  { type: "text", icon: "file-text", label: "Note" },
  { type: "webclip", icon: "globe", label: "Web Clip" },
  { type: "voice", icon: "mic", label: "Voice" },
];

function generateMarkdown(title: string, content: string, tags: Tag[], type: CaptureType, sourceUrl?: string): string {
  const tagStr = tags.map((t) => `#${t.label}`).join(" ");
  const lines = [
    `# ${title}`,
    ``,
    `> **Type:** ${type}  `,
    tagStr ? `> **Tags:** ${tagStr}` : null,
    sourceUrl ? `> **Source:** ${sourceUrl}` : null,
    ``,
    `## Content`,
    ``,
    content,
    ``,
    `## Summary`,
    ``,
    `> ${content.split(". ")[0]}.`,
  ].filter((l) => l !== null);
  return lines.join("\n");
}

export default function CaptureScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addNote } = useVault();

  const [captureType, setCaptureType] = useState<CaptureType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [step, setStep] = useState<"input" | "preview">("input");
  const [saving, setSaving] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const markdown = generateMarkdown(title, content, tags, captureType, sourceUrl || undefined);

  const summary =
    content.length > 0
      ? content.split(". ").slice(0, 2).join(". ") + "."
      : "";

  const canPreview = title.trim().length > 0 && content.trim().length > 0;

  const handleSave = async () => {
    if (!canPreview) return;
    setSaving(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addNote({
      type: captureType,
      title: title.trim(),
      content: content.trim(),
      summary,
      tags,
      sourceUrl: sourceUrl.trim() || undefined,
      linkedNoteIds: [],
    });
    setSaving(false);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.headerBar,
            {
              paddingTop: topPad + 12,
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Pressable onPress={() => (step === "preview" ? setStep("input") : router.back())} hitSlop={10}>
            <Feather name="x" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            {step === "input" ? "Capture" : "Preview"}
          </Text>
          {step === "input" ? (
            <Pressable
              onPress={() => canPreview && setStep("preview")}
              disabled={!canPreview}
            >
              <Text
                style={[
                  styles.headerAction,
                  {
                    color: canPreview ? colors.primary : colors.mutedForeground,
                  },
                ]}
              >
                Preview
              </Text>
            </Pressable>
          ) : (
            <Pressable onPress={handleSave} disabled={saving}>
              <Text
                style={[
                  styles.headerAction,
                  { color: saving ? colors.mutedForeground : colors.primary },
                ]}
              >
                {saving ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          )}
        </View>

        {step === "input" ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.form,
              { paddingBottom: bottomPad + 40 },
            ]}
          >
            <View style={styles.typeRow}>
              {TYPE_OPTIONS.map((opt) => {
                const active = captureType === opt.type;
                return (
                  <Pressable
                    key={opt.type}
                    onPress={() => setCaptureType(opt.type)}
                    style={[
                      styles.typeBtn,
                      {
                        backgroundColor: active
                          ? colors.primary
                          : colors.card,
                        borderColor: active ? colors.primary : colors.border,
                        borderRadius: colors.radius - 4,
                      },
                    ]}
                  >
                    <Feather
                      name={opt.icon}
                      size={16}
                      color={
                        active ? colors.primaryForeground : colors.mutedForeground
                      }
                    />
                    <Text
                      style={[
                        styles.typeBtnText,
                        {
                          color: active
                            ? colors.primaryForeground
                            : colors.mutedForeground,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                Title
              </Text>
              <TextInput
                style={[
                  styles.titleInput,
                  {
                    color: colors.foreground,
                    borderBottomColor: colors.border,
                  },
                ]}
                value={title}
                onChangeText={setTitle}
                placeholder="What's this about?"
                placeholderTextColor={colors.mutedForeground}
                returnKeyType="next"
              />
            </View>

            {captureType === "webclip" && (
              <View style={styles.field}>
                <Text
                  style={[styles.fieldLabel, { color: colors.mutedForeground }]}
                >
                  Source URL
                </Text>
                <TextInput
                  style={[
                    styles.urlInput,
                    {
                      backgroundColor: colors.muted,
                      color: colors.foreground,
                      borderRadius: colors.radius - 4,
                    },
                  ]}
                  value={sourceUrl}
                  onChangeText={setSourceUrl}
                  placeholder="https://..."
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                {captureType === "voice" ? "Transcription / Notes" : "Content"}
              </Text>
              <TextInput
                style={[
                  styles.contentInput,
                  {
                    backgroundColor: colors.card,
                    color: colors.foreground,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
                value={content}
                onChangeText={setContent}
                placeholder={
                  captureType === "text"
                    ? "Write your idea, thought, or article..."
                    : captureType === "webclip"
                    ? "Paste or type the key content from this page..."
                    : "Transcription or notes from your voice..."
                }
                placeholderTextColor={colors.mutedForeground}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                Tags
              </Text>
              <TagPicker tags={tags} onTagsChange={setTags} />
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.preview,
              { paddingBottom: bottomPad + 40 },
            ]}
          >
            <View
              style={[
                styles.previewCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <View style={styles.previewHeaderRow}>
                <Text
                  style={[
                    styles.previewSection,
                    { color: colors.mutedForeground },
                  ]}
                >
                  STRUCTURED MARKDOWN
                </Text>
                <Feather
                  name="file-text"
                  size={14}
                  color={colors.mutedForeground}
                />
              </View>
              <Text
                style={[styles.markdownCode, { color: colors.foreground }]}
              >
                {markdown}
              </Text>
            </View>

            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.secondary,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <Text
                style={[
                  styles.summaryLabel,
                  { color: colors.mutedForeground },
                ]}
              >
                AI SUMMARY
              </Text>
              <Text style={[styles.summaryText, { color: colors.foreground }]}>
                {summary}
              </Text>
            </View>

            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.primary,
                  borderRadius: colors.radius,
                  opacity: saving ? 0.7 : 1,
                },
              ]}
            >
              <Feather
                name="save"
                size={18}
                color={colors.primaryForeground}
              />
              <Text
                style={[
                  styles.saveBtnText,
                  { color: colors.primaryForeground },
                ]}
              >
                {saving ? "Saving to Vault..." : "Save to Vault"}
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  headerAction: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  form: { padding: 20, gap: 24 },
  typeRow: { flexDirection: "row", gap: 10 },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
  },
  typeBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  field: { gap: 8 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  titleInput: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  urlInput: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  contentInput: {
    minHeight: 140,
    padding: 14,
    fontSize: 15,
    lineHeight: 23,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
  },
  preview: { padding: 16, gap: 16 },
  previewCard: { padding: 16, borderWidth: 1, gap: 10 },
  previewHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewSection: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  markdownCode: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },
  summaryCard: { padding: 16, gap: 8 },
  summaryLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  summaryText: { fontSize: 15, lineHeight: 23, fontFamily: "Inter_400Regular" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  saveBtnText: { fontSize: 16, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
});
