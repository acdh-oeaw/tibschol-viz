export default function Home() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">Welcome!</h1>

            <p className="mb-6">
                <a target="_blank" href="https://www.oeaw.ac.at/projects/tibschol/home"><strong>TibSchol</strong></a> explores the formative
                phase of the Tibetan Buddhist scholastic tradition
                from the 11th to 13th century — an exceptionally active period of Tibetan scholarly creativity.
            </p>
            <div className="bg-[color:var(--color-background)] border-l-4 border-cyan-500 p-4 my-6 rounded shadow text-[var(--color-foreground)]">
                <div className="text-base leading-relaxed">
                    <ul>
                        <li>Who were the individuals involved in the early Tibetan scholastic tradition?</li>
                        <li>What connections existed between them and with enclaves of learning?</li>
                        <li>What works did they compose, teach, and study?</li>
                        <li>What was the extent of the diffusion and the mode of circulation of these works?
                        </li>
                    </ul>
                </div>
            </div>
            <p className="mb-6">
                This website offers interactive visualisations to help explore these questions—through networks, trees, and topic-based views of individuals, works and places. Please note that this is an <span className="text-yellow-500">experimental</span> research tool, and the data and interface are still evolving. Interpret results with care, as the dataset is not yet fully validated or comprehensive.
            </p>
        </div >
    );
}
