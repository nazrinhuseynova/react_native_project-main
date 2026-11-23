import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, View, useWindowDimensions } from 'react-native';

import { makeStyles } from '@/shared/theme/makeStyles';
import { AppText } from '@/shared/ui/AppText';

import { gestureRegistry } from '../../application/gestures/gestureRegistry';
import type {
  GestureActions,
  GestureStrategy,
  HudInfo,
  TapSide,
} from '../../application/gestures/GestureStrategy';

const DOUBLE_TAP_MS = 280;
const HUD_HIDE_MS = 700;
const PAN_ACTIVATION_PX = 12;
const TAP_SLOP_PX = 10;

const useStyles = makeStyles(({ colors, spacing, radius }) => ({
  row: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row' as const,
  },
  zone: { flex: 1 },
  hud: {
    position: 'absolute' as const,
    alignSelf: 'center' as const,
    top: '38%',
    minWidth: 120,
    alignItems: 'center' as const,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.scrim,
  },
  hudBar: { marginTop: spacing.sm, height: 4, width: 96, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.28)' },
  hudFill: { height: 4, borderRadius: 2, backgroundColor: colors.text },
}));

type LayerActions = Omit<GestureActions, 'showHud'>;

type GestureLayerProps = {
  actions: LayerActions;
  onToggleControls: () => void;
};

type ZoneProps = {
  side: TapSide;
  strategies: GestureStrategy[];
  actionsRef: React.RefObject<GestureActions>;
  onToggleControls: () => void;
};

function GestureZone({ side, strategies, actionsRef, onToggleControls }: ZoneProps) {
  const styles = useStyles();
  const { height } = useWindowDimensions();
  const heightRef = useRef(height);
  heightRef.current = height;
  const toggleRef = useRef(onToggleControls);
  toggleRef.current = onToggleControls;

  const pan = useMemo(() => {
    const panStrategies = strategies.filter((item) => item.onPanMove);
    const tapStrategies = strategies.filter((item) => item.onDoubleTap);
    const startValues = new Map<string, number>();
    let panning = false;
    let lastTapAt = 0;
    let tapTimer: ReturnType<typeof setTimeout> | null = null;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const actions = actionsRef.current;
        if (!actions) return;
        if (
          !panning &&
          Math.abs(gesture.dy) > PAN_ACTIVATION_PX &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx)
        ) {
          panning = true;
          panStrategies.forEach((item) => startValues.set(item.id, item.onPanStart?.(actions) ?? 0));
        }
        if (panning) {
          const delta = -gesture.dy / heightRef.current;
          panStrategies.forEach((item) => item.onPanMove?.(startValues.get(item.id) ?? 0, delta, actions));
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const actions = actionsRef.current;
        if (!actions) return;
        if (panning) {
          panning = false;
          panStrategies.forEach((item) => item.onPanEnd?.(actions));
          return;
        }
        if (Math.abs(gesture.dx) > TAP_SLOP_PX || Math.abs(gesture.dy) > TAP_SLOP_PX) return;

        const now = Date.now();
        if (now - lastTapAt < DOUBLE_TAP_MS) {
          lastTapAt = 0;
          if (tapTimer) clearTimeout(tapTimer);
          tapStrategies.forEach((item) => item.onDoubleTap?.(side, actions));
        } else {
          lastTapAt = now;
          tapTimer = setTimeout(() => toggleRef.current(), DOUBLE_TAP_MS);
        }
      },
      onPanResponderTerminate: () => {
        const actions = actionsRef.current;
        if (panning && actions) panStrategies.forEach((item) => item.onPanEnd?.(actions));
        panning = false;
      },
    });
  }, [strategies, side, actionsRef]);

  return <View {...pan.panHandlers} style={styles.zone} />;
}

export function GestureLayer({ actions, onToggleControls }: GestureLayerProps) {
  const styles = useStyles();
  const [hud, setHud] = useState<HudInfo | null>(null);
  const hudTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionsRef = useRef<GestureActions>(null as unknown as GestureActions);

  const showHud = useCallback((next: HudInfo | null) => {
    if (hudTimer.current) clearTimeout(hudTimer.current);
    setHud(next);
    if (next) hudTimer.current = setTimeout(() => setHud(null), HUD_HIDE_MS);
  }, []);

  actionsRef.current = { ...actions, showHud };

  useEffect(
    () => () => {
      if (hudTimer.current) clearTimeout(hudTimer.current);
    },
    [],
  );

  const all = gestureRegistry.all();
  const left = useMemo(() => all.filter((item) => item.zone === 'full' || item.zone === 'left'), [all]);
  const right = useMemo(() => all.filter((item) => item.zone === 'full' || item.zone === 'right'), [all]);

  return (
    <>
      <View style={styles.row}>
        <GestureZone side="left" strategies={left} actionsRef={actionsRef} onToggleControls={onToggleControls} />
        <GestureZone side="right" strategies={right} actionsRef={actionsRef} onToggleControls={onToggleControls} />
      </View>
      {hud ? (
        <View pointerEvents="none" style={styles.hud} accessibilityLiveRegion="polite">
          <Ionicons name={hud.icon} size={28} color="#FFFFFF" />
          <AppText variant="bodyStrong" style={{ marginTop: 4 }}>
            {hud.label}
          </AppText>
          {hud.value !== undefined ? (
            <View style={styles.hudBar}>
              <View style={[styles.hudFill, { width: `${hud.value * 100}%` }]} />
            </View>
          ) : null}
        </View>
      ) : null}
    </>
  );
}