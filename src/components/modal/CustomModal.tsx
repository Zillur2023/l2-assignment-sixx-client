import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/modal";
import { ReactNode } from "react";

interface IProps {
  openButtonText?: string;
  actionButtonText?: string;
  title: string | ReactNode;
  children: ReactNode;
  buttonVariant?:
    | "light"
    | "solid"
    | "bordered"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost"
    | undefined;
  buttonClassName?: string;
  openButton?:ReactNode
  onUpdate?: () =>  void; 
  footerButton?: boolean

}

export default function CustomModal({
  openButtonText,
  actionButtonText="Update",
  title,
  children,
  buttonVariant = "light",
  buttonClassName,
  onUpdate,
  openButton,
  footerButton = true
}: IProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
   
      {openButton?  
          <div onClick={onOpen}>{openButton}</div>
         : <Button
        className={buttonClassName}
        variant={buttonVariant}
        onPress={onOpen}
      >
        {openButtonText}
      </Button>}
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>{children}</ModalBody>
             {
              footerButton &&  <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              
              <Button color="primary" onPress={() => {
                  // onUpdate(); 
                  if (onUpdate) onUpdate();
                  onClose();
                }}>
                {actionButtonText}
              </Button>
            </ModalFooter>
             }
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
