import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVault } from "@/context/VaultContext";
import { useColors } from "@/hooks/useColors";
import { Note } from "@/types";

const { width: SCREEN_W } = Dimensions.get("window");
const CANVAS_SIZE = Math.min(SCREEN_W - 32, 360);

type NodePosition = {
  note: Note;
  x: number;
  y: number;
};

function GraphView({ notes }: { notes: Note[] }) {
  const colors = useColors();
  const cx = CANVAS_SIZE / 2;
  const cy = CANVAS_SIZE / 2;
  const radius = CANVAS_SIZE * 0.38;

  const positions = useMemo<NodePosition[]>(() => {
    return notes.map((note, i) => {
      if (notes.length === 1) {
        return { note, x: cx, y: cy };
      }
      const angle = (2 * Math.PI * i) / notes.length - Math.PI / 2;
      return {
        note,
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  }, [notes, cx, cy, radius]);

  const posMap = useMemo(() => {
    const map = new Map<string, NodePosition>();
    positions.forEach((p) => map.set(p.note.id, p));
    return map;
  }, [positions]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const result: { x1: number; y1: number; x2: number; y2: number }[] = [];
    notes.forEach((note) => {
      note.linkedNoteIds.forEach((targetId) => {
        const key = [note.id, targetId].sort().join("--");
        if (!seen.has(key)) {
          seen.add(key);
          const from = posMap.get(note.id);
          const to = posMap.get(targetId);
          if (from && to) {
            result.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
          }
        }
      });
    });
    return result;
  }, [notes, posMap]);

  return (
    <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
      {edges.map((e, i) => (
        <Line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={colors.border}
          strokeWidth={1.5}
          strokeDasharray="4,4"
        />
      ))}
      {positions.map((pos) => (
        <React.Fragment key={pos.note.id}>
          <Circle
            cx={pos.x}
            cy={pos.y}
            r={pos.note.linkedNoteIds.length > 0 ? 18 : 14}
            fill={colors.primary}
            opacity={0.9}
          />
          <Circle
            cx={pos.x}
            cy={pos.y}
            r={pos.note.linkedNoteIds.length > 0 ? 18 : 14}
            fill="none"
            stroke={colors.accent}
            strokeWidth={pos.note.linkedNoteIds.length > 1 ? 2 : 0}
          />
          <SvgText
            x={pos.x}
            y={pos.y + (pos.note.linkedNoteIds.length > 0 ? 18 : 14) + 13}
            textAnchor="middle"
            fill={colors.foreground}
            fontSize={10}
            fontFamily="Inter_500Medium"
          >
            {pos.note.title.length > 14
              ? pos.note.title.slice(0, 14) + "..."
              : pos.note.title}
          </SvgText>
        </React.Fragment>
      ))}
    </Svg>
  );
}

function GraphNoteItem({ note }: { note: Note }) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => router.push(`/note/${note.id}`)}
        style={[
          styles.graphNoteItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Text style={[styles.graphNoteTitle, { color: colors.foreground }]} numberOfLines={1}>
          {note.title}
        </Text>
        <Text style={[styles.graphNoteLinks, { color: colors.mutedForeground }]}>
          {note.linkedNoteIds.length} connection{note.linkedNoteIds.length !== 1 ? "s" : ""}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function GraphScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notes } = useVault();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const connectedNotes = notes.filter((n) => n.linkedNoteIds.length > 0);
  const allGraphNotes = notes;

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
            Knowledge Graph
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {connectedNotes.length} linked nodes
          </Text>
        </View>
        <Feather name="share-2" size={22} color={colors.primary} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Platform.OS === "web" ? 34 : 100 },
        ]}
      >
        {notes.length > 0 ? (
          <>
            <View
              style={[
                styles.graphCanvas,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <GraphView notes={allGraphNotes} />
            </View>

            <Text
              style={[styles.sectionLabel, { color: colors.mutedForeground }]}
            >
              ALL NODES
            </Text>
            <View style={styles.nodeList}>
              {allGraphNotes.map((note) => (
                <GraphNoteItem key={note.id} note={note} />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <Feather name="share-2" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Graph is empty
            </Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              Capture notes and link them to build your knowledge graph
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    fontSize: 28,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  scroll: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  graphCanvas: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginTop: 8,
  },
  nodeList: { gap: 8 },
  graphNoteItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
  },
  graphNoteTitle: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  graphNoteLinks: { fontSize: 12, fontFamily: "Inter_400Regular" },
  empty: { alignItems: "center", paddingTop: 80, gap: 10 },
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
    paddingHorizontal: 40,
  },
});
