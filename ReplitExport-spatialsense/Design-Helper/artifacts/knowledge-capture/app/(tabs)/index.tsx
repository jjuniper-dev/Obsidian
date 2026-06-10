import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FloatingCapture } from "@/components/FloatingCapture";
import { NoteCard } from "@/components/NoteCard";
import { useVault } from "@/context/VaultContext";
import { useColors } from "@/hooks/useColors";

export default function VaultScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notes, stats, isLoading } = useVault();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.statsRow}>
        <StatBox label="Notes" value={stats.totalNotes} colors={colors} />
        <StatBox label="Tags" value={stats.totalTags} colors={colors} />
        <StatBox label="Links" value={Math.floor(stats.totalLinks)} colors={colors} />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingTop: topPad },
        ]}
      >
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
          Loading vault...
        </Text>
      </View>
    );
  }

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
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Vault
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {notes.length} notes captured
          </Text>
        </View>
        <Feather name="book-open" size={22} color={colors.primary} />
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.mutedForeground} />
            <Text
              style={[styles.emptyTitle, { color: colors.foreground }]}
            >
              Vault is empty
            </Text>
            <Text
              style={[styles.emptySub, { color: colors.mutedForeground }]}
            >
              Capture your first idea to get started
            </Text>
          </View>
        }
      />

      <FloatingCapture onPress={() => router.push("/capture")} />
    </View>
  );
}

function StatBox({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.statBox,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <Text style={[styles.statValue, { color: colors.primary }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  list: { paddingHorizontal: 16, paddingTop: 16 },
  listHeader: { marginBottom: 16 },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  emptySub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
