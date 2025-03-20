import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface CustomDrawerProps {
  triggerText: string;
  title?: string;
  description?: string;
  content: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  open:any,
  setIsOpen:any
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  triggerText,
  title,
  description,
  content,
  onSubmit,
  open,
  setIsOpen,
  submitText = "Submit",
}) => {
  return (
    <Drawer open={open} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>{triggerText}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="p-4">{content}</div>
        <DrawerFooter>
          {onSubmit && <Button onClick={onSubmit}>{submitText}</Button>}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
