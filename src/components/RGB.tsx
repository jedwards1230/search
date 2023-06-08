import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function RGB({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="flex"
        >
            <div
                className={clsx(
                    'w-1/3 rounded-bl border-solid border-red-500 transition-all',
                    size === 'sm' ? 'border' : 'border-4'
                )}
            />
            <div
                className={clsx(
                    'w-1/3 border-solid border-green-500 transition-all',
                    size === 'sm' ? 'border' : 'border-4'
                )}
            />
            <div
                className={clsx(
                    'w-1/3 rounded-br border-solid border-blue-500 transition-all',
                    size === 'sm' ? 'border' : 'border-4'
                )}
            />
        </motion.div>
    );
}
