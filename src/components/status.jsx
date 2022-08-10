import React from "react";
import { motion } from "framer-motion/dist/framer-motion";

export default function Status({ pageVariants, pageTransition, pageStyle }) {
  return (
    <motion.div
      // key="status-list"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={pageStyle}
    >
      status
    </motion.div>
  );
}
