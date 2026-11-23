/**
 * CircuitWeb-compatible AM detector connectivity adapter.
 *
 * This deliberately reuses CircuitWeb's pin-endpoint + union-find netlist
 * contract without importing its Vite/Zustand UI into the Next.js EduLabX app.
 * The SPDT's selected throw is internally joined to its common terminal; the
 * inactive throw remains isolated. Wire bends are presentation geometry only.
 */
export type AMEndpoint = { compId: string; pin: string };
export type AMNetlistPart = { id: string; type: string };
export type AMNetlistWire = { from: AMEndpoint; to: AMEndpoint };

const PIN_NAMES: Record<string, string[]> = {
  source: ["out", "gnd"],
  diode: ["anode", "cathode"],
  capacitor: ["top", "bottom"],
  resistor: ["p1", "p2"],
  switch: ["common", "throw1", "throw2"],
  ground: ["gnd"],
  scope: ["ch1", "ch2", "gnd"],
};

const token = (endpoint: AMEndpoint) => `${endpoint.compId}::${endpoint.pin}`;

export function buildAMElectricalNets(
  parts: AMNetlistPart[],
  wires: AMNetlistWire[],
  activeLoad: "RL1" | "RL2",
) {
  const parent = new Map<string, string>();
  const rank = new Map<string, number>();
  const add = (key: string) => {
    if (!parent.has(key)) { parent.set(key, key); rank.set(key, 0); }
  };
  const find = (key: string): string => {
    add(key);
    const current = parent.get(key)!;
    if (current !== key) parent.set(key, find(current));
    return parent.get(key)!;
  };
  const union = (a: string, b: string) => {
    let rootA = find(a);
    let rootB = find(b);
    if (rootA === rootB) return;
    const rankA = rank.get(rootA) || 0;
    const rankB = rank.get(rootB) || 0;
    if (rankA < rankB) [rootA, rootB] = [rootB, rootA];
    parent.set(rootB, rootA);
    if (rankA === rankB) rank.set(rootA, rankA + 1);
  };

  const validPins = new Map<string, Set<string>>();
  for (const part of parts) {
    const pins = new Set(PIN_NAMES[part.type] || []);
    validPins.set(String(part.id), pins);
    for (const pin of pins) add(token({ compId: String(part.id), pin }));
  }

  const isValidEndpoint = (endpoint: AMEndpoint) =>
    validPins.get(String(endpoint.compId))?.has(endpoint.pin) === true;

  const ignoredWires: number[] = [];
  wires.forEach((wire, index) => {
    if (!wire || !isValidEndpoint(wire.from) || !isValidEndpoint(wire.to)) {
      ignoredWires.push(index);
      return;
    }
    union(token(wire.from), token(wire.to));
  });

  const switchPart = parts.find((part) => part.type === "switch");
  if (switchPart) {
    union(
      token({ compId: String(switchPart.id), pin: "common" }),
      token({ compId: String(switchPart.id), pin: activeLoad === "RL1" ? "throw1" : "throw2" }),
    );
  }

  const sameNet = (a: AMEndpoint, b: AMEndpoint) =>
    isValidEndpoint(a) && isValidEndpoint(b) && find(token(a)) === find(token(b));

  const nets = new Map<string, string[]>();
  for (const [componentId, pins] of validPins) {
    for (const pin of pins) {
      const root = find(token({ compId: componentId, pin }));
      const members = nets.get(root) || [];
      members.push(token({ compId: componentId, pin }));
      nets.set(root, members);
    }
  }

  return {
    sameNet,
    netOf: (endpoint: AMEndpoint) => isValidEndpoint(endpoint) ? find(token(endpoint)) : null,
    nets: [...nets.entries()].map(([id, nodes]) => ({ id, nodes })),
    ignoredWires,
  };
}
