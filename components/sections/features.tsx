import AiCodeReviews from "./features/ai-code-reviews"
import RealtimeCodingPreviews from "./features/real-time-previews"
import CompatibleServices from "./features/compatible-services"
import MCPConnectivityIllustration from "./features/middleware" // Updated import
import EasyDeployment from "./features/easy-deployment"
import ParallelCodingAgents from "./features/parallel-agents" // Updated import

const FeatureCard = ({ title, description, Component }) => (
    <div className="overflow-hidden rounded-md border border-white/20 flex flex-col justify-start items-start relative">
        <div
            className="absolute inset-0 rounded-md"
            style={{
                background: "#15171a",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
            }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-md" />

        <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10">
            <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <p className="self-stretch text-foreground font-normal leading-7">
                    {title} <br />
                    <span className="text-muted-foreground">{description}</span>
                </p>
            </div>
        </div>
        <div className="self-stretch h-72 relative -mt-0.5 z-10">
            <Component />
        </div>
    </div>
)

export function Features() {
    const cards = [
        {
            title: "Functional",
            description: "Offers a functional programming approach to background task processing.",
            Component: AiCodeReviews,
        },
        {
            title: "Web-based UI",
            description: "Intuitive web interface for managing and monitoring background tasks.",
            Component: RealtimeCodingPreviews,
        },
        {
            title: "Compatible with popular backends",
            description: "Easily connect your projects to databases and services.",
            Component: CompatibleServices,
        },
        {
            title: "Flexible Middleware",
            description: "Provides middleware support build on top of tower",
            Component: MCPConnectivityIllustration, // Updated component
        },
        {
            title: "Workflow Orchestration", // Swapped position
            description: "Coordinate complex background tasks with ease.",
            Component: ParallelCodingAgents, // Updated component
        },
        {
            title: "Observability", // Swapped position
            description: "Gain insights into your background processes with built-in instrumentation.",
            Component: EasyDeployment,
        },
    ]

    return (
        <section className="w-full max-w-screen-xl mx-auto px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
            <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
                <div className="w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
                <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
                    <div className="flex flex-col justify-start items-center gap-4">
                        <h2 className="font-display mb-6 text-2xl sm:text-3xl lg:text-4xl text-white text-center">
                            Feature rich
                        </h2>
                        <p className="text-center max-w-xl mx-auto">
                            Apalis offers a complete developer toolset for background processing in rust. Process background tasks confidently, concurrently and fearlessly
                        </p>
                    </div>
                </div>
                <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
                    {cards.map((card) => (
                        <FeatureCard key={card.title} {...card} />
                    ))}
                </div>
            </div>
        </section>
    )
}
