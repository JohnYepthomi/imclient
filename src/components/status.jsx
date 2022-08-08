import React from "react";
import { motion } from "framer-motion/dist/framer-motion";

export default function Status() {
  return (
    <motion.div key="status-list" initial={{ x: "-100vw" }} animate={{ x: 0 }}>
      status
    </motion.div>
  );
}
