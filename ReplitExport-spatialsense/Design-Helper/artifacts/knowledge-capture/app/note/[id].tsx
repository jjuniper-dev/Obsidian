import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteCard } from "@/components/NoteCard";
import { useVault } from "@/context/VaultContext";
import { useColors } from "@/hooks/useColors";

const TAG_COLORS = {
  blue: { bg: "tagBlue", fg: "tagBlueForeground" },
  green: { bg: "tagGreen", fg: "tagGreenForeground" },
  purple: { bg: "tagPurple", fg: "tagPurpleForeground" },
  orange: { bg: "tagOrange", fg: "tagOrangeForeground" },
} as const;

export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getNote, deleteNote, notes, linkNotes, getLinkedNotes } = useVault();
  const [showLinkPicker, setShowLinkPicker] = useState(false);

  const note = getNote(id ?? "");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!note) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingTop: topPad + 60 },
        ]}
      >
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>
          Note not found
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  const linkedNotes = getLinkedNotes(note.id);
  const linkableNotes = notes.filter(
    (n) => n.id !== note.id && !note.linkedNoteIds.includes(n.id)
  );

  const handleDelete = () => {
    if (Platform.OS === "web") {
      deleteNote(note.id);
      router.back();
      return;
    }
    Alert.alert("Delete Note", "This will permanently remove this note.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
          await deleteNote(note.id);
          router.back();
        },
      },
    ]);
  };

  const handleLink = async (targetId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await linkNotes(note.id, targetId);
    setShowLinkPicker(false);
  };

  return (
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
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setShowLinkPicker(!showLinkPicker)}
            hitSlop={10}
          >
            <MaterialCommunityIcons
              name="link-variant-plus"
              size={22}
              color={colors.primary}
            />
          </Pressable>
          <Pressable onPress={handleDelete} hitSlop={10}>
            <Feather name="trash-2" size={20} color={colors.destructive} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomPad + 40 },
        ]}
      >
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {note.title}
          </Text>
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {new Date(note.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · {note.type}
          </Text>
        </View>

        {note.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {note.tags.map((tag) => {
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
        )}

        {note.summary && (
          <View
            style={[
              styles.summaryBox,
              {
                backgroundColor: colors.secondary,
                borderRadius: colors.radius,
                borderLeftColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[styles.summaryLabel, { color: colors.mutedForeground }]}
            >
              SUMMARY
            </Text>
            <Text style={[styles.summaryText, { color: colors.foreground }]}>
              {note.summary}
            </Text>
          </View>
        )}

        {note.sourceUrl && (
          <View
            style={[
              styles.sourceBox,
              {
                backgroundColor: colors.muted,
                borderRadius: colors.radius - 4,
              },
            ]}
          >
            <Feather name="globe" size={13} color={colors.mutedForeground} />
            <Text
              style={[styles.sourceText, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {note.sourceUrl}
            </Text>
          </View>
        )}

        <Text style={[styles.contentText, { color: colors.foreground }]}>
          {note.content}
        </Text>

        {showLinkPicker && linkableNotes.length > 0 && (
          <View
            style={[
              styles.linkPicker,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text
              style={[styles.linkPickerLabel, { color: colors.mutedForeground }]}
            >
              LINK TO NOTE
            </Text>
            {linkableNotes.map((n) => (
              <Pressable
                key={n.id}
                onPress={() => handleLink(n.id)}
                style={[styles.linkItem, { borderBottomColor: colors.border }]}
              >
                <Text style={[styles.linkItemText, { color: colors.foreground }]}>
                  {n.title}
                </Text>
                <Feather name="link" size={14} color={colors.primary} />
              </Pressable>
            ))}
          </View>
        )}

        {linkedNotes.length > 0 && (
          <View style={styles.linkedSection}>
            <Text
              style={[styles.linkedLabel, { color: colors.mutedForeground }]}
            >
              LINKED NOTES
            </Text>
            {linkedNotes.map((ln) => (
              <NoteCard key={ln.id} note={ln} compact />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  notFound: { fontSize: 16, fontFamily: "Inter_400Regular" },
  backLink: { fontSize: 16, fontFamily: "Inter_500Medium" },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerActions: { flexDirection: "row", gap: 20 },
  scroll: { padding: 20, gap: 18 },
  titleSection: { gap: 6 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    lineHeight: 32,
  },
  meta: { fontSize: 13, fontFamily: "Inter_400Regular" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  summaryBox: {
    padding: 14,
    borderLeftWidth: 3,
    gap: 6,
  },
  summaryLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  summaryText: { fontSize: 14, lineHeight: 22, fontFamily: "Inter_400Regular" },
  sourceBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sourceText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1 },
  contentText: {
    fontSize: 15,
    lineHeight: 25,
    fontFamily: "Inter_400Regular",
  },
  linkPicker: { padding: 14, borderWidth: 1, gap: 10 },
  linkPickerLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  linkItemText: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1, marginRight: 8 },
  linkedSection: { gap: 10 },
  linkedLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
});
