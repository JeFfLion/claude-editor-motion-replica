# 小克剪辑过程 · Remotion 复刻

30 秒手绘剪辑软件动效，1280×720，30 fps，Composition ID：`ClaudeEditorReplica`。

## 运行

建议 Node.js 24；全部 Remotion 官方依赖固定为 4.0.536。

```sh
npm ci
npm run dev
```

打开终端提供的地址，选择 ClaudeEditorReplica。

## 渲染

```sh
npm run render -- ClaudeEditorReplica out/claude-editor.mp4
npm run still -- ClaudeEditorReplica out/poster.png --frame=390
npm run check
npm run build
```

首次渲染可能需要下载 Chrome。可以用 `--browser-executable="浏览器绝对路径"` 指定已有 Chrome/Edge。只预览无需导出 MP4。

## 实现与素材

- SVG 和 React 构建界面、手机边框、角色、蹦迪场景、素材轨、音频波形、字幕、滑杆与便签。
- `useCurrentFrame()` / `useVideoConfig()` 和插值控制时间、缩放、角色移动、指针和画面切换；无 CSS 动画或非确定随机数。
- 原参考：MotionFace 片段 `e3ee409a-50f7-4b4a-af27-288226e47a57`，标题“claude\_剪视频过程motion”。公开片段页面：https://motionface.cc/?recording=e3ee409a-50f7-4b4a-af27-288226e47a57
- `city.jpg`、`ramen.jpg`、`shiba.jpg` 是从用户提供参考裁出的静态插画；`audio.m4a` 为原音轨，无重编码提取。未嵌入原视频或完整参考帧。
- 插画和声音的原作者权利保留，仓库公开不表示这些参考素材取得额外再分发或商业许可。
- 中文优先使用 Windows 楷体，macOS 使用 STKaiti。未打包系统字体；其他系统会使用后备字体，字形会略有差异。

这是按原片结构和时间重建的近似复刻：参考中的细小笔触、素材内部逐帧表情与部分精确镜头路径有简化，蹦迪场景重新用矢量绘制。

## 目录

`src/videos/claude-editor/ClaudeEditor.tsx`：动画及 Composition 注册；`public/videos/claude-editor/`：静态插画与声音；`docs/production.md`：拆解与验证记录。

凭证、限时签名链接、node_modules、参考视频、导出视频与构建产物均不提交。
