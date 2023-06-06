import { AnimatePresence, motion } from 'framer-motion';

import SettingsIcon from './SettingsIcon';
import SettingsDialog from './SettingsDialog';

export default function SettingsButton({
    open,
    openDialog,
    closeDialog,
}: {
    open: boolean;
    openDialog: () => void;
    closeDialog: () => void;
}) {
    return (
        <AnimatePresence>
            <motion.div
                key="settings-icon"
                layout
                onClick={openDialog}
                className="cursor-pointer"
            >
                <SettingsIcon />
            </motion.div>
            {open && (
                <SettingsDialog key="settings-dialog" close={closeDialog} />
            )}
        </AnimatePresence>
    );
}
