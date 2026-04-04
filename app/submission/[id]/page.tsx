export default async function Submission({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    return (
        <div className="container pt-16">
            <h1 className="text-3xl font-bold mb-3">
                Submission {id}
            </h1>
            <p className="text-secondary text-sm">
                Submission [...] at time [...].
            </p>
        </div>
    );
}
