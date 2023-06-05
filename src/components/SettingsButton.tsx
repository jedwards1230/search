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
            <motion.div layout onClick={openDialog} className="cursor-pointer">
                <SettingsIcon />
            </motion.div>
            {open && <SettingsDialog close={closeDialog} />}
        </AnimatePresence>
    );
}
