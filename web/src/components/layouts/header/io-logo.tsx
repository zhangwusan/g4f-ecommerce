
const defaultText: string = "G4F"
export default function Logo({ text = defaultText }: { text: string }) {
    return <div className="text-2xl font-bold">{text}</div>
}