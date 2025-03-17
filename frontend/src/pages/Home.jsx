import Navbar from '../components/Navbar';
import ContestList from '../components/contest-list'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-neutral-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-16">
        <ContestList />
      </main>
      <Footer />
    </div>
  );
}