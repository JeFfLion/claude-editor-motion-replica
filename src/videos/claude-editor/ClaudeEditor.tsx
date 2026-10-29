import React from "react";
import {
  AbsoluteFill,
  Composition,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";

const ink = "#302b27";
const paper = "#f7f3ea";
const files = ["city", "ramen", "shiba", "dance"];
const labels = ["夜景.mp4", "拉面.mp4", "柴犬.mov", "小克蹦迪.mp4"];
const colors = ["#ddd6f2", "#f9e8a9", "#c9e7da", "#d7b6d7"];
const asset = (name: string) => staticFile(`videos/claude-editor/${name}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], clamp);

const Box: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  r?: number;
}> = ({ x, y, w, h, fill = paper, r = 9 }) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx={r}
    fill={fill}
    stroke={ink}
    strokeWidth={2.4}
  />
);
const Text: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  fill?: string;
  weight?: number;
}> = ({ x, y, children, size = 18, fill = ink, weight = 400 }) => (
  <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight}>
    {children}
  </text>
);

const Mascot: React.FC<{
  x: number;
  y: number;
  t: number;
  small?: boolean;
  happy?: boolean;
}> = ({ x, y, t, small = false, happy = true }) => (
  <g
    transform={`translate(${x},${y}) scale(${small ? 0.6 : 1}) rotate(${Math.sin(t * 8) * 2})`}
    stroke={ink}
    strokeWidth="2.5"
    strokeLinejoin="round"
  >
    <path
      d="M-35 25 L-36 46 L-27 46 L-26 25 M24 25 L24 46 L33 46 L33 25"
      fill="#bd6651"
    />
    <path
      d={
        happy
          ? "M-46 0 L-66 -25 L-71 -24 L-70 -17 L-48 13 M46 0 L64 -28 L70 -27 L68 -17 L48 13"
          : "M-47 0 L-58 0 L-58 12 L-46 12 M46 0 L58 0 L58 12 L46 12"
      }
      fill="#c7745d"
    />
    <path d="M-47 -28 L45 -27 L46 28 L-46 27 Z" fill="#c86d58" />
    <path d="M-18 -5 Q-14 -13 -10 -5 M13 -5 Q17 -13 21 -5" fill="none" />
    <path d="M-7 9 Q3 19 13 8" fill="#fff0d9" />
    <ellipse cx="-28" cy="7" rx="5" ry="2" fill="#e79b88" stroke="none" />
    <path d="M-18 -28 L-9 -34 L-8 -28 L3 -33 L3 -27 L15 -32" fill="none" />
  </g>
);

const Dance: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width="210" height="302" fill="#4a376f" />
    <path d="M100 30 L-70 302 L290 302 Z" fill="#d596cf" opacity=".22" />
    <path d="M100 30 L0 260 L210 220 Z" fill="#7669b5" opacity=".35" />
    <path d="M0 210 L210 210 L210 302 L0 302Z" fill="#29374e" />
    {Array.from({ length: 35 }, (_, i) => {
      const row = Math.floor(i / 7),
        col = i % 7;
      return (
        <path
          key={i}
          d={`M${105 + (col - 3.5) * (18 + row * 9)} ${210 + row * 19} l${18 + row * 9} 0 l${(col - 2) * 3 + 3} 19 l-${24 + row * 9} 0Z`}
          fill={(row + col) % 2 ? "#6b8b9b" : "#373852"}
        />
      );
    })}
    <circle
      cx="106"
      cy="29"
      r="16"
      fill="#d4d6e5"
      stroke={ink}
      strokeWidth="2"
    />
    <path d="M94 19 L120 39 M92 31 L120 26 M104 13 L106 45" stroke="#9294af" />
    <Mascot
      x={105 + Math.sin(t * 7) * 13}
      y={215 + Math.sin(t * 14) * 7}
      t={t}
    />
    {[
      [30, 80],
      [160, 64],
      [80, 122],
      [180, 181],
      [26, 254],
    ].map(([x, y], i) => (
      <text
        key={i}
        x={x}
        y={y}
        fontSize={14 + Math.sin(t * 5 + i) * 5}
        fill="#fff4b9"
      >
        ✦
      </text>
    ))}
  </g>
);

const Art: React.FC<{
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  t: number;
}> = ({ index, x, y, w, h, t }) => (
  <svg
    x={x}
    y={y}
    width={w}
    height={h}
    viewBox="0 0 210 302"
    preserveAspectRatio="xMidYMid slice"
  >
    {index === 3 ? (
      <Dance t={t} />
    ) : (
      <image
        href={asset(`${files[index]}.jpg`)}
        width="210"
        height="302"
        preserveAspectRatio="xMidYMid slice"
      />
    )}
  </svg>
);

export const ClaudeEditor: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tab = t < 8.8 ? 0 : t < 12.1 ? 1 : 2;
  const current = t < 5 ? 0 : t < 12.5 ? 1 : t < 15 ? 2 : 3;
  const play = interpolate(
    t,
    [0, 2, 5, 8, 12, 15, 22, 26, 30],
    [0, 0, 2.2, 4, 6.5, 8.5, 10.7, 13, 14],
    clamp,
  );
  const zoom = interpolate(
    t,
    [0, 1.2, 2, 4, 6, 8, 10, 12, 14, 15, 17, 18, 19, 21, 22, 24, 26, 27, 30],
    [
      0.5, 1, 1, 1.08, 1.15, 1.12, 1.06, 1.12, 1.15, 1.1, 1.25, 1.22, 1.15,
      1.06, 1, 1.12, 1.08, 1, 1,
    ],
    clamp,
  );
  const pan = interpolate(
    t,
    [0, 2, 5, 9, 13, 16, 18, 22, 25, 27],
    [0, 0, -35, 55, 0, -150, -170, 0, -100, 0],
    clamp,
  );
  const mx = interpolate(
    t,
    [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    [
      160, 180, 220, 260, 450, 245, 235, 330, 520, 470, 470, 550, 970, 1060,
      1050, 1050,
    ],
    clamp,
  );
  const my = t > 27 ? 620 : 450;
  const target =
    t < 4
      ? [125, 230]
      : t < 6
        ? [460, 540]
        : t < 8
          ? [690, 560]
          : t < 10
            ? [250, 120]
            : t < 12
              ? [255, 35]
              : t < 14
                ? [260, 105]
                : t < 16
                  ? [1140, 130]
                  : t < 18
                    ? [1190, 195]
                    : t < 20
                      ? [1190, 195]
                      : t < 23
                        ? [700, 610]
                        : [1155, 35];
  const arm = t > 2 && t < 26 && Math.sin(t * 2) > -0.5;
  const final = ramp(t, 27, 27.6);
  return (
    <AbsoluteFill style={{ backgroundColor: "#f2eae3" }}>
      <Audio src={asset("audio.m4a")} premountFor={fps} />
      <svg
        viewBox="0 0 1280 720"
        width="100%"
        height="100%"
        style={{ fontFamily: '"KaiTi", "STKaiti", "Comic Sans MS", cursive' }}
      >
        <defs>
          <filter id="rough">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".045"
              numOctaves="2"
              seed="7"
            />
            <feDisplacementMap in="SourceGraphic" scale=".7" />
          </filter>
          <pattern
            id="grain"
            width="13"
            height="11"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="3" cy="4" r=".45" fill="#ac977b" opacity=".12" />
            <circle cx="10" cy="9" r=".3" fill="#ac977b" opacity=".12" />
          </pattern>
          <clipPath id="phone">
            <rect width="210" height="302" rx="15" />
          </clipPath>
        </defs>
        {t < 0.75 ? (
          <g
            transform={`translate(320 245) scale(${0.85 + ramp(t, 0, 0.7) * 0.15})`}
          >
            <Box x={0} y={0} w={640} h={190} />
            <path d="M0 30 H640" stroke={ink} />
            <Text x={230} y={20} size={14}>
              小克剪辑.mp4
            </Text>
            <Text x={24} y={85} fill="#c46b54">
              ▌
            </Text>
            <Text x={10} y={135} fill="#d5cfc6">
              1 2 3
            </Text>
          </g>
        ) : (
          <g
            transform={`translate(${640 + pan} 360) scale(${zoom * (0.8 + 0.2 * ramp(t, 0.75, 1.3))}) translate(-640 -360)`}
            filter="url(#rough)"
          >
            <Box x={4} y={3} w={1272} h={712} r={15} />
            <Box x={18} y={12} w={1244} h={42} />
            <circle cx="33" cy="32" r="4" fill="#dc7d7d" stroke={ink} />
            <circle cx="48" cy="32" r="4" fill="#e9c871" stroke={ink} />
            <circle cx="63" cy="32" r="4" fill="#8dbba1" stroke={ink} />
            <Text x={82} y={40} size={21}>
              ▣ {title}
            </Text>
            <rect x="566" y="19" width="150" height="28" rx="4" fill={ink} />
            <Text x={586} y={40} fill="#f7f3ea">
              00:00:{String(Math.floor(t)).padStart(2, "0")}:00
            </Text>
            <Text x={740} y={39} size={13} fill="#999286">
              · 已自动保存
            </Text>
            <Box x={1000} y={21} w={62} h={25} r={5} />
            <Text x={1010} y={39} size={15}>
              1080p
            </Text>
            <Box x={1073} y={19} w={176} h={29} fill="#8cc5b8" r={5} />
            <Text x={1122} y={40} fill="#fff">
              ↥ 导出
            </Text>
            <g opacity={ramp(t, 1, 1.6)}>
              <Box x={22} y={65} w={262} h={303} />
              {["素材", "转场", "文字"].map((s, i) => (
                <g key={s}>
                  <Box
                    x={31 + i * 83}
                    y={73}
                    w={77}
                    h={27}
                    r={6}
                    fill={tab === i ? "#f2cf69" : paper}
                  />
                  <Text x={51 + i * 83} y={93}>
                    {s}
                  </Text>
                </g>
              ))}
              {tab === 0 ? (
                <g>
                  {files.map((s, i) => (
                    <g key={s}>
                      <Box
                        x={35 + (i % 2) * 123}
                        y={111 + Math.floor(i / 2) * 105}
                        w={111}
                        h={78}
                        fill={colors[i]}
                      />
                      <Art
                        index={i}
                        x={38 + (i % 2) * 123}
                        y={114 + Math.floor(i / 2) * 105}
                        w={105}
                        h={71}
                        t={t}
                      />
                      <Text
                        x={55 + (i % 2) * 123}
                        y={205 + Math.floor(i / 2) * 105}
                        size={14}
                      >
                        {labels[i]}
                      </Text>
                    </g>
                  ))}
                  {[0, 1].map((i) => (
                    <g key={i}>
                      <rect
                        x={38 + i * 123}
                        y="320"
                        width="107"
                        height="36"
                        rx="6"
                        fill="none"
                        stroke="#bcb8ae"
                        strokeDasharray="5 4"
                      />
                      <Text x={82 + i * 123} y={346} fill="#bbb3a6" size={26}>
                        ＋
                      </Text>
                    </g>
                  ))}
                </g>
              ) : tab === 1 ? (
                <g>
                  {["◎", "▤", "▣", "⊕", "➤", "▦"].map((s, i) => (
                    <g key={i}>
                      <Box
                        x={37 + (i % 2) * 122}
                        y={112 + Math.floor(i / 2) * 80}
                        w={109}
                        h={59}
                        fill={
                          [
                            "#d3cee9",
                            "#cee8dd",
                            "#f1ced9",
                            "#d1e3f2",
                            "#f6e7b9",
                            paper,
                          ][i]
                        }
                      />
                      <Text
                        x={78 + (i % 2) * 122}
                        y={151 + Math.floor(i / 2) * 80}
                        size={30}
                      >
                        {s}
                      </Text>
                      <Text
                        x={76 + (i % 2) * 122}
                        y={187 + Math.floor(i / 2) * 80}
                        size={13}
                      >
                        {["旋转", "翻页", "故障", "缩放", "滑动", "溶解"][i]}
                      </Text>
                    </g>
                  ))}
                </g>
              ) : (
                <g>
                  {["前方高能", "好耶～", "霓虹 NEON"].map((s, i) => (
                    <g key={i}>
                      <Box
                        x={35}
                        y={111 + i * 79}
                        w={234}
                        h={68}
                        fill={["#fff3d2", "#f8e4ed", "#302a41"][i]}
                      />
                      <text
                        x="152"
                        y={154 + i * 79}
                        textAnchor="middle"
                        fontSize="27"
                        fontWeight="900"
                        stroke={i === 0 ? ink : "none"}
                        strokeWidth="5"
                        paintOrder="stroke"
                        fill={["#e9c859", "#cf89a4", "#f7d6ff"][i]}
                      >
                        {s}
                      </text>
                    </g>
                  ))}
                </g>
              )}
              <g transform="translate(558 68)">
                <rect
                  x="-8"
                  y="-8"
                  width="226"
                  height="318"
                  rx="26"
                  fill="#292827"
                  stroke={ink}
                  strokeWidth="3"
                />
                <g
                  clipPath="url(#phone)"
                  style={{
                    filter:
                      t > 17 && t < 19
                        ? "saturate(2.2) brightness(1.2)"
                        : undefined,
                  }}
                >
                  <Art index={current} x={0} y={0} w={210} h={302} t={t} />
                  {t > 12.5 && t < 15 ? (
                    <text
                      x="105"
                      y="215"
                      textAnchor="middle"
                      stroke={ink}
                      strokeWidth="5"
                      paintOrder="stroke"
                      fill="#f1cb58"
                      fontSize="24"
                      fontWeight="900"
                    >
                      前方高能预警
                    </text>
                  ) : null}
                  {t > 15 && t < 22 ? (
                    <rect
                      width="210"
                      height="302"
                      fill="white"
                      opacity={(Math.sin(t * 12) + 1) * 0.08}
                    />
                  ) : null}
                </g>
                <rect
                  x="85"
                  y="4"
                  width="40"
                  height="10"
                  rx="5"
                  fill="#252424"
                />
                <Text x={63} y={334} size={20}>
                  ◂ ⊙ ▸
                </Text>
              </g>
              <Box x={1075} y={65} w={184} h={303} />
              <Text x={1093} y={92} size={25}>
                调整 ✧
              </Text>
              <path d="M1087 105 H1249" stroke="#aaa195" />
              {["闪光", "饱和度", "缩放冲击", "速度"].map((s, i) => {
                const v =
                  i === 0
                    ? t > 15
                      ? 0.7
                      : 0
                    : i === 1
                      ? t > 18
                        ? 1.1
                        : t > 17
                          ? 2
                          : 0.65
                      : i === 2
                        ? t > 19
                          ? 0.6
                          : 0
                        : 0.5;
                return (
                  <g key={s}>
                    <Text x={1092} y={128 + i * 64} size={17}>
                      {s}
                    </Text>
                    <Text x={1218} y={128 + i * 64} size={13}>
                      {i === 3 ? "1.0x" : `${Math.round(v * 100)}%`}
                    </Text>
                    <rect
                      x="1090"
                      y={143 + i * 64}
                      width="157"
                      height="7"
                      rx="3"
                      fill="#fcfaf4"
                      stroke={ink}
                    />
                    <rect
                      x="1090"
                      y={143 + i * 64}
                      width={Math.min(v, 1) * 157}
                      height="7"
                      rx="3"
                      fill="#8cc7b8"
                    />
                    <circle
                      cx={1090 + Math.min(v, 1) * 157}
                      cy={147 + i * 64}
                      r="8"
                      fill={paper}
                      stroke={ink}
                    />
                  </g>
                );
              })}
            </g>
            <g opacity={ramp(t, 1.2, 1.8)}>
              <Box x={22} y={389} w={1237} h={309} />
              {["T", "▶", "♪"].map((s, i) => (
                <g key={i}>
                  <Box
                    x={34}
                    y={441 + i * 66}
                    w={35}
                    h={i === 1 ? 58 : 35}
                    fill={["#f4e8b7", "#d5e9df", "#e0d8ef"][i]}
                    r={5}
                  />
                  <Text x={44} y={465 + i * 66} size={24}>
                    {s}
                  </Text>
                </g>
              ))}
              {Array.from({ length: 57 }, (_, i) => (
                <path
                  key={i}
                  d={`M${88 + i * 20} 430 v-${i % 4 === 0 ? 16 : 6}`}
                  stroke="#b0a89c"
                />
              ))}
              {Array.from({ length: 15 }, (_, i) => (
                <Text key={i} x={81 + i * 80} y={408} size={13} fill="#7d776c">
                  0:{String(i).padStart(2, "0")}
                </Text>
              ))}
              <path d="M82 430 H1247" stroke={ink} />
              {files.map((s, i) => {
                const entry = ramp(t, 1.8 + i * 0.55, 2.3 + i * 0.55);
                const widths = [190, 200, 190, 235];
                const xs = [86, 278, 480, 672];
                return (
                  <g
                    key={s}
                    opacity={entry}
                    transform={`translate(0 ${(1 - entry) * -150})`}
                  >
                    <Box
                      x={xs[i]}
                      y={500}
                      w={widths[i]}
                      h={75}
                      fill={colors[i]}
                      r={5}
                    />
                    {Array.from({ length: 3 }, (_, j) => (
                      <Art
                        key={j}
                        index={i}
                        x={xs[i] + 3 + (j * (widths[i] - 6)) / 3}
                        y={503}
                        w={(widths[i] - 6) / 3}
                        h={69}
                        t={t + j * 0.15}
                      />
                    ))}
                    <rect
                      x={xs[i] + 5}
                      y="504"
                      width={i === 3 ? 102 : 70}
                      height="18"
                      rx="5"
                      fill="#fffbed"
                    />
                    <Text x={xs[i] + 9} y={518} size={13}>
                      {labels[i]}
                    </Text>
                  </g>
                );
              })}
              {t > 5 ? (
                <g opacity={ramp(t, 5, 5.4)}>
                  <Box x={84} y={590} w={1120} h={34} fill="#e5d9ef" r={5} />
                  <Text x={92} y={603} size={11}>
                    ♪ bgm_小克.wav
                  </Text>
                  {Array.from({ length: 370 }, (_, i) => {
                    const h =
                      3 +
                      Math.abs(Math.sin(i * 1.17) * Math.sin(i * 0.16)) * 17;
                    return (
                      <path
                        key={i}
                        d={`M${88 + i * 3} ${615 - h / 2} v${h}`}
                        stroke="#9d83bb"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              ) : null}
              {t > 12.5 ? (
                <g>
                  <Box
                    x={481}
                    y={453}
                    w={190 * ramp(t, 12.5, 13.3)}
                    h={28}
                    fill="#efd16b"
                    r={4}
                  />
                  <Text x={490} y={473} size={15}>
                    T 前方高能预警
                  </Text>
                </g>
              ) : null}
              {t > 9 &&
                [278, 480, 672].map((x, i) => (
                  <g key={i}>
                    <circle cx={x} cy="535" r="14" fill={paper} stroke={ink} />
                    <Text x={x - 7} y={541} size={18}>
                      {["◎", "▤", "▣"][i]}
                    </Text>
                  </g>
                ))}
              {t > 21 &&
                Array.from({ length: 30 }, (_, i) => (
                  <path
                    key={i}
                    d={`M${90 + i * 36} 641 l7 12 l7 -12Z`}
                    fill="#edd566"
                    stroke={ink}
                  />
                ))}
              <path
                d={`M${88 + play * 65} 410 V659`}
                stroke="#d26878"
                strokeWidth="2.5"
              />
              <path
                d={`M${79 + play * 65} 402 h18 v15 l-9 9 l-9 -9Z`}
                fill="#d26878"
                stroke={ink}
              />
              <Text x={45} y={680} fill="#a29b8f">
                − ───○──── ＋
              </Text>
              <Text x={1120} y={680} size={11} fill="#b6afa2">
                片段 4 总时长 0:30
              </Text>
            </g>
            {arm && (
              <path
                d={`M${mx} ${my - 20} L${target[0]} ${target[1]}`}
                stroke={ink}
                strokeWidth="10"
              />
            )}
            {arm && (
              <path
                d={`M${mx} ${my - 20} L${target[0]} ${target[1]}`}
                stroke="#c57b65"
                strokeWidth="6"
              />
            )}
            {t > 1.5 && (
              <Mascot
                x={mx}
                y={my}
                t={t}
                happy={(t > 10 && t < 13) || t > 27}
              />
            )}
            {t > 5.8 && t < 7.5 ? (
              <g>
                <Box x={mx + 50} y={my - 40} w={132} h={30} />
                <Text x={mx + 62} y={my - 18} size={15}>
                  这段不要！
                </Text>
              </g>
            ) : null}
            {t > 7.6 && t < 8.6 ? (
              <Text x={580} y={657} size={38} fill="#b78c35" weight={900}>
                哐当!
              </Text>
            ) : null}
            {t > 9.2 && t < 10.5 ? (
              <Text x={350} y={340} size={32} fill="#539e90" weight={900}>
                空心入网!
              </Text>
            ) : null}
            {t > 13.5 && t < 14.8 ? (
              <g>
                <Box x={280} y={565} w={120} h={62} fill="#fffdf2" />
                <Text x={295} y={607} size={30}>
                  Ctrl+Z
                </Text>
                <Text x={300} y={557} size={40} fill="#bd9b35">
                  ?
                </Text>
              </g>
            ) : null}
            {t > 17 && t < 19 ? (
              <text
                x="797"
                y="110"
                fontSize="38"
                fill="#e24e88"
                stroke={ink}
                strokeWidth="4"
                paintOrder="stroke"
                fontWeight="900"
              >
                饱和度·拉满
              </text>
            ) : null}
            {t > 21 && t < 23 ? (
              <Text x={370} y={643} size={36} fill="#6ba99c" weight={900}>
                卡点!
              </Text>
            ) : null}
            {t > 25.5 && t < 27 ? (
              <Text x={1000} y={545} size={39} fill="#ddc472" weight={900}>
                BONK!
              </Text>
            ) : null}
            <rect
              x="10"
              y="8"
              width="1260"
              height="700"
              fill="url(#grain)"
              pointerEvents="none"
            />
          </g>
        )}
        {final > 0 ? (
          <g opacity={final}>
            <rect width="1280" height="720" fill="#fffef5" opacity=".7" />
            <g transform="translate(470 170)">
              <rect x="-8" y="-8" width="226" height="318" rx="26" fill={ink} />
              <Art index={2} x={0} y={0} w={210} h={302} t={t} />
              <text
                x="105"
                y="230"
                textAnchor="middle"
                stroke={ink}
                strokeWidth="5"
                paintOrder="stroke"
                fill="#f1cb58"
                fontSize="24"
                fontWeight="900"
              >
                前方高能预警
              </text>
            </g>
            <g transform="rotate(-3 270 300)">
              <Box x={180} y={210} w={235} h={290} fill="#fffef6" />
              <Text x={204} y={266} size={31}>
                {"30 秒剪完".slice(0, Math.floor((t - 27) * 6))}
              </Text>
              <Text x={204} y={310} size={21}>
                {t > 28.5 ? "小克：下班！" : ""}
              </Text>
            </g>
            <Mascot x={1030} y={565} t={t} />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

export const ClaudeEditorComposition = () => (
  <Composition
    id="ClaudeEditorReplica"
    component={ClaudeEditor}
    durationInFrames={900}
    fps={30}
    width={1280}
    height={720}
    defaultProps={{ title: "小克剪辑_最终版_打死不改(3).mp4" }}
  />
);
