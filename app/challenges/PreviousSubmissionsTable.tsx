export default function PreviousSubmissionsTable() {
    return (
        <table className="w-full border border-tertiary">
            <thead>
            <tr className="border-b border-tertiary">
                <th className="px-2 w-12 text-right">#</th>
                <th className="px-2 w-36 text-left font-semibold">Submission ID</th>
                <th className="px-2 w-36 text-left font-semibold">Length</th>
                <th className="px-2 text-left font-semibold">Score</th>
            </tr>
            </thead>
            <tbody>
            {Array(22).fill(0).map((_, i) => (
                <tr key={i} className="bg-black/10">
                    <td className="text-secondary text-right px-2">{i + 1}</td>
                    <td className="px-2 py-0.5">aef97236</td>
                    <td className="px-2">235</td>
                    <td className="px-2">16/20</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
