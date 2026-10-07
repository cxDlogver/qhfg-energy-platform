export type Params = Record<string, unknown>;
export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
  email: string;
  phone: string;
  company: string;
  region: string;
  fullName?: string;
};
export type Node = {
  id: number;
  name: string;
  nameEn: string | null;
  parentId: number;
  type: string;
  deleted?: boolean;
  children: Node[];
};
export type Point = { value: number | null; area: Record<string, string> };
export type Table = { columns: string[]; data: Record<string, unknown>[] };
export type LineRow = {
  place_china: string;
  place_english: string;
  time: string;
  value: number | null;
};
export const success = (data: unknown = null) => ({
  code: 200,
  msg: null,
  data,
});
export const message = (msg: string) => ({ code: 200, msg, data: null });
export class BusinessError extends Error {
  constructor(
    public code: number,
    msg: string,
    public status = 200,
  ) {
    super(msg);
  }
}
export function text(p: Params, key: string, required = true): string {
  const value = p?.[key];
  if (value === undefined || value === null || Array.isArray(value)) {
    if (required) throw new BusinessError(0, "缺少参数：" + key);
    return "";
  }
  return String(value);
}
export function list(p: Params, key: string) {
  const v = p[key];
  return (Array.isArray(v) ? v.map(String) : String(v ?? "").split(",")).filter(
    Boolean,
  );
}
export function tree(nodes: Node[], rootId?: number) {
  const copies = new Map(
    nodes
      .filter((n) => !n.deleted)
      .map((n) => [n.id, { ...n, children: [] as Node[] }]),
  );
  let root: Node | null = null;
  if (rootId !== undefined) {
    root = {
      id: rootId,
      name: "",
      nameEn: null,
      parentId: -1,
      type: "",
      children: [],
    };
    copies.set(rootId, root);
  }
  for (const node of copies.values()) {
    if (node.parentId === -1) root = node;
    else copies.get(node.parentId)?.children.push(node);
  }
  return root;
}
export function alignLines(rows: LineRow[]) {
  const xAxisData = [...new Set(rows.map((r) => r.time))].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true }),
  );
  const groups = new Map<
    string,
    { name: [string, string]; values: Map<string, number | null> }
  >();
  for (const r of rows) {
    let group = groups.get(JSON.stringify([r.place_china, r.place_english]));
    if (!group) {
      group = { name: [r.place_china, r.place_english], values: new Map() };
      groups.set(JSON.stringify([r.place_china, r.place_english]), group);
    }
    group.values.set(r.time, r.value === null ? null : Number(r.value));
  }
  return {
    xAxisData,
    SeriesData: [...groups.values()].map((g) => ({
      name: g.name,
      data: xAxisData.map((t) => g.values.get(t) ?? null),
    })),
  };
}
export function filterColumns(table: Table, language: string): Table {
  const columns = table.columns.filter((c) =>
    language === "chinese"
      ? !/^[A-Za-z]+$/.test(c)
      : language === "english"
        ? !/\p{Script=Han}/u.test(c)
        : true,
  );
  return {
    columns,
    data: table.data.map((r) =>
      Object.fromEntries(columns.map((c) => [c, r[c] ?? ""])),
    ),
  };
}
export interface Provider {
  runtime?(): Record<string, unknown>;
  user(
    field: "username" | "email" | "phone",
    value: string,
  ): Promise<User | null>;
  permissions(role: string): Promise<string[]>;
  register(data: Params, hash: string): Promise<void>;
  reset(email: string, hash: string): Promise<boolean>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, seconds: number): Promise<void>;
  delete(key: string): Promise<void>;
  mail(email: string, code: string, reset: boolean): Promise<void>;
  nodes(): Promise<Node[]>;
  editNode(op: string, data: Params): Promise<boolean>;
  image(p: Params, boundary?: boolean): Promise<Buffer>;
  legend(p: Params): Promise<Buffer>;
  point(p: Params): Promise<Point>;
  lines(p: Params): Promise<LineRow[]>;
  table(p: Params): Promise<Table>;
  regions(map: string): Promise<unknown>;
  description(map: string, lang: string): Promise<unknown>;
  tile(p: Params): Promise<Buffer>;
  weather(p: Params): Promise<unknown>;
  close(): Promise<void>;
}
