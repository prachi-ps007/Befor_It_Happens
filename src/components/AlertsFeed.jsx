import { motion, AnimatePresence } from "framer-motion";
export default function AlertsFeed({ externalAlerts = [] }) {
  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      <AnimatePresence>
        {externalAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`p-3 rounded-lg border bg-[#1f1f1f] ${
              alert.severity === "danger"
                ? "border-red-500 text-red-400"
                : alert.severity === "warning"
                ? "border-yellow-400 text-yellow-300"
                : "border-green-500 text-green-400"
            }`}
          >
            <div className="text-sm">{alert.message}</div>
            <div className="text-xs text-gray-400">{alert.time}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}