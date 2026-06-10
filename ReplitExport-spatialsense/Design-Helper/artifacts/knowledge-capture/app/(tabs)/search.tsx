import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NoteCard } from "@/components/NoteCard";
import { useVault } from "@/context/VaultContext";
import { useColors } from "@/hooks/useColors";

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { searchNotes, getAllTags, getNotesByTag } = useVault();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const allTags = getAllTags();

  const results = activeTag
    ? getNotesByTag(activeTag)
    : query.trim()
    ? searchNotes(query)
    : [];

  const TAG_COLORS = {
    blue: { bg: "tagBlue", fg: "tagBlueForeground" },
    green: { bg: "tagGreen", fg: "tagGreenForeground" },
    purple: { bg: "tagPurple", fg: "tagPurpleForeground" },
    orange: { bg: "tagOrange", fg: "tagOrangeForeground" },
  } as const;

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Search
        </Text>
      </View>

      <View style={[styles.searchWrap, { paddingHorizontal: 16 }]}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search notes, tags, content..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setActiveTag(null);
            }}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Feather
              name="x"
              size={16}
              color={colors.mutedForeground}
              onPress={() => setQuery("")}
            />
          )}
        </View>
      </View>

      {allTags.length > 0 && (
        <View style={styles.tagSection}>
          <Text style={[styles.tagLabel, { color: colors.mutedForeground }]}>
            Filter by tag
          </Text>
          <FlatList
            horizontal
            data={allTags}
            keyExtractor={(t) => t.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagList}
            renderItem={({ item }) => {
              const colorKey = TAG_COLORS[item.color];
              const isActive = activeTag === item.label;
              return (
                <View
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: isActive
                        ? colors.primary
                        : (colors as any)[colorKey.bg],
                      borderRadius: colors.radius - 4,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagChipText,
                      {
                        color: isActive
                          ? colors.primaryForeground
                          : (colors as any)[colorKey.fg],
                      },
                    ]}
                    onPress={() =>
                      setActiveTag(isActive ? null : item.label)
                    }
                  >
                    {item.label}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            {query.trim() || activeTag ? (
              <>
                <Feather name="search" size={36} color={colors.mutedForeground} />
                <Text
                  style={[styles.emptyTitle, { color: colors.foreground }]}
                >
                  No results found
                </Text>
                <Text
                  style={[styles.emptySub, { color: colors.mutedForeground }]}
                >
                  Try different keywords or tags
                </Text>
              </>
            ) : (
              <>
                <Feather name="compass" size={36} color={colors.mutedForeground} />
                <Text
                  style={[styles.emptyTitle, { color: colors.foreground }]}
                >
                  Query your knowledge
                </Text>
                <Text
                  style={[styles.emptySub, { color: colors.mutedForeground }]}
                >
                  Search across all notes, tags, and content
                </Text>
              </>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  searchWrap: { paddingTop: 14, paddingBottom: 8 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  tagSection: { paddingLeft: 16, paddingBottom: 12, gap: 8 },
  tagLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  tagList: { paddingRight: 16, gap: 8 },
  tagChip: { paddingHorizontal: 12, paddingVertical: 6 },
  tagChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  empty: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
