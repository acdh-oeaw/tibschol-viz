'use client';
import './Header.css';
import Link from 'next/link';

export default function Header() {
  return (
        <header>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/explore">Explore</Link>

                <div className="group">
                    <div>Visualisations</div>
                    <div>
                        <Link href="/explore">Topics</Link>
                        <Link href="/explore">Timeline</Link>

                    </div>
                </div>
            </nav>
        </header>
    );
}
