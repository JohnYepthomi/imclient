import React from "react";
import "../styles/conversation.css";
import { useSearchParams, useParams } from "react-router-dom";
import DirectMessages from "./conversation types/DirectMessages";

export default function Chat() {
  let [searchParams] = useSearchParams();
  const { senderjid } = useParams();
  const source = searchParams.get("source");

  return <DirectMessages senderjid={senderjid} />;
}
