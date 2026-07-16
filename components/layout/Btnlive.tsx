import Link from "next/link"

export default function Page () {
    return (
        <div className="fixed bottom-28 right-4 z-40 animate-bounce">
            <div
                className="bg-black/80 backdrop-blur border border-primary/30 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                
                    <span className="flex gap-0.5 items-end h-3">
                        <span className="w-0.5 h-1 bg-primary animate-[pulse_1s_ease-in-out_infinite]"></span>
                        <span className="w-0.5 h-3 bg-primary animate-[pulse_1.5s_ease-in-out_infinite]"></span>
                        <span className="w-0.5 h-2 bg-primary animate-[pulse_1.2s_ease-in-out_infinite]"></span>
                    </span>
                <Link href="/live-music">
                    <span>Direct : Kivu FM</span>
                </Link>
            </div>
        </div>
    )
}