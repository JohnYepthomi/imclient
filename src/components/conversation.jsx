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
  pageStyle.marginTop = "0px";
  pageStyle.zIndex = "2";
  pageVariants.out = {
    x: "-100vw",
    scale: 0,
    opacity: 0,
  };

  // useEffect(() => {

  // }, []);

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
