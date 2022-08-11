import React from "react";
import { useEffect } from "react";
import "../styles/conversation.css";
import { useSearchParams, useParams } from "react-router-dom";
import DirectMessages from "./conversation types/DirectMessages";
import { motion } from "framer-motion/dist/framer-motion";

export default function Chat({ pageVariants, pageTransition, pageStyle }) {
  let [searchParams] = useSearchParams();
  const { senderjid } = useParams();
  const source = searchParams.get("source");

  pageStyle.zIndex = "2";
  pageStyle.marginTop = "0px";
  pageTransition.ease = "easeInOut";
  pageTransition.duration = "0.3";
  pageVariants.initial = {
    translateX: "100vw",
  };
  pageVariants.in = {
    translateX: 0,
    transitionEnd: {
      translateX: 0,
    },
  };
  pageVariants.out = {
    translateX: "100vw",
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={pageStyle}
    >
      <DirectMessages
        pageVariants={pageVariants}
        pageTransition={pageTransition}
        senderjid={senderjid}
      />
    </motion.div>
  );
}
