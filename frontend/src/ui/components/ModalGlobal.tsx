import {
  Modal,
  ModalBody,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@rayan.boussouda/ui-kit";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormModal = ({
  open,
  onClose,
  title,
  description,
  children,
}: FormModalProps) => (
  <Modal open={open} onClose={onClose} className="w-full max-w-md">
    <ModalHeader>
      <ModalTitle>{title}</ModalTitle>
      {description && <ModalDescription>{description}</ModalDescription>}
    </ModalHeader>
    <ModalBody>{children}</ModalBody>
  </Modal>
);
