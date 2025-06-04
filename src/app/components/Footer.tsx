'use client';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full text-center text-sm py-4 mt-auto">
      © {year ?? '…'} TibSchol: The Dawn of Tibetan Buddhist Scholasticism (11th–13th c.){' '}
      <a href="https://doi.org/10.3030/101001002" target="_blank" rel="noopener noreferrer">
        10.3030/101001002
      </a>
    </footer>
  );
}
