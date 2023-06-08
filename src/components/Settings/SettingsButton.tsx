import { AnimatePresence, motion } from 'framer-motion';

import { SettingsIcon } from '../icons';
import SettingsDialog from './SettingsDialog';

export default function SettingsButton({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <AnimatePresence>
            <motion.div
                key="settings-icon"
                layout
                onClick={() => setOpen(true)}
                className="cursor-pointer rounded-full p-1 hover:bg-neutral-200 hover:dark:bg-neutral-600"
            >
                <SettingsIcon />
            </motion.div>
            {open && (
                <SettingsDialog
                    key="settings-dialog"
                    close={() => setOpen(false)}
                />
            )}
        </AnimatePresence>
    );
}
