import React from "react";
import Modal from "@/shared/components/Modal/Modal";
import Button from "@/shared/components/UI/Button/Button";

interface BackupCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  backupCodes: string[];
}

const BackupCodesModal: React.FC<BackupCodesModalProps> = ({
  isOpen,
  onClose,
  backupCodes,
}) => {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([backupCodes.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = "msaas-backup-codes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={<h3>Save Your Backup Codes</h3>}
    >
      <div className="flex flex-col gap-4">
        <div className="p-3 bg-[var(--color-yellow-50)] border border-[var(--color-yellow-200)] rounded text-sm text-[var(--color-yellow-800)]">
          <strong>Important:</strong> These codes are your only way to access your account if you lose your device. Save them somewhere safe. <strong>They will only be shown once.</strong>
        </div>

        <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 border rounded text-center font-mono tracking-widest text-sm">
          {backupCodes.map((code, idx) => (
            <div key={idx} className="p-1 bg-white border rounded">
              {code}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="primary" onClick={handleDownload} className="flex-1">
            Download .txt
          </Button>

          <Button variant="outlinePrimary" onClick={handleCopy} className="flex-1">
            Copy to Clipboard
          </Button>
        </div>
        
        <div className="flex justify-center mt-2">
            <Button variant="ghost" onClick={onClose}>
                I have saved them
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BackupCodesModal;
