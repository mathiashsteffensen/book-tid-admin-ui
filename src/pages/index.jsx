import Loader from '../../public/loader.svg';

export default function IndexPage() {
    return (
        <main className="h-screen w-screen flex justify-center items-center flex-col">
            <Loader className="w-32 animate-spin-slow" />
            <h2 className="mt-12 text-3xl font-semibold">
                Loading ..<span className="animate-ping">.</span>
            </h2>
        </main>
    );
}

export async function getServerSideProps({ req }) {
    return {
        redirect: {
            permanent: true,
            destination: '/kalender',
        },
    };
}
