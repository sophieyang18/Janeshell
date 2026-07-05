import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Mic, Phone, Smile, Video } from "lucide-react";

import { GlassCard, PrimaryButton, SectionTitle, Tag } from "@/components/common/ui";
import { useAppStore } from "@/store/use-app-store";
import { apiClient } from "@/services/api";
import { companionFigureSrc, getCompanionTheme, type CompanionCategory } from "@/types/domain";

const quickEmoji = ["🥺", "😭", "😤", "💪", "🥗", "🏃", "🔥", "🫶"];

export function ChatPanel({ embedded = false }: { embedded?: boolean }) {
  const messages = useAppStore((state) => state.messages);
  const sendMessage = useAppStore((state) => state.sendMessage);
  const userId = useAppStore((state) => state.userId);
  const profile = useAppStore((state) => state.profile);
  const companionProfile = useAppStore((state) => state.companionProfile);
  const [draft, setDraft] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const theme = getCompanionTheme(profile?.companion.category ?? "帅哥", profile?.gender);
  const companionCategory = profile?.companion.category ?? "帅哥";
  const titleTone = resolveChatTone();
  const darkTools = titleTone === "dark";

  const sortedMessages = useMemo(() => [...messages], [messages]);
  const latestMessageId = sortedMessages.at(-1)?.id;

  useEffect(() => {
    const list = messageListRef.current;
    if (!list) return;

    const scrollToBottom = () => {
      list.scrollTop = list.scrollHeight;
    };

    scrollToBottom();
    const frameId = requestAnimationFrame(scrollToBottom);
    const timerId = window.setTimeout(scrollToBottom, 120);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
    };
  }, [latestMessageId, sortedMessages.length]);

  return (
    <GlassCard
      className={`flex h-full min-h-0 flex-col overflow-hidden ${embedded ? "p-5" : "p-6"}`}
      style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.shellCardBg }}
    >
      <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: theme.palette.shellCardBorder }}>
        <SectionTitle title={`${companionProfile.name} 的聊天窗`} subtitle="这里保留微信的使用习惯，但气质跟着搭子主题走。" tone={titleTone} />
        <div className="flex gap-2">
          <IconButton label="语音通话" dark={darkTools} onClick={() => void startCall("voice")}>
            <Phone className="size-4" />
          </IconButton>
          <IconButton label="视频通话" dark={darkTools} onClick={() => void startCall("video")}>
            <Video className="size-4" />
          </IconButton>
        </div>
      </div>

      {callStatus ? (
        <div className="mt-4 rounded-[22px] px-4 py-3 text-sm font-semibold" style={{ background: theme.palette.accentSoft, color: theme.palette.previewText }}>
          {callStatus}
        </div>
      ) : null}

      <div
        ref={messageListRef}
        data-chat-scroll-container="true"
        className="scrollbar-thin mt-5 min-h-0 flex-1 overflow-y-auto rounded-[26px] p-5"
        style={{ background: theme.palette.previewCardBg }}
      >
        <div className="space-y-4">
          {sortedMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"} gap-3`}>
              {message.sender === "companion" ? (
                <div
                  className="size-11 shrink-0 overflow-hidden rounded-[18px] border"
                  style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.stageCardBg }}
                >
                  <img
                    src={companionFigureSrc[companionCategory]}
                    alt={`${companionCategory}搭子头像`}
                    className={getChatAvatarClassName(companionCategory)}
                    draggable={false}
                  />
                </div>
              ) : null}
              <div
                className={`max-w-[70%] rounded-[24px] px-4 py-3 text-sm leading-7 shadow-sm ${
                  message.sender === "me" ? "text-slate-950" : "bg-white/96 text-slate-800"
                }`}
                style={message.sender === "me" ? { background: theme.palette.orb } : undefined}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEmoji ? (
        <div className="mt-4 shrink-0 rounded-[24px] border p-4" style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.previewCardBg }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold" style={{ color: theme.palette.shellText }}>表情面板</div>
            <Tag className="border" style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.tagBg, color: theme.palette.tagText }}>最近使用 + 全部表情</Tag>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {quickEmoji.map((emoji) => (
              <button
                key={emoji}
                className="rounded-2xl py-3 text-2xl transition hover:opacity-90"
                style={{ background: theme.palette.accentSoft }}
                onClick={() => {
                  sendMessage(emoji);
                  setShowEmoji(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 shrink-0 rounded-[28px] border p-3 shadow-[0_12px_40px_rgba(15,23,42,0.14)]" style={{ borderColor: theme.palette.shellCardBorder, background: theme.palette.previewCardBg }}>
        <div className="flex items-end gap-3">
          <IconButton label={voiceMode ? "切回文字" : "切到语音"} dark={darkTools} onClick={() => setVoiceMode((value) => !value)}>
            <Mic className="size-5" />
          </IconButton>

          {voiceMode ? (
            <button className="flex h-14 flex-1 items-center justify-center rounded-[22px] border border-dashed bg-white/70 text-sm font-semibold text-slate-700">
              按住说话，向左上取消，向右上转文字
            </button>
          ) : (
            <div className="flex min-h-14 flex-1 items-end rounded-[22px] bg-white/90 px-4 py-3">
              <textarea
                rows={1}
                value={draft}
                placeholder="和阿简说点什么……"
                onChange={(event) => setDraft(event.target.value)}
                className="max-h-32 w-full resize-none bg-transparent text-sm leading-6 outline-none"
              />
            </div>
          )}

          <IconButton label="表情" dark={darkTools} onClick={() => setShowEmoji((value) => !value)}>
            <Smile className="size-5" />
          </IconButton>
          <IconButton label="拍照入口" dark={darkTools}>
            <Camera className="size-5" />
          </IconButton>

          <PrimaryButton
            onClick={async () => {
              const text = voiceMode ? "刚刚这段语音先帮我转成文字了。" : draft;
              if (!text.trim()) return;

              setDraft("");
              await sendMessage(text);
            }}
            className="h-14 px-6"
            style={{ background: theme.palette.panelActive }}
          >
            发送
          </PrimaryButton>
        </div>
      </div>
    </GlassCard>
  );

  async function startCall(callType: "voice" | "video") {
    const label = callType === "voice" ? "语音通话" : "视频通话";
    if (!userId) {
      setCallStatus(`${label}已进入本地演示模式，后端连接后会写入通话记录。`);
      return;
    }

    try {
      const call = await apiClient.createCall(userId, callType);
      setCallStatus(`${label}已${call.status === "connected" ? "接通" : "发起"}，后端通话记录已创建。`);
    } catch {
      setCallStatus(`${label}暂时无法连接后端，已保留前端演示状态。`);
    }
  }
}

function getChatAvatarClassName(category: CompanionCategory) {
  if (category === "萌宠") {
    return "h-full w-full scale-110 object-cover object-center";
  }

  return "h-full w-full scale-[1.2] object-cover object-[50%_18%]";
}

function resolveChatTone(): "light" | "dark" {
  return "light";
}

function IconButton({
  children,
  label,
  onClick,
  dark = false,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  dark?: boolean;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`flex size-12 items-center justify-center rounded-2xl transition ${
        dark ? "bg-white/10 text-white/80 hover:bg-white/14" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
