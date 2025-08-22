"use client";
import { type PropsWithChildren } from "react";
import { PostComposerContextProvider } from "@/contexts/post-composer-context";

export default function PostComposerProvider({ children }: PropsWithChildren<{}>) {
  return <PostComposerContextProvider>{children}</PostComposerContextProvider>;
}
