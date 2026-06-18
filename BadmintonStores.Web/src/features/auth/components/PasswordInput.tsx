import { useState } from "react";
import {Eye, EyeOff} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>

export function PasswordInput(props: PasswordInputProps)
{
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                type={visible ? "text" : "password"}
                className={cn("pr-10", props.className)}>
            </Input>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/8 h-8 w-8"
                onClick={() => setVisible((value) => !value)}>
                {visible ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </Button>
        </div>
    )
}