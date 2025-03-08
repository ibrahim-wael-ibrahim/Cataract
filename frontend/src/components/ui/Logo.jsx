import Link from "next/link";
import { View } from "lucide-react";

export default  function Logo({ className  , textSize="text-2xl"}){
    return (
        <Link href="/" id="brand" className={`flex  font-agency uppercase font-bold  items-center  gap-1 ${className} ${textSize}`}>
            <View  className="text-boston-blue-200"/>
            <span>Cataract</span>
        </Link>
    )
}